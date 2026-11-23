import {
  Product,
  type CreateProductProps,
  type RestoreProductProps,
} from '@/products/domain/entities/product.entity';

const id = '3f2b8c1e-4d5a-4b6c-8d7e-9f0a1b2c3d4e';
const categoryId = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
const storeId = 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e';

const validProps: CreateProductProps = {
  id,
  name: 'Laptop',
  brand: 'Acme',
  model: 'X1',
  serialNumber: 'SN-001',
  categoryId,
  storeId,
  purchaseDate: '2026-01-10',
  purchasePrice: { amountCents: 150_000, currency: 'USD' },
  imageUri: 'file:///laptop.png',
  notes: 'Con cargador',
  createdAt: '2026-01-15',
};

const storedProps: RestoreProductProps = {
  ...validProps,
  updatedAt: '2026-02-01',
};

const optionalTextFields = [
  'brand',
  'model',
  'serialNumber',
  'storeId',
  'imageUri',
  'notes',
] as const;

const validationError = (message: string) =>
  expect.objectContaining({ name: 'ValidationError', message });

describe('Product Entity', () => {
  describe('create', () => {
    test('crea un producto con sus datos normalizados', () => {
      const product = Product.create({
        ...validProps,
        id: `  ${id.toUpperCase()}  `,
        name: '  Laptop  ',
        brand: '  Acme  ',
        model: '  X1  ',
        serialNumber: '  SN-001  ',
        categoryId: `  ${categoryId.toUpperCase()}  `,
        storeId: `  ${storeId.toUpperCase()}  `,
        imageUri: '  file:///laptop.png  ',
        notes: '  Con cargador  ',
      });

      expect(product).toBeInstanceOf(Product);
      expect({ ...product }).toEqual({
        ...validProps,
        updatedAt: '2026-01-15',
      });
    });

    test.each(optionalTextFields)('trata %s vacío como ausente', (field) => {
      expect(
        Product.create({ ...validProps, [field]: '   ' })[field]
      ).toBeUndefined();
    });

    test('admite solo los datos obligatorios', () => {
      const product = Product.create({
        id,
        name: 'Laptop',
        categoryId,
        purchaseDate: '2026-01-10',
        createdAt: '2026-01-15',
      });

      expect(product.purchasePrice).toBeUndefined();
      for (const field of optionalTextFields)
        expect(product[field]).toBeUndefined();
    });

    test('admite un precio de cero', () => {
      const purchasePrice = { amountCents: 0, currency: 'MXN' } as const;

      expect(
        Product.create({ ...validProps, purchasePrice }).purchasePrice
      ).toEqual(purchasePrice);
    });

    test('guarda una copia congelada del precio', () => {
      const purchasePrice = { amountCents: 100, currency: 'USD' as const };
      const product = Product.create({ ...validProps, purchasePrice });

      purchasePrice.amountCents = 999;

      expect(product.purchasePrice).toEqual({
        amountCents: 100,
        currency: 'USD',
      });
      expect(Object.isFrozen(product.purchasePrice)).toBe(true);
    });

    test.each([
      [
        { amountCents: -1, currency: 'USD' },
        'El precio de compra no puede ser negativo.',
      ],
      [
        { amountCents: 10.5, currency: 'USD' },
        'El monto debe ser un número entero de centavos.',
      ],
      [
        { amountCents: NaN, currency: 'USD' },
        'El monto debe ser un número entero de centavos.',
      ],
      [{ amountCents: 100, currency: 'XXX' }, 'La moneda no es válida.'],
    ])('rechaza el precio %j', (purchasePrice, message) => {
      expect(() =>
        Product.create({
          ...validProps,
          purchasePrice: purchasePrice as CreateProductProps['purchasePrice'],
        })
      ).toThrow(validationError(message));
    });

    test.each([
      ['id', 'abc', 'El id debe ser un UUID válido.'],
      ['name', '   ', 'El nombre es obligatorio.'],
      ['categoryId', '', 'La categoría debe ser un UUID válido.'],
      ['storeId', 'abc', 'La tienda debe ser un UUID válido.'],
      ['purchaseDate', '2026-02-30', 'La fecha de compra no es válida.'],
      ['createdAt', '15/01/2026', 'La fecha de creación no es válida.'],
    ])('rechaza %s con el valor %j', (field, value, message) => {
      expect(() => Product.create({ ...validProps, [field]: value })).toThrow(
        validationError(message)
      );
    });
  });

  describe('restore', () => {
    test('reconstruye un producto existente', () => {
      const product = Product.restore(storedProps);

      expect(product).toBeInstanceOf(Product);
      expect({ ...product }).toEqual(storedProps);
    });

    test('rechaza una fecha de actualización inválida', () => {
      expect(() =>
        Product.restore({ ...storedProps, updatedAt: '2026-02-30' })
      ).toThrow(validationError('La fecha de actualización no es válida.'));
    });
  });

  describe('update', () => {
    test('devuelve una copia con los cambios sin modificar el original', () => {
      const product = Product.restore(storedProps);
      const updated = product.update({ name: '  Laptop Pro  ' }, '2026-03-01');

      expect(updated).not.toBe(product);
      expect({ ...updated }).toEqual({
        ...storedProps,
        name: 'Laptop Pro',
        updatedAt: '2026-03-01',
      });
      expect({ ...product }).toEqual(storedProps);
    });

    test('conserva el id y la fecha de creación', () => {
      const changes = {
        name: 'Laptop',
        id: storeId,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01',
      };
      const updated = Product.restore(storedProps).update(
        changes,
        '2026-03-01'
      );

      expect({ ...updated }).toEqual({
        ...storedProps,
        updatedAt: '2026-03-01',
      });
    });

    test('borra los campos opcionales enviados como undefined', () => {
      const updated = Product.restore(storedProps).update(
        { storeId: undefined, purchasePrice: undefined },
        '2026-03-01'
      );

      expect(updated.storeId).toBeUndefined();
      expect(updated.purchasePrice).toBeUndefined();
      expect(updated.brand).toBe('Acme');
    });

    test('valida los cambios', () => {
      expect(() =>
        Product.restore(storedProps).update({ name: '' }, '2026-03-01')
      ).toThrow(validationError('El nombre es obligatorio.'));
    });
  });

  test('impide modificar sus datos en ejecución', () => {
    const product = Product.create(validProps);

    expect(Reflect.set(product, 'name', 'Otro')).toBe(false);
    expect(product.name).toBe('Laptop');
  });

  test('normaliza un id', () => {
    expect(Product.normalizeId(`  ${id.toUpperCase()}  `)).toBe(id);
  });
});
