// Caso de uso de aplicación: crea una garantía para un producto y programa sus recordatorios.
// Valida contra la fecha de compra; sin él, la garantía quedaría sin producto o sin avisos.

import { Product } from '@/products/domain/entities/product.entity';
import type { ProductRepository } from '@/products/domain/repositories/product.repository';
import type { ScheduleWarrantyRemindersUseCase } from '@/reminders/application/use-cases/schedule-warranty-reminders.use-case';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';
import type { Clock } from '@/shared/domain/services/clock';
import type { IdGenerator } from '@/shared/domain/services/id-generator';
import { Warranty, type CreateWarrantyData } from '@/warranties/domain/entities/warranty.entity';
import type { WarrantyRepository } from '@/warranties/domain/repositories/warranty.repository';

export class CreateWarrantyUseCase {
  private readonly warrantyRepository: WarrantyRepository;
  private readonly productRepository: ProductRepository;
  private readonly scheduleWarrantyReminders: ScheduleWarrantyRemindersUseCase;
  private readonly idGenerator: IdGenerator;
  private readonly clock: Clock;

  constructor(
    warrantyRepository: WarrantyRepository,
    productRepository: ProductRepository,
    scheduleWarrantyReminders: ScheduleWarrantyRemindersUseCase,
    idGenerator: IdGenerator,
    clock: Clock,
  ) {
    this.warrantyRepository = warrantyRepository;
    this.productRepository = productRepository;
    this.scheduleWarrantyReminders = scheduleWarrantyReminders;
    this.idGenerator = idGenerator;
    this.clock = clock;
  }

  async execute(productId: string, input: CreateWarrantyData): Promise<Warranty> {
    const product = await this.productRepository.findById(Product.normalizeId(productId));
    if (!product) throw new NotFoundError('Producto no encontrado.');

    const warranty = Warranty.create({
      ...input,
      id: this.idGenerator.generate(),
      productId: product.id,
      purchaseDate: product.purchaseDate,
      createdAt: this.clock.today(),
    });

    await this.warrantyRepository.save(warranty);
    await this.scheduleWarrantyReminders.execute(warranty.id);
    return warranty;
  }
}
