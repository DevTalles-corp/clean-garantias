import { View } from 'react-native';

import type { IsoDate } from '@/shared/domain/value-objects/iso-date';
import { AppText } from '@/shared/presentation/components/app-text';
import { BottomSheet } from '@/shared/presentation/components/bottom-sheet';
import { PrimaryButton } from '@/shared/presentation/components/primary-button';
import { fonts } from '@/shared/presentation/constants/theme';
import { formatDate } from '@/shared/presentation/formatters/format-date';
import { useToday } from '@/shared/presentation/hooks/use-today';
import { showToast } from '@/shared/presentation/stores/toast.store';
import { makeStyles } from '@/shared/presentation/utils/make-styles';
import type { Warranty, WarrantyStatus } from '@/warranties/domain/entities/warranty.entity';
import { statusLabels } from '@/warranties/presentation/constants/status-labels';

interface Props {
  visible: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  storeName: string;
  purchaseDate: IsoDate;
  price: string;
  endDate: IsoDate;
  status: WarrantyStatus;
  warranties: readonly Warranty[];
  receiptName?: string;
}

export function ClaimDocumentSheet(props: Props) {
  const styles = useStyles();
  const today = useToday();
  const rows = [
    ['Producto', props.productName],
    ['Tienda', props.storeName],
    ['Fecha compra', formatDate(props.purchaseDate)],
    ['Precio', props.price],
    ['Garantía hasta', `${formatDate(props.endDate)} (${statusLabels[props.status]})`],
    ['Cobertura', props.warranties.map(({ durationMonths }) => `${durationMonths}m`).join(' + ')],
  ];

  // Simulado, como en el prototipo: aún no se genera el archivo PDF.
  function share() {
    props.onClose();
    showToast(`garantia-${props.productId.slice(0, 8)}.pdf listo para compartir`);
  }

  return (
    <BottomSheet visible={props.visible} onClose={props.onClose}>
      <AppText style={styles.title}>Documento de reclamo</AppText>
      <View style={styles.paper}>
        <View style={styles.header}>
          <AppText style={styles.headerTitle}>Solicitud de garantía</AppText>
          <AppText style={styles.date}>{formatDate(today)}</AppText>
        </View>
        <View style={{ gap: 5 }}>
          {rows.map(([label, value]) => (
            <View key={label} style={styles.row}>
              <AppText style={styles.label}>{label}</AppText>
              <AppText style={styles.value}>{value}</AppText>
            </View>
          ))}
        </View>
        <View style={styles.attachment}>
          <View style={styles.thumbnail}>
            <View style={styles.thumbnailTitle} />
            <View style={[styles.thumbnailLine, { width: '70%' }]} />
            <View style={styles.thumbnailLine} />
          </View>
          <AppText style={styles.attachmentName}>Anexo: {props.receiptName ?? 'sin recibo'}</AppText>
        </View>
      </View>
      <PrimaryButton label="Compartir PDF" icon="share" height={52} onPress={share} />
    </BottomSheet>
  );
}

const useStyles = makeStyles((c) => ({
  title: { fontFamily: fonts.display, fontSize: 24 },
  paper: {
    backgroundColor: c.white,
    borderRadius: 6,
    boxShadow: `0 4px 18px ${c.shadow12}`,
    paddingVertical: 20,
    paddingHorizontal: 18,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottomWidth: 2,
    borderBottomColor: c.ink,
    paddingBottom: 8,
  },
  headerTitle: { fontFamily: fonts.display, fontSize: 15 },
  date: { fontFamily: fonts.mono, fontSize: 9 },
  row: { flexDirection: 'row', gap: 12 },
  label: { width: 90, fontFamily: fonts.mono, fontSize: 10.5, color: c.muted },
  value: { flex: 1, fontFamily: fonts.mono, fontSize: 10.5 },
  attachment: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: c.grayLight,
    paddingTop: 10,
  },
  thumbnail: {
    width: 54,
    height: 72,
    paddingVertical: 6,
    paddingHorizontal: 5,
    gap: 3,
    backgroundColor: c.receipt,
    borderWidth: 1,
    borderColor: c.receiptBorder,
  },
  thumbnailTitle: { height: 3, backgroundColor: c.grayDark },
  thumbnailLine: { height: 2, backgroundColor: c.gray },
  attachmentName: { flex: 1, fontFamily: fonts.mono, fontSize: 9, color: c.muted },
}));
