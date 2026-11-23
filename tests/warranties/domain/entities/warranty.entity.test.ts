import {
  getWarrantyStatus,
  Warranty,
  warrantyTypes,
  type CreateWarrantyProps,
  type RestoreWarrantyProps,
} from '@/warranties/domain/entities/warranty.entity';

const id = '3f2b8c1e-4d5a-4b6c-8d7e-9f0a1b2c3d4e';
const productId = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
const startMessage = 'La garantía no puede iniciar antes de la fecha de compra.';

const data = {
  id,
  productId,
  type: 'manufacturer',
  provider: 'Acme',
  startDate: '2026-01-15',
  durationMonths: 12,
  policyNumber: 'P-100',
  coverage: 'Defectos de fábrica',
  contactPhone: '555-0100',
  contactEmail: 'soporte@example.com',
  createdAt: '2026-01-20',
} as const;

const validProps: CreateWarrantyProps = { ...data, purchaseDate: '2026-01-10' };
const storedProps: RestoreWarrantyProps = { ...data, isArchived: true, updatedAt: '2026-02-01' };

const optionalFields = ['policyNumber', 'coverage', 'contactPhone', 'contactEmail'] as const;

const validationError = (message: string) =>
  expect.objectContaining({ name: 'ValidationError', message });

describe('Warranty Entity', () => {
  describe('create', () => {
    test('crea una garantía con sus datos normalizados', () => {
      const warranty = Warranty.create({
        ...validProps,
        id: `  ${id.toUpperCase()}  `,
        productId: `  ${productId.toUpperCase()}  `,
        provider: '  Acme  ',
        policyNumber: '  P-100  ',
        coverage: '  Defectos de fábrica  ',
        contactPhone: '  555-0100  ',
        contactEmail: '  SOPORTE@Example.com  ',
      });

      expect(warranty).toBeInstanceOf(Warranty);
      expect({ ...warranty }).toEqual({
        ...data,
        endDate: '2027-01-15',
        isArchived: false,
        updatedAt: '2026-01-20',
      });
    });

    test.each(warrantyTypes)('admite el tipo %s', (type) => {
      expect(Warranty.create({ ...validProps, type }).type).toBe(type);
    });

    test.each(optionalFields)('trata %s vacío como ausente', (field) => {
      expect(Warranty.create({ ...validProps, [field]: '   ' })[field]).toBeUndefined();
    });

    test.each([
      ['2026-01-15', 1, '2026-02-15'],
      ['2026-01-31', 1, '2026-02-28'],
      ['2028-01-31', 1, '2028-02-29'],
      ['2028-02-29', 12, '2029-02-28'],
      ['2026-12-31', 2, '2027-02-28'],
      ['2026-01-15', 240, '2046-01-15'],
    ])('si inicia %s y dura %d meses vence %s', (startDate, durationMonths, endDate) => {
      expect(Warranty.create({ ...validProps, startDate, durationMonths }).endDate).toBe(endDate);
    });

    test.each([-1, 0, 241, 1.5, NaN, Infinity])('rechaza una duración de %d meses', (durationMonths) => {
      expect(() => Warranty.create({ ...validProps, durationMonths })).toThrow(
        validationError('La duración debe ser un entero entre 1 y 240 meses.'),
      );
    });

    test('permite iniciar el día de la compra', () => {
      expect(Warranty.create({ ...validProps, purchaseDate: '2026-01-15' }).startDate).toBe('2026-01-15');
    });

    test('rechaza iniciar antes de la compra', () => {
      expect(() => Warranty.create({ ...validProps, purchaseDate: '2026-01-16' })).toThrow(
        validationError(startMessage),
      );
    });

    test.each([
      ['id', 'abc', 'El id debe ser un UUID válido.'],
      ['productId', '', 'El producto debe ser un UUID válido.'],
      ['type', 'lifetime', 'El tipo de garantía no es válido.'],
      ['provider', '   ', 'El proveedor es obligatorio.'],
      ['startDate', '2026-02-30', 'La fecha de inicio no es válida.'],
      ['purchaseDate', '2026-02-30', 'La fecha de compra no es válida.'],
      ['createdAt', 'hoy', 'La fecha de creación no es válida.'],
    ])('rechaza %s con el valor %j', (field, value, message) => {
      expect(() => Warranty.create({ ...validProps, [field]: value })).toThrow(validationError(message));
    });
  });

  describe('restore', () => {
    test('reconstruye una garantía existente', () => {
      const warranty = Warranty.restore(storedProps);

      expect(warranty).toBeInstanceOf(Warranty);
      expect({ ...warranty }).toEqual({ ...storedProps, endDate: '2027-01-15' });
    });

    test('recalcula el vencimiento e ignora el recibido', () => {
      const props = { ...storedProps, endDate: '2099-12-31' };

      expect(Warranty.restore(props).endDate).toBe('2027-01-15');
    });

    test('rechaza una fecha de actualización inválida', () => {
      expect(() => Warranty.restore({ ...storedProps, updatedAt: '2026-02-30' })).toThrow(
        validationError('La fecha de actualización no es válida.'),
      );
    });
  });

  describe('update', () => {
    test('aplica los cambios y recalcula el vencimiento sin modificar el original', () => {
      const warranty = Warranty.restore(storedProps);
      const updated = warranty.update({ durationMonths: 24 }, '2026-01-10', '2026-03-01');

      expect(updated).not.toBe(warranty);
      expect({ ...updated }).toEqual({
        ...storedProps,
        durationMonths: 24,
        endDate: '2028-01-15',
        updatedAt: '2026-03-01',
      });
      expect({ ...warranty }).toEqual({ ...storedProps, endDate: '2027-01-15' });
    });

    test('conserva identidad, producto, archivado y fecha de creación', () => {
      const changes = { provider: 'Acme', id: productId, productId: id, isArchived: false, createdAt: '2020-01-01' };
      const updated = Warranty.restore(storedProps).update(changes, '2026-01-10', '2026-03-01');

      expect({ ...updated }).toEqual({ ...storedProps, endDate: '2027-01-15', updatedAt: '2026-03-01' });
    });

    test('borra un campo opcional enviado como undefined', () => {
      const updated = Warranty.restore(storedProps).update({ coverage: undefined }, '2026-01-10', '2026-03-01');

      expect(updated.coverage).toBeUndefined();
      expect(updated.policyNumber).toBe('P-100');
    });

    test('rechaza iniciar antes de la compra', () => {
      expect(() =>
        Warranty.restore(storedProps).update({ startDate: '2026-01-09' }, '2026-01-10', '2026-03-01'),
      ).toThrow(validationError(startMessage));
    });

    test('valida los cambios', () => {
      expect(() =>
        Warranty.restore(storedProps).update({ provider: '' }, '2026-01-10', '2026-03-01'),
      ).toThrow(validationError('El proveedor es obligatorio.'));
    });
  });

  test.each([true, false])('cambia el archivado a %s sin modificar el original', (isArchived) => {
    const original = { ...storedProps, isArchived: !isArchived };
    const warranty = Warranty.restore(original);

    expect({ ...warranty.setArchived(isArchived, '2026-03-01') }).toEqual({
      ...original,
      endDate: '2027-01-15',
      isArchived,
      updatedAt: '2026-03-01',
    });
    expect(warranty.isArchived).toBe(!isArchived);
  });

  describe('assertStartsAfterPurchase', () => {
    const warranty = Warranty.restore(storedProps);

    test.each(['2026-01-14', '2026-01-15'])('acepta la compra del %s', (purchaseDate) => {
      expect(() => warranty.assertStartsAfterPurchase(purchaseDate)).not.toThrow();
    });

    test('rechaza una compra posterior al inicio', () => {
      expect(() => warranty.assertStartsAfterPurchase('2026-01-16')).toThrow(validationError(startMessage));
    });
  });

  describe('getWarrantyStatus', () => {
    const warranty = Warranty.restore(storedProps); // vence 2027-01-15

    test.each([
      ['2026-12-15', 30, 'active'], // faltan 31 días
      ['2026-12-16', 30, 'expiring'], // faltan 30 días
      ['2027-01-14', 0, 'active'],
      ['2027-01-15', 0, 'expiring'],
      ['2027-01-15', 30, 'expiring'],
      ['2027-01-16', 30, 'expired'],
    ])('el %s con umbral de %d días está %s', (today, thresholdDays, expected) => {
      expect(getWarrantyStatus(warranty, today, thresholdDays)).toBe(expected);
    });

    test('rechaza una fecha actual inválida', () => {
      expect(() => getWarrantyStatus(warranty, '2026-02-30', 30)).toThrow(
        validationError('La fecha actual no es válida.'),
      );
    });

    test.each([-1, 1.5, NaN])('rechaza el umbral %d', (thresholdDays) => {
      expect(() => getWarrantyStatus(warranty, '2026-06-01', thresholdDays)).toThrow(
        validationError('El umbral debe ser un entero mayor o igual a cero.'),
      );
    });
  });

  test('impide modificar sus datos en ejecución', () => {
    const warranty = Warranty.create(validProps);

    expect(Reflect.set(warranty, 'endDate', '2099-12-31')).toBe(false);
    expect(warranty.endDate).toBe('2027-01-15');
  });

  test('normaliza un id', () => {
    expect(Warranty.normalizeId(`  ${id.toUpperCase()}  `)).toBe(id);
  });
});
