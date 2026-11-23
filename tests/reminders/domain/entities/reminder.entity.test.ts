import {
  Reminder,
  reminderStatuses,
  type CreateReminderProps,
  type RestoreReminderProps,
} from '@/reminders/domain/entities/reminder.entity';

const id = '3f2b8c1e-4d5a-4b6c-8d7e-9f0a1b2c3d4e';
const warrantyId = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
const offsetMessage = 'Los días de anticipación deben ser un entero mayor o igual a cero.';

const validProps: CreateReminderProps = {
  id,
  warrantyId,
  offsetDays: 7,
  warrantyEndDate: '2026-06-30',
  createdAt: '2026-01-15',
};

const storedProps: RestoreReminderProps = {
  id,
  warrantyId,
  offsetDays: 7,
  fireAt: '2026-06-23',
  notificationId: 'notif-1',
  status: 'scheduled',
  createdAt: '2026-01-15',
};

const validationError = (message: string) =>
  expect.objectContaining({ name: 'ValidationError', message });
const conflictError = (message: string) =>
  expect.objectContaining({ name: 'ConflictError', message });

describe('Reminder Entity', () => {
  describe('create', () => {
    test('crea un recordatorio programado con sus datos normalizados', () => {
      const reminder = Reminder.create({
        ...validProps,
        id: `  ${id.toUpperCase()}  `,
        warrantyId: `  ${warrantyId.toUpperCase()}  `,
      });

      expect(reminder).toBeInstanceOf(Reminder);
      expect({ ...reminder }).toEqual({ ...storedProps, notificationId: undefined });
    });

    test.each([
      ['id', 'abc', 'El id debe ser un UUID válido.'],
      ['warrantyId', '', 'La garantía debe ser un UUID válido.'],
      ['warrantyEndDate', '2026-02-30', 'La fecha de vencimiento no es válida.'],
      ['createdAt', 'hoy', 'La fecha de creación no es válida.'],
      ['offsetDays', -1, offsetMessage],
      ['offsetDays', 1.5, offsetMessage],
      ['offsetDays', NaN, offsetMessage],
    ])('rechaza %s con el valor %p', (field, value, message) => {
      expect(() => Reminder.create({ ...validProps, [field]: value })).toThrow(validationError(message));
    });
  });

  describe('restore', () => {
    test('reconstruye un recordatorio existente', () => {
      const reminder = Reminder.restore({ ...storedProps, notificationId: '  notif-1  ' });

      expect(reminder).toBeInstanceOf(Reminder);
      expect({ ...reminder }).toEqual(storedProps);
    });

    test.each(reminderStatuses)('admite el estado %s', (status) => {
      expect(Reminder.restore({ ...storedProps, status }).status).toBe(status);
    });

    test.each([undefined, '', '   '])('trata el id de notificación %j como ausente', (notificationId) => {
      expect(Reminder.restore({ ...storedProps, notificationId }).notificationId).toBeUndefined();
    });

    test.each([
      ['fireAt', '2026-02-30', 'La fecha del aviso no es válida.'],
      ['status', 'pending', 'El estado del recordatorio no es válido.'],
      ['offsetDays', -1, offsetMessage],
    ])('rechaza %s con el valor %p', (field, value, message) => {
      expect(() => Reminder.restore({ ...storedProps, [field]: value })).toThrow(validationError(message));
    });
  });

  describe('calculateFireAt', () => {
    test.each([
      ['2026-06-30', 0, '2026-06-30'],
      ['2026-03-01', 1, '2026-02-28'],
      ['2028-03-01', 1, '2028-02-29'],
      ['2026-01-01', 1, '2025-12-31'],
      ['2026-01-15', 30, '2025-12-16'],
    ])('%s menos %d días es %s', (endDate, offsetDays, expected) => {
      expect(Reminder.calculateFireAt(endDate, offsetDays)).toBe(expected);
    });

    test('rechaza una fecha de vencimiento inválida', () => {
      expect(() => Reminder.calculateFireAt('2026-02-30', 1)).toThrow(
        validationError('La fecha de vencimiento no es válida.'),
      );
    });

    test('rechaza días de anticipación inválidos', () => {
      expect(() => Reminder.calculateFireAt('2026-06-30', -1)).toThrow(validationError(offsetMessage));
    });

    test('rechaza un aviso fuera del rango de fechas', () => {
      expect(() => Reminder.calculateFireAt('2026-06-30', Number.MAX_SAFE_INTEGER)).toThrow(
        validationError('La fecha calculada está fuera de rango.'),
      );
    });
  });

  describe('selectSchedulableOffsets', () => {
    test('omite los avisos pasados y conserva los de hoy y los futuros', () => {
      expect(Reminder.selectSchedulableOffsets('2026-06-30', [30, 8, 7, 1, 0], '2026-06-23')).toEqual([7, 1, 0]);
    });

    test('devuelve una lista vacía si todos los avisos pasaron', () => {
      expect(Reminder.selectSchedulableOffsets('2026-06-30', [30, 7, 0], '2026-07-01')).toEqual([]);
    });

    test('rechaza una fecha actual inválida', () => {
      expect(() => Reminder.selectSchedulableOffsets('2026-06-30', [], '2026-02-30')).toThrow(
        validationError('La fecha actual no es válida.'),
      );
    });
  });

  describe('transiciones', () => {
    test('asigna una notificación sin modificar el original', () => {
      const reminder = Reminder.create(validProps);
      const updated = reminder.assignNotification('  notif-1  ');

      expect({ ...updated }).toEqual(storedProps);
      expect(reminder.notificationId).toBeUndefined();
    });

    test.each(['', '   '])('rechaza el id de notificación vacío %j', (notificationId) => {
      expect(() => Reminder.create(validProps).assignNotification(notificationId)).toThrow(
        validationError('El id de la notificación es obligatorio.'),
      );
    });

    test('marca como enviado sin modificar el original', () => {
      const reminder = Reminder.restore(storedProps);

      expect({ ...reminder.markAsSent() }).toEqual({ ...storedProps, status: 'sent' });
      expect(reminder.status).toBe('scheduled');
    });

    test('cancela sin modificar el original', () => {
      const reminder = Reminder.restore(storedProps);

      expect({ ...reminder.cancel() }).toEqual({ ...storedProps, status: 'cancelled' });
      expect(reminder.status).toBe('scheduled');
    });

    describe.each(['sent', 'cancelled'] as const)('desde %s', (status) => {
      const reminder = Reminder.restore({ ...storedProps, status });

      test.each([
        ['asignar una notificación', () => reminder.assignNotification('notif-2')],
        ['marcar como enviado', () => reminder.markAsSent()],
        ['cancelar', () => reminder.cancel()],
      ])('impide %s', (_name, action) => {
        expect(action).toThrow(conflictError('Solo se puede modificar un recordatorio programado.'));
      });
    });
  });

  test('impide modificar sus datos en ejecución', () => {
    const reminder = Reminder.create(validProps);

    expect(Reflect.set(reminder, 'status', 'sent')).toBe(false);
    expect(reminder.status).toBe('scheduled');
  });

  test('normaliza un id', () => {
    expect(Reminder.normalizeId(`  ${id.toUpperCase()}  `)).toBe(id);
  });
});
