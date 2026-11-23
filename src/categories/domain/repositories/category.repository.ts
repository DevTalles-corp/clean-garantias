// Contrato del dominio CategoryRepository: define cómo consultar, guardar y borrar las categorías sin elegir una tecnología.
// Invierte la dependencia; sin él, los casos de uso quedarían acoplados a un almacenamiento concreto.

import type { Category } from '@/categories/domain/entities/category.entity';

export interface CategoryRepository {
  findById(id: string): Promise<Category | undefined>;
  findAll(): Promise<Category[]>;
  save(category: Category): Promise<void>; // crea o reemplaza según el id
  delete(id: string): Promise<void>;
}
