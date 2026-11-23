// Pantalla con desplazamiento; vuelve al inicio cada vez que se muestra.

import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, type ReactNode } from 'react';
import { ScrollView, type ScrollViewInstance } from 'react-native';

import { useScreenInsets } from '@/shared/presentation/hooks/use-screen-insets';
import { useTheme } from '@/shared/presentation/hooks/use-theme';

interface Props {
  children: ReactNode;
  gap: number;
  topPadding?: number;
}

export function Screen({ children, gap, topPadding = 8 }: Props) {
  const colors = useTheme();
  const { top, bottom } = useScreenInsets();
  const scrollRef = useRef<ScrollViewInstance>(null);

  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, []),
  );

  return (
    <ScrollView
      ref={scrollRef}
      style={{ flex: 1, backgroundColor: colors.paper }}
      contentContainerStyle={{
        paddingTop: top + topPadding,
        paddingBottom: bottom + 90,
        paddingHorizontal: 20,
        gap,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}
