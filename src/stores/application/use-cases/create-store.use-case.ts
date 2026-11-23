// Caso de uso de aplicación: crea y guarda una tienda.
// Reúne id, fecha y guardado; sin él, presentación repetiría esos pasos.

import type { Clock } from '@/shared/domain/services/clock';
import type { IdGenerator } from '@/shared/domain/services/id-generator';
import { Store, type CreateStoreData } from '@/stores/domain/entities/store.entity';
import type { StoreRepository } from '@/stores/domain/repositories/store.repository';

export class CreateStoreUseCase {
  private readonly repository: StoreRepository;
  private readonly idGenerator: IdGenerator;
  private readonly clock: Clock;

  constructor(repository: StoreRepository, idGenerator: IdGenerator, clock: Clock) {
    this.repository = repository;
    this.idGenerator = idGenerator;
    this.clock = clock;
  }

  async execute(input: CreateStoreData): Promise<Store> {
    const store = Store.create({
      ...input,
      id: this.idGenerator.generate(),
      createdAt: this.clock.today(),
    });

    await this.repository.save(store);
    return store;
  }
}
