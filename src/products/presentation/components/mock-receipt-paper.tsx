import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import type { MockReceipt } from '@/products/presentation/constants/mock-receipts';
import { AppText } from '@/shared/presentation/components/app-text';
import { fonts } from '@/shared/presentation/constants/theme';
import { formatDate } from '@/shared/presentation/formatters/format-date';
import { formatMoney } from '@/shared/presentation/formatters/format-money';
import { makeStyles } from '@/shared/presentation/utils/make-styles';

interface Props {
  receipt: MockReceipt;
  style?: StyleProp<ViewStyle>;
  separatorHeight?: number;
  children?: ReactNode;
}

export function MockReceiptPaper({ receipt, style, separatorHeight = 1, children }: Props) {
  const styles = useStyles();
  const total = formatMoney(receipt.total);
  return (
    <View style={[styles.paper, style]}>
      <AppText style={[styles.text, styles.store]}>{receipt.store}</AppText>
      <AppText style={[styles.text, styles.date]}>{formatDate(receipt.date)}</AppText>
      <View style={[styles.separator, { height: separatorHeight }]} />
      <View style={styles.row}>
        <AppText style={styles.text}>{receipt.item}</AppText>
        <AppText style={styles.text}>{total}</AppText>
      </View>
      <View style={[styles.line, { width: '80%' }]} />
      <View style={[styles.line, { width: '60%' }]} />
      <View style={styles.total}>
        <AppText style={[styles.text, styles.totalText]}>TOTAL</AppText>
        <AppText style={[styles.text, styles.totalText]}>{total}</AppText>
      </View>
      {children}
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  paper: { backgroundColor: c.receipt, paddingVertical: 16, paddingHorizontal: 14, gap: 7 },
  text: { fontFamily: fonts.monoMedium, fontSize: 9, color: c.receiptText },
  store: { fontSize: 12, textAlign: 'center' },
  date: { color: c.receiptMuted, textAlign: 'center' },
  separator: { borderTopWidth: 1, borderStyle: 'dashed', borderTopColor: c.receiptDash, marginVertical: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  line: { height: 3, backgroundColor: c.receiptBar },
  total: {
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderTopColor: c.receiptDash,
    paddingTop: 6,
  },
  totalText: { fontSize: 11 },
}));
