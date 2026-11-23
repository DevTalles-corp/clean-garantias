import { Pressable, View } from 'react-native';

import type { Attachment } from '@/attachments/domain/entities/attachment.entity';
import { useAttachReceipt } from '@/attachments/presentation/hooks/use-attach-receipt';
import { AppText } from '@/shared/presentation/components/app-text';
import { Card } from '@/shared/presentation/components/card';
import { SectionLabel } from '@/shared/presentation/components/section-label';
import { fonts } from '@/shared/presentation/constants/theme';
import { showToast } from '@/shared/presentation/stores/toast.store';
import { makeStyles } from '@/shared/presentation/utils/make-styles';

interface Props {
  productId: string;
  receipt?: Attachment | null;
  storeName: string;
  price: string;
}

export function ReceiptCard({ productId, receipt, storeName, price }: Props) {
  const styles = useStyles();
  const attach = useAttachReceipt(productId);

  return (
    <View style={{ gap: 10 }}>
      <SectionLabel>Recibo</SectionLabel>
      {receipt ? (
        <Card style={styles.card}>
          <View style={styles.paper}>
            <AppText numberOfLines={1} style={styles.paperStore}>
              {storeName.toUpperCase()}
            </AppText>
            <View style={styles.line} />
            <View style={[styles.line, { width: '70%' }]} />
            <View style={styles.line} />
            <View style={[styles.line, { width: '55%' }]} />
            <View style={styles.paperTotal}>
              <AppText style={styles.paperText}>TOTAL</AppText>
              <AppText style={styles.paperText}>{price}</AppText>
            </View>
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <AppText style={styles.fileName}>{receipt.fileName}</AppText>
            <AppText style={styles.storage}>Guardado en el dispositivo</AppText>
          </View>
        </Card>
      ) : (
        <Pressable
          accessibilityRole="button"
          disabled={attach.isPending}
          onPress={() => attach.mutate(undefined, { onSuccess: () => showToast('Recibo adjuntado') })}
          style={styles.empty}>
          <AppText style={styles.emptyText}>Sin recibo · Adjuntar foto</AppText>
        </Pressable>
      )}
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12 },
  paper: {
    width: 74,
    height: 96,
    paddingVertical: 8,
    paddingHorizontal: 7,
    gap: 4,
    backgroundColor: c.white,
    boxShadow: `0 2px 8px ${c.black12}`,
    transform: [{ rotate: '-3deg' }],
  },
  paperStore: { fontFamily: fonts.monoMedium, fontSize: 7, color: c.receiptText, textAlign: 'center' },
  paperText: { fontFamily: fonts.monoMedium, fontSize: 6, color: c.receiptText },
  paperTotal: { marginTop: 'auto', flexDirection: 'row', justifyContent: 'space-between' },
  line: { height: 2, backgroundColor: c.gray },
  fileName: { fontFamily: fonts.sansMedium, fontSize: 14 },
  storage: { fontSize: 12.5, color: c.muted },
  empty: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: c.line30,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: { fontSize: 14, color: c.body },
}));
