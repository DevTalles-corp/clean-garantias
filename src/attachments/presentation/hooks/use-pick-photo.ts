import { useMutation } from '@tanstack/react-query';

import { useUseCases } from '@/shared/presentation/providers/use-cases.context';

export function usePickPhoto() {
  const { photos } = useUseCases();
  return useMutation({ mutationFn: (id: string) => photos.pick.execute(id) });
}
