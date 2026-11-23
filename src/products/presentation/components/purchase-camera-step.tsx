import { Pressable, View } from 'react-native';

import { MockReceiptPaper } from '@/products/presentation/components/mock-receipt-paper';
import { usePurchaseDraftStore } from '@/products/presentation/stores/purchase-draft.store';
import { AppText } from '@/shared/presentation/components/app-text';
import { fonts } from '@/shared/presentation/constants/theme';
import { useScreenInsets } from '@/shared/presentation/hooks/use-screen-insets';
import { makeStyles } from '@/shared/presentation/utils/make-styles';

// Cámara simulada, como en el prototipo.
export function PurchaseCameraStep() {
  const styles = useStyles();
  const { top, bottom } = useScreenInsets();
  const { receipt, goTo, read } = usePurchaseDraftStore();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: top + 2 }]}>
        <Pressable accessibilityRole="button" onPress={() => goTo('source')} style={styles.cancel}>
          <AppText style={styles.cancelText}>Cancelar</AppText>
        </Pressable>
        <AppText style={styles.hint}>Encuadra el recibo</AppText>
      </View>
      <View style={styles.viewfinder}>
        <MockReceiptPaper receipt={receipt} separatorHeight={2} style={styles.paper} />
        <View pointerEvents="none" style={styles.frame} />
      </View>
      <View style={[styles.footer, { paddingBottom: bottom + 18 }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tomar foto"
          onPress={() => read(receipt)}
          style={styles.shutter}>
          <View style={styles.shutterInner} />
        </Pressable>
      </View>
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  container: { flex: 1, backgroundColor: c.camera },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  cancel: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: c.white14,
    justifyContent: 'center',
  },
  cancelText: { fontSize: 14, color: c.white },
  hint: { fontFamily: fonts.monoMedium, fontSize: 12, color: c.grayDark },
  viewfinder: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 28,
    borderRadius: 18,
    backgroundColor: c.viewfinder,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  paper: {
    width: 170,
    height: 270,
    transform: [{ rotate: '-4deg' }],
    boxShadow: `0 10px 30px ${c.black50}`,
  },
  frame: {
    position: 'absolute',
    top: 22,
    bottom: 22,
    left: 22,
    right: 22,
    borderWidth: 2,
    borderColor: c.white70,
    borderRadius: 14,
  },
  footer: { paddingTop: 22, alignItems: 'center' },
  shutter: { width: 76, height: 76, borderRadius: 38, borderWidth: 4, borderColor: c.white, padding: 4 },
  shutterInner: { flex: 1, borderRadius: 30, backgroundColor: c.white },
}));
