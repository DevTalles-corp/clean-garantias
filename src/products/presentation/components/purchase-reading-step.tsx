import { useEffect } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { MockReceiptPaper } from '@/products/presentation/components/mock-receipt-paper';
import { usePurchaseDraftStore } from '@/products/presentation/stores/purchase-draft.store';
import { usePreferencesStore } from '@/settings/presentation/stores/preferences.store';
import { AppText } from '@/shared/presentation/components/app-text';
import { fonts } from '@/shared/presentation/constants/theme';
import { useTheme } from '@/shared/presentation/hooks/use-theme';
import { makeStyles } from '@/shared/presentation/utils/make-styles';

const readingMs = 1700;

// Lectura simulada, como en el prototipo.
export function PurchaseReadingStep() {
  const colors = useTheme();
  const styles = useStyles();
  const receipt = usePurchaseDraftStore((state) => state.receipt);
  const fillFromReceipt = usePurchaseDraftStore((state) => state.fillFromReceipt);
  const defaultMonths = usePreferencesStore((state) => state.defaultMonths);

  useEffect(() => {
    const timer = setTimeout(() => fillFromReceipt(defaultMonths), readingMs);
    return () => clearTimeout(timer);
  }, [defaultMonths, fillFromReceipt]);

  return (
    <View style={styles.container}>
      <MockReceiptPaper receipt={receipt} style={styles.paper}>
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: colors.green,
            boxShadow: `0 0 14px 3px ${colors.scanGlow}`,
            animationName: { from: { top: '8%' }, to: { top: '88%' } },
            animationDuration: 1100,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDirection: 'alternate',
          }}
        />
      </MockReceiptPaper>
      <View style={{ alignItems: 'center', gap: 6 }}>
        <AppText style={styles.title}>Leyendo el recibo…</AppText>
        <AppText style={styles.detail}>Extrayendo tienda, fecha y total</AppText>
      </View>
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 26, padding: 40 },
  paper: { width: 180, height: 280, overflow: 'hidden', boxShadow: `0 14px 40px ${c.shadow25}` },
  title: { fontFamily: fonts.displaySemi, fontSize: 20 },
  detail: { fontFamily: fonts.mono, fontSize: 12, color: c.muted },
}));
