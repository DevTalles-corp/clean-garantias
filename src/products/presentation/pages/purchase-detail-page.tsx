import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { ReceiptCard } from '@/attachments/presentation/components/receipt-card';
import { useProductReceipt } from '@/attachments/presentation/hooks/use-product-receipt';
import { ClaimDocumentSheet } from '@/claims/presentation/components/claim-document-sheet';
import { useDeleteProduct } from '@/products/presentation/hooks/use-delete-product';
import { usePurchases } from '@/products/presentation/hooks/use-purchases';
import type { Purchase } from '@/products/presentation/models/purchase';
import { WarrantyRemindersCard } from '@/reminders/presentation/components/warranty-reminders-card';
import { AppText } from '@/shared/presentation/components/app-text';
import { EmptyState } from '@/shared/presentation/components/empty-state';
import { Icon } from '@/shared/presentation/components/icon';
import { PrimaryButton } from '@/shared/presentation/components/primary-button';
import { Screen } from '@/shared/presentation/components/screen';
import { SectionLabel } from '@/shared/presentation/components/section-label';
import { TextButton } from '@/shared/presentation/components/text-button';
import { fonts } from '@/shared/presentation/constants/theme';
import { formatDate } from '@/shared/presentation/formatters/format-date';
import { formatMoney } from '@/shared/presentation/formatters/format-money';
import { useTheme } from '@/shared/presentation/hooks/use-theme';
import { useToday } from '@/shared/presentation/hooks/use-today';
import { showToast } from '@/shared/presentation/stores/toast.store';
import { confirmAction } from '@/shared/presentation/utils/confirm-action';
import { makeStyles } from '@/shared/presentation/utils/make-styles';
import { ExtendWarrantySheet } from '@/warranties/presentation/components/extend-warranty-sheet';
import { WarrantyCoverageCard } from '@/warranties/presentation/components/warranty-coverage-card';

function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

export function PurchaseDetailPage({ id }: { id: string }) {
  const colors = useTheme();
  const styles = useStyles();
  const { purchases, error } = usePurchases();
  const deleteProduct = useDeleteProduct();
  const purchase = purchases?.find((item) => item.id === id);

  function confirmDelete() {
    confirmAction('Eliminar compra', 'Se borrarán sus garantías, avisos y recibo.', () =>
      deleteProduct.mutate(id, {
        onSuccess: () => {
          goBack();
          showToast('Compra eliminada');
        },
      }),
    );
  }

  return (
    <Screen gap={16} topPadding={0}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={goBack} style={styles.back}>
          <Icon name="back" size={16} color={colors.ink} />
          <AppText style={{ fontSize: 14 }}>Volver</AppText>
        </Pressable>
        {purchase && (
          <TextButton
            label="Eliminar"
            icon="delete"
            onPress={confirmDelete}
            style={{ paddingVertical: 8 }}
            textStyle={{ fontSize: 14, color: colors.red }}
          />
        )}
      </View>
      {error && <EmptyState message={error} />}
      {purchases && !purchase && <EmptyState message="Compra no encontrada." />}
      {purchase && <PurchaseDetail purchase={purchase} />}
    </Screen>
  );
}

function PurchaseDetail({ purchase }: { purchase: Purchase }) {
  const styles = useStyles();
  const today = useToday();
  const { data: receipt, isPending: isReceiptPending } = useProductReceipt(purchase.id);
  const [openSheet, setOpenSheet] = useState<'extend' | 'claim' | null>(null);
  const { product, storeName, warranties, endDate, status } = purchase;
  const price = formatMoney(product.purchasePrice);
  const closeSheet = () => setOpenSheet(null);

  return (
    <>
      <View style={{ gap: 6 }}>
        <SectionLabel size={12}>{`${purchase.categoryName} · ${storeName}`}</SectionLabel>
        <AppText accessibilityRole="header" style={styles.name}>
          {product.name}
        </AppText>
        <AppText style={styles.price}>
          {price} · {formatDate(product.purchaseDate)}
        </AppText>
      </View>
      <WarrantyCoverageCard
        warranties={warranties}
        purchaseDate={product.purchaseDate}
        endDate={endDate}
        daysLeft={purchase.daysLeft}
        status={status}
        today={today}
        onExtend={() => setOpenSheet('extend')}
      />
      {!isReceiptPending && (
        <ReceiptCard productId={product.id} receipt={receipt} storeName={storeName} price={price} />
      )}
      {purchase.finalWarranty && <WarrantyRemindersCard warranty={purchase.finalWarranty} />}
      <PrimaryButton label="Exportar PDF para reclamo" icon="pdf" onPress={() => setOpenSheet('claim')} />

      <ExtendWarrantySheet
        visible={openSheet === 'extend'}
        onClose={closeSheet}
        productId={product.id}
        storeName={storeName}
        endDate={endDate}
        hasPolicy={warranties.some(({ type }) => type === 'extended')}
      />
      <ClaimDocumentSheet
        visible={openSheet === 'claim'}
        onClose={closeSheet}
        productId={product.id}
        productName={product.name}
        storeName={storeName}
        purchaseDate={product.purchaseDate}
        price={price}
        endDate={endDate}
        status={status}
        warranties={warranties}
        receiptName={receipt?.fileName}
      />
    </>
  );
}

const useStyles = makeStyles((c) => ({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 40,
    paddingLeft: 10,
    paddingRight: 14,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.line10,
    borderRadius: 999,
  },
  name: { fontFamily: fonts.display, fontSize: 30, lineHeight: 32.4, letterSpacing: -0.6 },
  price: { fontFamily: fonts.monoMedium, fontSize: 18, color: c.body },
}));
