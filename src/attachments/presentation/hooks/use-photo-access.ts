// Permiso de fotos. Al volver la app a primer plano, QueryProvider invalida todo y se consulta de nuevo.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { recentPhotosKey } from '@/attachments/presentation/hooks/use-recent-photos';
import { toErrorMessage } from '@/shared/presentation/errors/error-messages';
import { useUseCases } from '@/shared/presentation/providers/use-cases.context';
import { showToast } from '@/shared/presentation/stores/toast.store';

const photoAccessKey = ['photo-access'];

export function usePhotoAccess() {
  const { photos } = useUseCases();
  const queryClient = useQueryClient();
  const { data: access, isError, refetch } = useQuery({
    queryKey: photoAccessKey,
    queryFn: () => photos.getAccess.execute(),
    gcTime: 0, // al volver a entrar se consulta de nuevo
  });
  const { mutate: request, isIdle, isPending } = useMutation({
    mutationFn: () => photos.requestAccess.execute(),
    onSuccess: (result) => queryClient.setQueryData(photoAccessKey, result),
    onError: (error) => showToast(toErrorMessage(error), 'info'),
  });
  const { mutate: chooseMore } = useMutation({
    mutationFn: () => photos.chooseMore.execute(),
    onError: (error) => showToast(toErrorMessage(error), 'info'),
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: photoAccessKey }),
        queryClient.invalidateQueries({ queryKey: recentPhotosKey }),
      ]),
  });

  // Al entrar se pide el permiso una sola vez; después decide el usuario.
  const shouldAsk = access === 'denied' && isIdle;
  useEffect(() => {
    if (shouldAsk) request();
  }, [shouldAsk, request]);

  return {
    access: shouldAsk || isPending ? undefined : access,
    isError,
    retry: () => void refetch(),
    request: () => request(),
    chooseMore: () => chooseMore(),
  };
}
