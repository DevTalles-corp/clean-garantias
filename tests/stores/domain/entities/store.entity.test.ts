import { Store, type CreateStoreProps } from '@/stores/domain/entities/store.entity';

const id = '3f2b8c1e-4d5a-4b6c-8d7e-9f0a1b2c3d4e';

const validProps: CreateStoreProps = {
  id,
  name: 'Tienda Central',
  website: 'https://example.com',
  phone: '555-0100',
  email: 'ventas@example.com',
  address: 'Calle 1',
  createdAt: '2026-01-15',
};

const optionalFields = ['website', 'phone', 'email', 'address'] as const;

const validationError = (message: string) =>
  expect.objectContaining({ name: 'ValidationError', message });

describe('Store Entity', () => {
  test('crea una tienda con sus datos normalizados', () => {
    const store = Store.create({
      ...validProps,
      id: `  ${id.toUpperCase()}  `,
      name: '  Tienda Central  ',
      website: '  https://example.com  ',
      phone: '  555-0100  ',
      email: '  VENTAS@Example.com  ',
      address: '  Calle 1  ',
    });

    expect(store).toBeInstanceOf(Store);
    expect({ ...store }).toEqual(validProps);
  });

  test('admite solo los datos obligatorios', () => {
    const store = Store.create({ id, name: 'Tienda Central', createdAt: '2026-01-15' });

    for (const field of optionalFields) expect(store[field]).toBeUndefined();
  });

  test.each(optionalFields)('trata %s vacío como ausente', (field) => {
    expect(Store.create({ ...validProps, [field]: '   ' })[field]).toBeUndefined();
  });

  test.each([
    ['id', 'abc', 'El id debe ser un UUID válido.'],
    ['id', '', 'El id debe ser un UUID válido.'],
    ['name', '', 'El nombre es obligatorio.'],
    ['name', '\t\n', 'El nombre es obligatorio.'],
    ['createdAt', '2026-02-30', 'La fecha de creación no es válida.'],
  ])('rechaza %s con el valor %j', (field, value, message) => {
    expect(() => Store.create({ ...validProps, [field]: value })).toThrow(validationError(message));
  });

  test('impide modificar sus datos en ejecución', () => {
    const store = Store.create(validProps);

    expect(Reflect.set(store, 'name', 'Otra')).toBe(false);
    expect(store.name).toBe('Tienda Central');
  });

  test('normaliza un id', () => {
    expect(Store.normalizeId(`  ${id.toUpperCase()}  `)).toBe(id);
  });
});
