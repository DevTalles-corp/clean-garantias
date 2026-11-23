import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import { PurchaseCameraStep } from '@/products/presentation/components/purchase-camera-step';
import { PurchaseFormStep } from '@/products/presentation/components/purchase-form-step';
import { PurchaseGalleryStep } from '@/products/presentation/components/purchase-gallery-step';
import { PurchaseReadingStep } from '@/products/presentation/components/purchase-reading-step';
import { PurchaseSourceStep } from '@/products/presentation/components/purchase-source-step';
import { usePurchaseDraftStore } from '@/products/presentation/stores/purchase-draft.store';
import { useTheme } from '@/shared/presentation/hooks/use-theme';

function close() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

export function NewPurchasePage() {
  const colors = useTheme();
  const step = usePurchaseDraftStore((state) => state.step);
  const start = usePurchaseDraftStore((state) => state.start);

  // Al salir se descarta el borrador para empezar de cero la próxima vez.
  useEffect(() => start, [start]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      {step === 'source' && <PurchaseSourceStep onClose={close} />}
      {step === 'camera' && <PurchaseCameraStep />}
      {step === 'gallery' && <PurchaseGalleryStep />}
      {step === 'reading' && <PurchaseReadingStep />}
      {step === 'form' && <PurchaseFormStep onClose={close} />}
    </View>
  );
}
