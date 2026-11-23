// React Query: los datos son locales, así que no dependen de la red ni caducan solos.

import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { AppState, Platform } from 'react-native';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { networkMode: 'always', retry: false, staleTime: Infinity },
          mutations: { networkMode: 'always' },
        },
      }),
  );

  // Al volver a la app puede haber cambiado el día: se recalculan los datos.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      if (Platform.OS !== 'web') focusManager.setFocused(status === 'active');
      if (status === 'active') client.invalidateQueries();
    });
    return () => subscription.remove();
  }, [client]);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
