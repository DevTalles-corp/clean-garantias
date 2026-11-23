// Caso de uso de aplicación: actualiza una garantía y reprograma sus recordatorios.
// Mantiene los avisos al día; sin él, seguirían apuntando al vencimiento anterior.

import { Product } from '@/products/domain/entities/product.entity';
import type { ProductRepository } from '@/products/domain/repositories/product.repository';
import type { ScheduleWarrantyRemindersUseCase } from '@/reminders/application/use-cases/schedule-warranty-reminders.use-case';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';
import type { Clock } from '@/shared/domain/services/clock';
import { Warranty, type CreateWarrantyData } from '@/warranties/domain/entities/warranty.entity';
import type { WarrantyRepository } from '@/warranties/domain/repositories/warranty.repository';

export class UpdateWarrantyUseCase {
  private readonly warrantyRepository: WarrantyRepository;
  private readonly productRepository: ProductRepository;
  private readonly scheduleWarrantyReminders: ScheduleWarrantyRemindersUseCase;
  private readonly clock: Clock;

  constructor(
    warrantyRepository: WarrantyRepository,
    productRepository: ProductRepository,
    scheduleWarrantyReminders: ScheduleWarrantyRemindersUseCase,
    clock: Clock,
  ) {
    this.warrantyRepository = warrantyRepository;
    this.productRepository = productRepository;
    this.scheduleWarrantyReminders = scheduleWarrantyReminders;
    this.clock = clock;
  }

  async execute(id: string, changes: Partial<CreateWarrantyData>): Promise<Warranty> {
    const current = await this.warrantyRepository.findById(Warranty.normalizeId(id));
    if (!current) throw new NotFoundError('Garantía no encontrada.');
    const product = await this.productRepository.findById(Product.normalizeId(current.productId));
    if (!product) throw new NotFoundError('Producto no encontrado.');

    const warranty = current.update(changes, product.purchaseDate, this.clock.today());

    await this.warrantyRepository.save(warranty);
    // Sin cambio de vencimiento se respetan los avisos cancelados por el usuario.
    if (warranty.endDate !== current.endDate) {
      await this.scheduleWarrantyReminders.execute(warranty.id);
    }
    return warranty;
  }
}
