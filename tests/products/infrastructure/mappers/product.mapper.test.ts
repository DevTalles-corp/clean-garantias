import { Product } from '@/products/domain/entities/product.entity';
import { ProductMapper } from '@/products/infrastructure/mappers/product.mapper';

const product = Product.restore({
  id: '00000003-0000-4000-8000-000000000000',
  name: 'Laptop',
  brand: 'Acme',
  model: 'X1',
  serialNumber: 'SN',
  categoryId: '00000001-0000-4000-8000-000000000000',
  storeId: '00000002-0000-4000-8000-000000000000',
  purchaseDate: '2026-01-10',
  purchasePrice: { amountCents: 0, currency: 'USD' },
  imageUri: 'file:///a.png',
  notes: 'Nota',
  createdAt: '2026-01-15',
  updatedAt: '2026-02-01',
});

describe('ProductMapper', () => {
  test('conserva todos los datos al convertir a fila y de vuelta', () => {
    const restored = ProductMapper.toDomain(ProductMapper.toRow(product));

    expect(restored).toBeInstanceOf(Product);
    expect({ ...restored }).toEqual({ ...product });
  });

  test('convierte los opcionales ausentes en null y de vuelta', () => {
    const minimal = Product.restore({
      ...product,
      brand: undefined,
      model: undefined,
      serialNumber: undefined,
      storeId: undefined,
      purchasePrice: undefined,
      imageUri: undefined,
      notes: undefined,
    });
    const row = ProductMapper.toRow(minimal);

    expect(Object.values(row)).not.toContain(undefined);
    expect(Object.values(row)).toContain(null);
    expect({ ...ProductMapper.toDomain(row) }).toEqual({ ...minimal });
  });

  test('rechaza una fila con datos inválidos', () => {
    expect(() =>
      ProductMapper.toDomain({ ...ProductMapper.toRow(product), price_currency: 'XXX' }),
    ).toThrow(expect.objectContaining({ name: 'ValidationError' }));
  });
});
