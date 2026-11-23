import { useQuery } from '@tanstack/react-query';

import { useUseCases } from '@/shared/presentation/providers/use-cases.context';

// null: el producto no tiene recibo.
export function useProductReceipt(productId: string) {
  const { attachments } = useUseCases();
  return useQuery({
    queryKey: ['attachments', 'product', productId],
    queryFn: () => attachments.findByOwner.execute('product', productId),
    select: (items) => items.find(({ kind }) => kind === 'receipt') ?? null,
  });
}
