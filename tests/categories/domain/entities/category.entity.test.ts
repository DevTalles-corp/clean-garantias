import { Category, type CreateCategoryProps } from '@/categories/domain/entities/category.entity';

const id = '3f2b8c1e-4d5a-4b6c-8d7e-9f0a1b2c3d4e';

const validProps: CreateCategoryProps = {
  id,
  name: 'Electrónica',
  icon: 'desktopcomputer',
  color: '#1A2b3C',
  defaultWarrantyMonths: 12,
  createdAt: '2026-01-15',
};

const validationError = (message: string) =>
  expect.objectContaining({ name: 'ValidationError', message });

describe('Category Entity', () => {
  test('crea una categoría con sus datos normalizados', () => {
    const category = Category.create({
      ...validProps,
      id: `  ${id.toUpperCase()}  `,
      name: '  Electrónica  ',
      icon: '  desktopcomputer  ',
      color: '  #1A2b3C  ',
    });

    expect(category).toBeInstanceOf(Category);
    expect({ ...category }).toEqual({ ...validProps, isSystem: false });
  });

  test.each([true, false])('conserva isSystem %s', (isSystem) => {
    expect(Category.create({ ...validProps, isSystem }).isSystem).toBe(isSystem);
  });

  test.each(['#fff', '#FFF', '#a1b2c3', '#A1B2C3'])('admite el color %s', (color) => {
    expect(Category.create({ ...validProps, color }).color).toBe(color);
  });

  test.each(['', 'fff', '#ff', '#ffff', '#fffff', '#fffffff', '#ggg', 'red'])(
    'rechaza el color %j',
    (color) => {
      expect(() => Category.create({ ...validProps, color })).toThrow(
        validationError('El color debe ser un valor hexadecimal válido.'),
      );
    },
  );

  test.each([1, 240])('admite una duración sugerida de %d meses', (defaultWarrantyMonths) => {
    expect(Category.create({ ...validProps, defaultWarrantyMonths }).defaultWarrantyMonths).toBe(
      defaultWarrantyMonths,
    );
  });

  test.each([-1, 0, 241, 1.5, NaN, Infinity])(
    'rechaza una duración sugerida de %d meses',
    (defaultWarrantyMonths) => {
      expect(() => Category.create({ ...validProps, defaultWarrantyMonths })).toThrow(
        validationError('La duración sugerida debe ser un entero entre 1 y 240 meses.'),
      );
    },
  );

  test.each([
    ['id', 'abc', 'El id debe ser un UUID válido.'],
    ['id', '', 'El id debe ser un UUID válido.'],
    ['name', '   ', 'El nombre es obligatorio.'],
    ['icon', '\t\n', 'El ícono es obligatorio.'],
    ['createdAt', '2026-02-30', 'La fecha de creación no es válida.'],
  ])('rechaza %s con el valor %j', (field, value, message) => {
    expect(() => Category.create({ ...validProps, [field]: value })).toThrow(validationError(message));
  });

  test('impide modificar sus datos en ejecución', () => {
    const category = Category.create(validProps);

    expect(Reflect.set(category, 'name', 'Otra')).toBe(false);
    expect(category.name).toBe('Electrónica');
  });

  test('normaliza un id', () => {
    expect(Category.normalizeId(`  ${id.toUpperCase()}  `)).toBe(id);
  });
});
