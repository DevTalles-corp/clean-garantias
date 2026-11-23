import { useLocalSearchParams } from 'expo-router';

import { PurchaseDetailPage } from '@/products/presentation/pages/purchase-detail-page';

export default function PurchaseDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PurchaseDetailPage key={id} id={id} />;
}
