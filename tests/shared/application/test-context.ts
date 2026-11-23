// Apoyo para pruebas de casos de uso: repositorios en memoria, servicios predecibles y datos válidos.
// Cumplen los contratos del dominio sin usar SQLite ni Expo.

import { Attachment, type AttachmentOwner } from '@/attachments/domain/entities/attachment.entity';
import type { AttachmentRepository } from '@/attachments/domain/repositories/attachment.repository';
import { Category } from '@/categories/domain/entities/category.entity';
import type { CategoryRepository } from '@/categories/domain/repositories/category.repository';
import { Claim } from '@/claims/domain/entities/claim.entity';
import type { ClaimRepository } from '@/claims/domain/repositories/claim.repository';
import { Product } from '@/products/domain/entities/product.entity';
import type { ProductRepository } from '@/products/domain/repositories/product.repository';
import { ScheduleWarrantyRemindersUseCase } from '@/reminders/application/use-cases/schedule-warranty-reminders.use-case';
import { Reminder, type ReminderStatus } from '@/reminders/domain/entities/reminder.entity';
import type { ReminderRepository } from '@/reminders/domain/repositories/reminder.repository';
import { Settings, type CreateSettingsData } from '@/settings/domain/entities/settings.entity';
import type { SettingsRepository } from '@/settings/domain/repositories/settings.repository';
import type { Clock } from '@/shared/domain/services/clock';
import type { IdGenerator } from '@/shared/domain/services/id-generator';
import { Store } from '@/stores/domain/entities/store.entity';
import type { StoreRepository } from '@/stores/domain/repositories/store.repository';
import { Warranty } from '@/warranties/domain/entities/warranty.entity';
import type { WarrantyRepository } from '@/warranties/domain/repositories/warranty.repository';

class InMemoryRepository<T extends { id: string }> {
  protected readonly items = new Map<string, T>();

  async findById(id: string): Promise<T | undefined> {
    return this.items.get(id);
  }

  async findAll(): Promise<T[]> {
    return [...this.items.values()];
  }

  async save(item: T): Promise<void> {
    this.items.set(item.id, item);
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }

  protected async filter(predicate: (item: T) => boolean): Promise<T[]> {
    return [...this.items.values()].filter(predicate);
  }
}

class InMemoryAttachmentRepository extends InMemoryRepository<Attachment> implements AttachmentRepository {
  findByOwner(ownerType: AttachmentOwner, ownerId: string): Promise<Attachment[]> {
    return this.filter((item) => item.ownerType === ownerType && item.ownerId === ownerId);
  }
}

class InMemoryCategoryRepository extends InMemoryRepository<Category> implements CategoryRepository {}

class InMemoryClaimRepository extends InMemoryRepository<Claim> implements ClaimRepository {
  findByWarrantyId(warrantyId: string): Promise<Claim[]> {
    return this.filter((item) => item.warrantyId === warrantyId);
  }
}

class InMemoryProductRepository extends InMemoryRepository<Product> implements ProductRepository {
  findByCategoryId(categoryId: string): Promise<Product[]> {
    return this.filter((item) => item.categoryId === categoryId);
  }

  findByStoreId(storeId: string): Promise<Product[]> {
    return this.filter((item) => item.storeId === storeId);
  }
}

class InMemoryReminderRepository extends InMemoryRepository<Reminder> implements ReminderRepository {
  findByWarrantyId(warrantyId: string): Promise<Reminder[]> {
    return this.filter((item) => item.warrantyId === warrantyId);
  }

  findByStatus(status: ReminderStatus): Promise<Reminder[]> {
    return this.filter((item) => item.status === status);
  }
}

class InMemorySettingsRepository implements SettingsRepository {
  private settings?: Settings;

  async find(): Promise<Settings | undefined> {
    return this.settings;
  }

  async save(settings: Settings): Promise<void> {
    this.settings = settings;
  }
}

class InMemoryStoreRepository extends InMemoryRepository<Store> implements StoreRepository {}

class InMemoryWarrantyRepository extends InMemoryRepository<Warranty> implements WarrantyRepository {
  findByProductId(productId: string): Promise<Warranty[]> {
    return this.filter((item) => item.productId === productId);
  }
}

class SequentialIdGenerator implements IdGenerator {
  private count = 0;

  generate(): string {
    this.count += 1;
    return testId(900 + this.count);
  }
}

class FixedClock implements Clock {
  today(): string {
    return today;
  }
}

export const today = '2026-06-15';

export function testId(value: number): string {
  return `${String(value).padStart(8, '0')}-0000-4000-8000-00000000000a`;
}

export const firstGeneratedId = testId(901);
export const missingId = testId(999);

export const ids = {
  category: testId(1),
  store: testId(2),
  product: testId(3),
  warranty: testId(4),
  reminder: testId(5),
  claim: testId(6),
  attachment: testId(7),
};

export const settingsData: CreateSettingsData = {
  currency: 'MXN',
  locale: 'es-MX',
  reminderOffsetsDays: [30, 7],
  notificationsEnabled: true,
  theme: 'system',
  expiringThresholdDays: 30,
};

// Entidades válidas y relacionadas entre sí; la garantía vence el 2027-01-10.
export const entities = {
  category: Category.create({
    id: ids.category,
    name: 'Cómputo',
    icon: 'laptopcomputer',
    color: '#208AEF',
    defaultWarrantyMonths: 12,
    createdAt: '2026-01-01',
  }),
  store: Store.create({
    id: ids.store,
    name: 'Tienda',
    phone: '555',
    createdAt: '2026-01-01',
  }),
  product: Product.create({
    id: ids.product,
    name: 'Laptop',
    brand: 'Acme',
    categoryId: ids.category,
    storeId: ids.store,
    purchaseDate: '2026-01-10',
    createdAt: '2026-01-15',
  }),
  warranty: Warranty.create({
    id: ids.warranty,
    productId: ids.product,
    purchaseDate: '2026-01-10',
    type: 'manufacturer',
    provider: 'Acme',
    startDate: '2026-01-10',
    durationMonths: 12,
    createdAt: '2026-01-15',
  }),
  reminder: Reminder.create({
    id: ids.reminder,
    warrantyId: ids.warranty,
    offsetDays: 30,
    warrantyEndDate: '2027-01-10',
    createdAt: '2026-01-15',
  }),
  claim: Claim.create({
    id: ids.claim,
    warrantyId: ids.warranty,
    warrantyEndDate: '2027-01-10',
    issue: 'No enciende',
    openedAt: '2026-02-01',
  }),
  attachment: Attachment.create({
    id: ids.attachment,
    ownerType: 'product',
    ownerId: ids.product,
    kind: 'invoice',
    fileUri: 'file:///factura.pdf',
    fileName: 'factura.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 100,
    createdAt: '2026-01-15',
  }),
  settings: Settings.create(settingsData),
};

// Contexto vacío: cada prueba guarda solo lo que necesita.
export function createTestContext() {
  const repositories = {
    attachments: new InMemoryAttachmentRepository(),
    categories: new InMemoryCategoryRepository(),
    claims: new InMemoryClaimRepository(),
    products: new InMemoryProductRepository(),
    reminders: new InMemoryReminderRepository(),
    settings: new InMemorySettingsRepository(),
    stores: new InMemoryStoreRepository(),
    warranties: new InMemoryWarrantyRepository(),
  };
  const idGenerator = new SequentialIdGenerator();
  const clock = new FixedClock();

  return {
    ...repositories,
    idGenerator,
    clock,
    scheduleWarrantyReminders: new ScheduleWarrantyRemindersUseCase(
      repositories.reminders,
      repositories.warranties,
      repositories.settings,
      idGenerator,
      clock,
    ),
  };
}

// Contexto con todas las entidades guardadas.
export async function createSeededContext() {
  const context = createTestContext();
  await context.categories.save(entities.category);
  await context.stores.save(entities.store);
  await context.products.save(entities.product);
  await context.warranties.save(entities.warranty);
  await context.reminders.save(entities.reminder);
  await context.claims.save(entities.claim);
  await context.attachments.save(entities.attachment);
  await context.settings.save(entities.settings);
  return context;
}

export type TestContext = ReturnType<typeof createTestContext>;

export const validationError = (message: string) =>
  expect.objectContaining({ name: 'ValidationError', message });
export const conflictError = (message: string) =>
  expect.objectContaining({ name: 'ConflictError', message });
export const notFoundError = (message: string) =>
  expect.objectContaining({ name: 'NotFoundError', message });
