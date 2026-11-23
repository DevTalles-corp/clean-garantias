// Contrato del dominio ProductRepository: define cómo consultar, guardar y borrar los productos sin elegir una tecnología.
// Invierte la dependencia; sin él, los casos de uso quedarían acoplados a un almacenamiento concreto.
// delete solo borra el producto: la cascada la coordina la capa de aplicación.

import type { Product } from '@/products/domain/entities/product.entity';

export interface ProductRepository {
  findById(id: string): Promise<Product | undefined>;
  findAll(): Promise<Product[]>;
  findByCategoryId(categoryId: string): Promise<Product[]>;
  findByStoreId(storeId: string): Promise<Product[]>;
  save(product: Product): Promise<void>; // crea o reemplaza según el id
  delete(id: string): Promise<void>;
}
