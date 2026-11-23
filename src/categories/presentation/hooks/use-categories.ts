import { useQuery } from '@tanstack/react-query';

import type { Category } from '@/categories/domain/entities/category.entity';
import { defaultCategories } from '@/categories/presentation/constants/default-categories';
import { useUseCases } from '@/shared/presentation/providers/use-cases.context';

// Las categorías iniciales conservan su orden; las del usuario van al final.
function position(category: Category): number {
  const index = defaultCategories.findIndex(({ name }) => name === category.name);
  return index === -1 ? defaultCategories.length : index;
}

export function useCategories() {
  const { categories } = useUseCases();
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categories.findAll.execute(),
    select: (items) => [...items].sort((a, b) => position(a) - position(b)),
  });
}
