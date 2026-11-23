import { Store } from '@/stores/domain/entities/store.entity';
import { StoreMapper } from '@/stores/infrastructure/mappers/store.mapper';

const store = Store.create({
  id: '00000002-0000-4000-8000-000000000000',
  name: 'Tienda',
  website: 'https://tienda.test',
  phone: '555',
  email: 'a@tienda.test',
  address: 'Calle 1',
  createdAt: '2026-01-01',
});

describe('StoreMapper', () => {
  test('conserva todos los datos al convertir a fila y de vuelta', () => {
    const restored = StoreMapper.toDomain(StoreMapper.toRow(store));

    expect(restored).toBeInstanceOf(Store);
    expect({ ...restored }).toEqual({ ...store });
  });

  test('convierte los opcionales ausentes en null y de vuelta', () => {
    const minimal = Store.create({
      ...store,
      website: undefined,
      phone: undefined,
      email: undefined,
      address: undefined,
    });
    const row = StoreMapper.toRow(minimal);

    expect(Object.values(row)).not.toContain(undefined);
    expect(Object.values(row)).toContain(null);
    expect({ ...StoreMapper.toDomain(row) }).toEqual({ ...minimal });
  });

  test('rechaza una fila con datos inválidos', () => {
    expect(() => StoreMapper.toDomain({ ...StoreMapper.toRow(store), name: '' })).toThrow(
      expect.objectContaining({ name: 'ValidationError' }),
    );
  });
});
