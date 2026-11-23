import { Warranty } from '@/warranties/domain/entities/warranty.entity';
import { WarrantyMapper } from '@/warranties/infrastructure/mappers/warranty.mapper';

const warranty = Warranty.restore({
  id: '00000004-0000-4000-8000-000000000000',
  productId: '00000003-0000-4000-8000-000000000000',
  type: 'extended',
  provider: 'Acme',
  startDate: '2026-01-10',
  durationMonths: 24,
  policyNumber: 'P-1',
  coverage: 'Total',
  contactPhone: '555',
  contactEmail: 'a@acme.test',
  isArchived: true,
  createdAt: '2026-01-15',
  updatedAt: '2026-02-01',
});

describe('WarrantyMapper', () => {
  test('conserva todos los datos al convertir a fila y de vuelta', () => {
    const restored = WarrantyMapper.toDomain(WarrantyMapper.toRow(warranty));

    expect(restored).toBeInstanceOf(Warranty);
    expect({ ...restored }).toEqual({ ...warranty });
  });

  test('convierte los opcionales ausentes en null y de vuelta', () => {
    const minimal = Warranty.restore({
      ...warranty,
      policyNumber: undefined,
      coverage: undefined,
      contactPhone: undefined,
      contactEmail: undefined,
    });
    const row = WarrantyMapper.toRow(minimal);

    expect(Object.values(row)).not.toContain(undefined);
    expect(Object.values(row)).toContain(null);
    expect({ ...WarrantyMapper.toDomain(row) }).toEqual({ ...minimal });
  });

  test('rechaza una fila con datos inválidos', () => {
    expect(() => WarrantyMapper.toDomain({ ...WarrantyMapper.toRow(warranty), type: 'x' })).toThrow(
      expect.objectContaining({ name: 'ValidationError' }),
    );
  });
});
