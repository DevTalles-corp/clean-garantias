// Punto de composición: único lugar que crea implementaciones e inyecta dependencias.
// Expone los casos de uso agrupados por módulo; la UI los recibe con UseCasesProvider.

import { CreateAttachmentUseCase } from '@/attachments/application/use-cases/create-attachment.use-case';
import { FindAttachmentsByOwnerUseCase } from '@/attachments/application/use-cases/find-attachments-by-owner.use-case';
import { SqliteAttachmentRepository } from '@/attachments/infrastructure/repositories/sqlite.attachment-repository';
import { FindAllCategoriesUseCase } from '@/categories/application/use-cases/find-all-categories.use-case';
import { SeedCategoriesUseCase } from '@/categories/application/use-cases/seed-categories.use-case';
import { SqliteCategoryRepository } from '@/categories/infrastructure/repositories/sqlite.category-repository';
import { SqliteClaimRepository } from '@/claims/infrastructure/repositories/sqlite.claim-repository';
import { CreateProductUseCase } from '@/products/application/use-cases/create-product.use-case';
import { DeleteProductUseCase } from '@/products/application/use-cases/delete-product.use-case';
import { FindAllProductsUseCase } from '@/products/application/use-cases/find-all-products.use-case';
import { SqliteProductRepository } from '@/products/infrastructure/repositories/sqlite.product-repository';
import { CancelReminderUseCase } from '@/reminders/application/use-cases/cancel-reminder.use-case';
import { FindRemindersByStatusUseCase } from '@/reminders/application/use-cases/find-reminders-by-status.use-case';
import { FindRemindersByWarrantyUseCase } from '@/reminders/application/use-cases/find-reminders-by-warranty.use-case';
import { ScheduleWarrantyRemindersUseCase } from '@/reminders/application/use-cases/schedule-warranty-reminders.use-case';
import { SqliteReminderRepository } from '@/reminders/infrastructure/repositories/sqlite.reminder-repository';
import { FindSettingsUseCase } from '@/settings/application/use-cases/find-settings.use-case';
import { InitializeSettingsUseCase } from '@/settings/application/use-cases/initialize-settings.use-case';
import { UpdateSettingsUseCase } from '@/settings/application/use-cases/update-settings.use-case';
import { SqliteSettingsRepository } from '@/settings/infrastructure/repositories/sqlite.settings-repository';
import { SystemClock } from '@/shared/infrastructure/clock/system.clock';
import { openSqliteDatabase } from '@/shared/infrastructure/database/sqlite.database';
import { CryptoIdGenerator } from '@/shared/infrastructure/ids/crypto.id-generator';
import { CreateStoreUseCase } from '@/stores/application/use-cases/create-store.use-case';
import { FindAllStoresUseCase } from '@/stores/application/use-cases/find-all-stores.use-case';
import { SqliteStoreRepository } from '@/stores/infrastructure/repositories/sqlite.store-repository';
import { CreateWarrantyUseCase } from '@/warranties/application/use-cases/create-warranty.use-case';
import { DeleteWarrantyUseCase } from '@/warranties/application/use-cases/delete-warranty.use-case';
import { FindAllWarrantiesUseCase } from '@/warranties/application/use-cases/find-all-warranties.use-case';
import { SqliteWarrantyRepository } from '@/warranties/infrastructure/repositories/sqlite.warranty-repository';

export async function createApp() {
  const database = await openSqliteDatabase();

  //! Repositorios
  const attachmentRepository = new SqliteAttachmentRepository(database);
  const categoryRepository = new SqliteCategoryRepository(database);
  const claimRepository = new SqliteClaimRepository(database);
  const productRepository = new SqliteProductRepository(database);
  const reminderRepository = new SqliteReminderRepository(database);
  const settingsRepository = new SqliteSettingsRepository(database);
  const storeRepository = new SqliteStoreRepository(database);
  const warrantyRepository = new SqliteWarrantyRepository(database);

  //! Servicios
  const clock = new SystemClock();
  const idGenerator = new CryptoIdGenerator();

  //! Casos de uso
  const scheduleWarrantyReminders = new ScheduleWarrantyRemindersUseCase({
    reminderRepository,
    warrantyRepository,
    settingsRepository,
    idGenerator,
    clock,
  });
  const deleteWarranty = new DeleteWarrantyUseCase({
    warrantyRepository,
    reminderRepository,
    claimRepository,
    attachmentRepository,
  });

  return {
    clock,
    attachments: {
      create: new CreateAttachmentUseCase({
        attachmentRepository,
        productRepository,
        warrantyRepository,
        claimRepository,
        idGenerator,
        clock,
      }),
      findByOwner: new FindAttachmentsByOwnerUseCase({ attachmentRepository }),
    },
    categories: {
      findAll: new FindAllCategoriesUseCase({ categoryRepository }),
      seed: new SeedCategoriesUseCase({ categoryRepository, idGenerator, clock }),
    },
    products: {
      create: new CreateProductUseCase({
        productRepository,
        categoryRepository,
        storeRepository,
        idGenerator,
        clock,
      }),
      delete: new DeleteProductUseCase({
        productRepository,
        warrantyRepository,
        attachmentRepository,
        deleteWarranty,
      }),
      findAll: new FindAllProductsUseCase({ productRepository }),
    },
    reminders: {
      cancel: new CancelReminderUseCase({ reminderRepository }),
      findByStatus: new FindRemindersByStatusUseCase({ reminderRepository }),
      findByWarranty: new FindRemindersByWarrantyUseCase({ reminderRepository }),
      schedule: scheduleWarrantyReminders,
    },
    settings: {
      find: new FindSettingsUseCase({ settingsRepository }),
      initialize: new InitializeSettingsUseCase({ settingsRepository }),
      update: new UpdateSettingsUseCase({
        settingsRepository,
        warrantyRepository,
        scheduleWarrantyReminders,
      }),
    },
    stores: {
      create: new CreateStoreUseCase({ storeRepository, idGenerator, clock }),
      findAll: new FindAllStoresUseCase({ storeRepository }),
    },
    warranties: {
      create: new CreateWarrantyUseCase({
        warrantyRepository,
        productRepository,
        scheduleWarrantyReminders,
        idGenerator,
        clock,
      }),
      findAll: new FindAllWarrantiesUseCase({ warrantyRepository }),
    },
  };
}

export type AppUseCases = Awaited<ReturnType<typeof createApp>>;
