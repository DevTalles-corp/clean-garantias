import { getCategoryIcon } from '@/categories/presentation/constants/category-icons';
import { defaultCategories } from '@/categories/presentation/constants/default-categories';

describe('getCategoryIcon', () => {
  test('cada categoría inicial tiene un icono distinto', () => {
    const names = defaultCategories.map(({ icon }) => getCategoryIcon(icon));
    expect(new Set(names).size).toBe(defaultCategories.length);
  });

  test.each(['desconocido', 'constructor', ''])('«%s» usa el icono de respaldo', (icon) => {
    expect(getCategoryIcon(icon)).toBe('categoryOther');
  });
});
