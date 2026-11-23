import { Pressable, View } from 'react-native';

import { usePurchaseDraftStore } from '@/products/presentation/stores/purchase-draft.store';
import { usePreferencesStore } from '@/settings/presentation/stores/preferences.store';
import { AppText } from '@/shared/presentation/components/app-text';
import { TextButton } from '@/shared/presentation/components/text-button';
import { fonts } from '@/shared/presentation/constants/theme';
import { useScreenInsets } from '@/shared/presentation/hooks/use-screen-insets';
import { useToday } from '@/shared/presentation/hooks/use-today';
import { makeStyles } from '@/shared/presentation/utils/make-styles';

export function PurchaseSourceStep({ onClose }: { onClose: () => void }) {
  const styles = useStyles();
  const today = useToday();
  const { top } = useScreenInsets();
  const { goTo, fillManually } = usePurchaseDraftStore();
  const defaultMonths = usePreferencesStore((state) => state.defaultMonths);

  return (
    <View style={[styles.container, { paddingTop: top + 6 }]}>
      <View style={styles.header}>
        <AppText accessibilityRole="header" style={styles.title}>
          Nueva compra
        </AppText>
        <Pressable accessibilityRole="button" accessibilityLabel="Cerrar" onPress={onClose} style={styles.close}>
          <AppText>✕</AppText>
        </Pressable>
      </View>
      <AppText style={styles.intro}>
        Toma una foto del recibo y la leemos por ti: tienda, fecha y total.
      </AppText>
      <Pressable accessibilityRole="button" onPress={() => goTo('camera')} style={[styles.option, styles.camera]}>
        <AppText style={[styles.optionTitle, styles.cameraTitle]}>Cámara</AppText>
        <AppText style={[styles.optionDetail, styles.cameraDetail]}>Fotografía el recibo ahora</AppText>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => goTo('gallery')} style={[styles.option, styles.gallery]}>
        <AppText style={styles.optionTitle}>Galería</AppText>
        <AppText style={styles.optionDetail}>Elige una foto guardada</AppText>
      </Pressable>
      <TextButton
        label="Ingresar a mano, sin recibo"
        onPress={() => fillManually(today, defaultMonths)}
        style={styles.manual}
        textStyle={styles.manualText}
      />
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  container: { flex: 1, paddingHorizontal: 20, gap: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontFamily: fonts.display, fontSize: 28, letterSpacing: -0.56 },
  close: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: c.track,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intro: { fontSize: 15, color: c.body },
  option: { borderRadius: 20, paddingVertical: 22, paddingHorizontal: 18, gap: 4 },
  camera: { backgroundColor: c.ink },
  gallery: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.line12 },
  optionTitle: { fontFamily: fonts.displaySemi, fontSize: 19 },
  optionDetail: { fontSize: 13, color: c.muted },
  cameraTitle: { color: c.paper },
  cameraDetail: { color: c.inkBody },
  manual: { padding: 12, alignItems: 'center' },
  manualText: { fontFamily: fonts.sansMedium, fontSize: 15, color: c.green },
}));
