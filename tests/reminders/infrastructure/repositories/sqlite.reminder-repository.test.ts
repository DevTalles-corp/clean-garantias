import type { SQLiteDatabase } from 'expo-sqlite';

import { Category } from '@/categories/domain/entities/category.entity';
import { SqliteCategoryRepository } from '@/categories/infrastructure/repositories/sqlite.category-repository';
import { Store } from '@/stores/domain/entities/store.entity';
import { SqliteStoreRepository } from '@/stores/infrastructure/repositories/sqlite.store-repository';
import { Product } from '@/products/domain/entities/product.entity';
import { SqliteProductRepository } from '@/products/infrastructure/repositories/sqlite.product-repository';
import { Warranty } from '@/warranties/domain/entities/warranty.entity';
import { SqliteWarrantyRepository } from '@/warranties/infrastructure/repositories/sqlite.warranty-repository';
import { Reminder } from '@/reminders/domain/entities/reminder.entity';
import { SqliteReminderRepository } from '@/reminders/infrastructure/repositories/sqlite.reminder-repository';

import { createTestDatabase } from '../../../shared/infrastructure/database/sqlite.test-database';

const reminder = Reminder.restore({
  id: '00000005-0000-4000-8000-000000000000',
  warrantyId: '00000004-0000-4000-8000-000000000000',
  offsetDays: 7,
  fireAt: '2028-01-03',
  notificationId: 'n-1',
  status: 'sent',
  createdAt: '2026-01-15',
});

describe('SqliteReminderRepository', () => {
  let database: SQLiteDatabase;
  let repository: SqliteReminderRepository;

  beforeEach(async () => {
    database = await createTestDatabase();
    repository = new SqliteReminderRepository(database);
    await new SqliteCategoryRepository(database).save(
      Category.create({
        id: '00000001-0000-4000-8000-000000000000',
        name: 'Cómputo',
        icon: 'laptopcomputer',
        color: '#208AEF',
        defaultWarrantyMonths: 12,
        isSystem: true,
        createdAt: '2026-01-01',
      }),
    );
    await new SqliteStoreRepository(database).save(
      Store.create({
        id: '00000002-0000-4000-8000-000000000000',
        name: 'Tienda',
        website: 'https://tienda.test',
        phone: '555',
        email: 'a@tienda.test',
        address: 'Calle 1',
        createdAt: '2026-01-01',
      }),
    );
    await new SqliteProductRepository(database).save(
      Product.restore({
        id: '00000003-0000-4000-8000-000000000000',
        name: 'Laptop',
        brand: 'Acme',
        model: 'X1',
        serialNumber: 'SN',
        categoryId: '00000001-0000-4000-8000-000000000000',
        storeId: '00000002-0000-4000-8000-000000000000',
        purchaseDate: '2026-01-10',
        purchasePrice: { amountCents: 0, currency: 'USD' },
        imageUri: 'file:///a.png',
        notes: 'Nota',
        createdAt: '2026-01-15',
        updatedAt: '2026-02-01',
      }),
    );
    await new SqliteWarrantyRepository(database).save(
      Warranty.restore({
        id: '00000004-0000-4000-8000-000000000000',
        productId: '00000003-0000-4000-8000-000000000000',
        type: 'extended',
        provider: 'Acme',
        startDate: '2026-01-10',
        durationMonths: 24,
        policyNumber: 'P-1',
        coverage: 'Total',
        contactPhone: '555',
        contactEmail: 'a@acme.test',
        isArchived: true,
        createdAt: '2026-01-15',
        updatedAt: '2026-02-01',
      }),
    );
  });

  test('devuelve undefined si no existe', async () => {
    expect(await repository.findById(reminder.id)).toBeUndefined();
  });

  test('guarda y recupera por id', async () => {
    await repository.save(reminder);
    expect({ ...(await repository.findById(reminder.id)) }).toEqual({ ...reminder });
  });

  test('reemplaza si el id ya existe', async () => {
    await repository.save(reminder);
    await repository.save(Reminder.restore({ ...reminder, offsetDays: 8 }));

    expect((await repository.findById(reminder.id))?.offsetDays).toBe(8);
    expect(await database.getAllAsync('SELECT * FROM reminders')).toHaveLength(1);
  });

  test('borra solo el id indicado', async () => {
    const other = Reminder.restore({ ...reminder, id: '00000032-0000-4000-8000-000000000000' });
    await repository.save(reminder);
    await repository.save(other);
    await repository.delete(reminder.id);

    expect(await repository.findById(reminder.id)).toBeUndefined();
    expect(await repository.findById(other.id)).toBeDefined();
  });

  test('findByWarrantyId devuelve los resultados en orden', async () => {
    const first = Reminder.restore({
      ...reminder,
      id: '00000032-0000-4000-8000-000000000000',
      fireAt: '2027-01-01',
    });
    await repository.save(reminder);
    await repository.save(first);

    const found = await repository.findByWarrantyId('00000004-0000-4000-8000-000000000000');
    expect(found.map(({ id }) => id)).toEqual([first.id, reminder.id]);
    expect(await repository.findByWarrantyId('00000063-0000-4000-8000-000000000000')).toEqual([]);
  });

  test('findByStatus devuelve los resultados en orden', async () => {
    const first = Reminder.restore({
      ...reminder,
      id: '00000032-0000-4000-8000-000000000000',
      fireAt: '2027-01-01',
    });
    await repository.save(reminder);
    await repository.save(first);

    const found = await repository.findByStatus('sent');
    expect(found.map(({ id }) => id)).toEqual([first.id, reminder.id]);
    expect(await repository.findByStatus('scheduled')).toEqual([]);
  });

  test('rechaza una referencia inexistente', async () => {
    const orphan = Reminder.restore({
      ...reminder,
      warrantyId: '00000063-0000-4000-8000-000000000000',
    });
    await expect(repository.save(orphan)).rejects.toThrow(/FOREIGN KEY/);
  });
});
