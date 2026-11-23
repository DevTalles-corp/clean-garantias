import { Category } from '@/categories/domain/entities/category.entity';
import { CategoryMapper } from '@/categories/infrastructure/mappers/category.mapper';

const category = Category.create({
  id: '00000001-0000-4000-8000-000000000000',
  name: 'Cómputo',
  icon: 'laptopcomputer',
  color: '#208AEF',
  defaultWarrantyMonths: 12,
  isSystem: true,
  createdAt: '2026-01-01',
});

describe('CategoryMapper', () => {
  test('conserva todos los datos al convertir a fila y de vuelta', () => {
    const restored = CategoryMapper.toDomain(CategoryMapper.toRow(category));

    expect(restored).toBeInstanceOf(Category);
    expect({ ...restored }).toEqual({ ...category });
  });

  test('rechaza una fila con datos inválidos', () => {
    expect(() =>
      CategoryMapper.toDomain({ ...CategoryMapper.toRow(category), color: 'x' }),
    ).toThrow(expect.objectContaining({ name: 'ValidationError' }));
  });
});
