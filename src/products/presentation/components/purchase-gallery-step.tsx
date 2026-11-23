import { Pressable, ScrollView, View } from 'react-native';

import { StepHeader } from '@/products/presentation/components/step-header';
import { mockReceipts } from '@/products/presentation/constants/mock-receipts';
import { usePurchaseDraftStore } from '@/products/presentation/stores/purchase-draft.store';
import { galleryColors } from '@/shared/presentation/constants/theme';
import { useScreenInsets } from '@/shared/presentation/hooks/use-screen-insets';
import { useTheme } from '@/shared/presentation/hooks/use-theme';
import { useScheme } from '@/shared/presentation/providers/theme.context';
import { makeStyles } from '@/shared/presentation/utils/make-styles';

const rows = [0, 3, 6];
const columns = [0, 1, 2];

// Galería simulada, como en el prototipo.
export function PurchaseGalleryStep() {
  const colors = useTheme();
  const styles = useStyles();
  const photoColors = galleryColors[useScheme()];
  const { top, bottom } = useScreenInsets();
  const { goTo, read } = usePurchaseDraftStore();

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: top + 2,
        paddingBottom: bottom + 10,
        paddingHorizontal: 20,
        gap: 16,
      }}>
      <StepHeader title="Fotos recientes" cancelColor={colors.green} onCancel={() => goTo('source')} />
      <View style={{ gap: 4 }}>
        {rows.map((row) => (
          <View key={row} style={{ flexDirection: 'row', gap: 4 }}>
            {columns.map((column) => {
              const index = row + column;
              return (
                <Pressable
                  key={index}
                  accessibilityRole="button"
                  accessibilityLabel={`Foto ${index + 1}`}
                  onPress={() => read(mockReceipts[index % mockReceipts.length])}
                  style={[styles.photo, { backgroundColor: photoColors[index] }]}>
                  <View style={[styles.paper, { transform: [{ rotate: `${((index * 7) % 11) - 5}deg` }] }]}>
                    <View style={styles.title} />
                    <View style={[styles.line, { width: '70%' }]} />
                    <View style={styles.line} />
                    <View style={[styles.line, { width: '50%' }]} />
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const useStyles = makeStyles((c) => ({
  photo: { flex: 1, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  paper: {
    width: '46%',
    height: '72%',
    gap: 3,
    paddingVertical: 6,
    paddingHorizontal: 5,
    backgroundColor: c.receipt,
    boxShadow: `0 3px 8px ${c.black25}`,
  },
  title: { height: 3, backgroundColor: c.grayDark },
  line: { height: 2, backgroundColor: c.gray },
}));
