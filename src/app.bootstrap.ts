// Arranque: abre la aplicación una sola vez y prepara los datos iniciales.
// Es repetible; la configuración y las categorías existentes se conservan.

import { createApp, type AppUseCases } from '@/app.composition';
import { defaultCategories } from '@/categories/presentation/constants/default-categories';
import { restoreSamplePurchases } from '@/products/presentation/services/restore-sample-purchases';

let app: Promise<AppUseCases> | undefined;

export function startApp(): Promise<AppUseCases> {
  app ??= bootstrap().catch((error: unknown) => {
    app = undefined; // permite reintentar
    throw error;
  });
  return app;
}

async function bootstrap(): Promise<AppUseCases> {
  const useCases = await createApp();
  const isFirstRun = await useCases.settings.find.execute().then(
    () => false,
    () => true,
  );

  await useCases.settings.initialize.execute({
    currency: 'CLP',
    locale: 'es-CL',
    reminderOffsetsDays: [30, 7],
    notificationsEnabled: true,
    theme: 'light',
    expiringThresholdDays: 30,
  });
  await useCases.categories.seed.execute(defaultCategories);

  // Solo en desarrollo: la app publicada empieza sin compras.
  if (__DEV__ && isFirstRun) await restoreSamplePurchases(useCases);

  return useCases;
}
