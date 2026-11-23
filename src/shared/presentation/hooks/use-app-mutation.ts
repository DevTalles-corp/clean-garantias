// Escritura con un caso de uso: refresca los datos y muestra los errores de dominio.

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toErrorMessage } from '@/shared/presentation/errors/error-messages';
import { showToast } from '@/shared/presentation/stores/toast.store';

export function useAppMutation<TInput, TOutput>(execute: (input: TInput) => Promise<TOutput>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: execute,
    onError: (error) => showToast(toErrorMessage(error), 'info'),
    // Base local: releer todo es barato y evita vistas desactualizadas, incluso tras un fallo parcial.
    onSettled: () => queryClient.invalidateQueries(),
  });
}
