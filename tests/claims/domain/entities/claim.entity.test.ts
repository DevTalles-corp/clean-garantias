import {
  Claim,
  claimStatuses,
  type CreateClaimProps,
  type RestoreClaimProps,
} from '@/claims/domain/entities/claim.entity';

const id = '3f2b8c1e-4d5a-4b6c-8d7e-9f0a1b2c3d4e';
const warrantyId = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';

const validProps: CreateClaimProps = {
  id,
  warrantyId,
  issue: 'No enciende',
  ticketNumber: 'T-100',
  warrantyEndDate: '2026-06-30',
  openedAt: '2026-06-01',
};

const storedProps: RestoreClaimProps = {
  id,
  warrantyId,
  issue: 'No enciende',
  ticketNumber: 'T-100',
  status: 'resolved',
  openedAt: '2026-06-01',
  resolvedAt: '2026-06-10',
  resolution: 'Equipo reemplazado',
  updatedAt: '2026-06-10',
};

const validationError = (message: string) =>
  expect.objectContaining({ name: 'ValidationError', message });
const conflictError = (message: string) =>
  expect.objectContaining({ name: 'ConflictError', message });

describe('Claim Entity', () => {
  describe('create', () => {
    test('crea un reclamo abierto con sus datos normalizados', () => {
      const claim = Claim.create({
        ...validProps,
        id: `  ${id.toUpperCase()}  `,
        warrantyId: `  ${warrantyId.toUpperCase()}  `,
        issue: '  No enciende  ',
        ticketNumber: '  T-100  ',
      });

      expect(claim).toBeInstanceOf(Claim);
      expect({ ...claim }).toEqual({
        id,
        warrantyId,
        issue: 'No enciende',
        ticketNumber: 'T-100',
        status: 'open',
        openedAt: '2026-06-01',
        resolvedAt: undefined,
        resolution: undefined,
        updatedAt: '2026-06-01',
      });
    });

    test.each([undefined, '', '   '])('trata el número de ticket %j como ausente', (ticketNumber) => {
      expect(Claim.create({ ...validProps, ticketNumber }).ticketNumber).toBeUndefined();
    });

    test('permite abrirlo el día del vencimiento', () => {
      expect(Claim.create({ ...validProps, openedAt: '2026-06-30' }).openedAt).toBe('2026-06-30');
    });

    test('rechaza abrirlo después del vencimiento', () => {
      expect(() => Claim.create({ ...validProps, openedAt: '2026-07-01' })).toThrow(
        conflictError('No se puede abrir un reclamo sobre una garantía vencida.'),
      );
    });

    test.each([
      ['id', 'abc', 'El id debe ser un UUID válido.'],
      ['warrantyId', '', 'La garantía debe ser un UUID válido.'],
      ['issue', '   ', 'La descripción del problema es obligatoria.'],
      ['openedAt', '2026-02-30', 'La fecha de apertura no es válida.'],
      ['warrantyEndDate', '2026-02-30', 'La fecha de vencimiento no es válida.'],
    ])('rechaza %s con el valor %j', (field, value, message) => {
      expect(() => Claim.create({ ...validProps, [field]: value })).toThrow(validationError(message));
    });
  });

  describe('restore', () => {
    test('reconstruye un reclamo existente', () => {
      const claim = Claim.restore(storedProps);

      expect(claim).toBeInstanceOf(Claim);
      expect({ ...claim }).toEqual(storedProps);
    });

    test.each(claimStatuses)('admite el estado %s', (status) => {
      expect(Claim.restore({ ...storedProps, status }).status).toBe(status);
    });

    test.each(['open', 'in_progress'] as const)('no exige fecha de resolución en %s', (status) => {
      expect(Claim.restore({ ...storedProps, status, resolvedAt: undefined }).resolvedAt).toBeUndefined();
    });

    test.each([
      ['resolved', undefined],
      ['resolved', '   '],
      ['rejected', undefined],
      ['rejected', ''],
    ] as const)('rechaza el estado %s con fecha de resolución %j', (status, resolvedAt) => {
      expect(() => Claim.restore({ ...storedProps, status, resolvedAt })).toThrow(
        validationError('Un reclamo resuelto o rechazado requiere fecha de resolución.'),
      );
    });

    test.each([
      ['status', 'closed', 'El estado del reclamo no es válido.'],
      ['resolvedAt', '2026-02-30', 'La fecha de resolución no es válida.'],
      ['updatedAt', 'ayer', 'La fecha de actualización no es válida.'],
    ])('rechaza %s con el valor %j', (field, value, message) => {
      expect(() => Claim.restore({ ...storedProps, [field]: value })).toThrow(validationError(message));
    });
  });

  describe('update', () => {
    test('devuelve una copia resuelta sin modificar el original', () => {
      const claim = Claim.create(validProps);
      const updated = claim.update(
        { status: 'resolved', resolvedAt: '2026-06-10', resolution: '  Equipo reemplazado  ' },
        '2026-06-10',
      );

      expect(updated).not.toBe(claim);
      expect({ ...updated }).toEqual(storedProps);
      expect(claim.status).toBe('open');
      expect(claim.updatedAt).toBe('2026-06-01');
    });

    test('conserva identidad, garantía y fecha de apertura', () => {
      const changes = { id: warrantyId, warrantyId: id, openedAt: '2020-01-01', issue: 'Otra falla' };
      const updated = Claim.restore(storedProps).update(changes, '2026-06-11');

      expect({ ...updated }).toEqual({ ...storedProps, issue: 'Otra falla', updatedAt: '2026-06-11' });
    });

    test('borra un campo opcional enviado como undefined', () => {
      const updated = Claim.restore(storedProps).update({ ticketNumber: undefined }, '2026-06-11');

      expect(updated.ticketNumber).toBeUndefined();
      expect(updated.resolution).toBe('Equipo reemplazado');
    });

    test('rechaza resolver sin fecha de resolución', () => {
      expect(() => Claim.create(validProps).update({ status: 'resolved' }, '2026-06-10')).toThrow(
        validationError('Un reclamo resuelto o rechazado requiere fecha de resolución.'),
      );
    });

    test('rechaza una fecha de actualización inválida', () => {
      expect(() => Claim.create(validProps).update({}, '2026-02-30')).toThrow(
        validationError('La fecha de actualización no es válida.'),
      );
    });
  });

  test('impide modificar sus datos en ejecución', () => {
    const claim = Claim.create(validProps);

    expect(Reflect.set(claim, 'status', 'resolved')).toBe(false);
    expect(claim.status).toBe('open');
  });

  test('normaliza un id', () => {
    expect(Claim.normalizeId(`  ${id.toUpperCase()}  `)).toBe(id);
  });
});
