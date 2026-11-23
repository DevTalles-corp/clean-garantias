import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

import { getCategoryIcon } from '@/categories/presentation/constants/category-icons';
import { useCategories } from '@/categories/presentation/hooks/use-categories';
import { StepHeader } from '@/products/presentation/components/step-header';
import { useRegisterPurchase } from '@/products/presentation/hooks/use-register-purchase';
import {
  maxFormMonths,
  minFormMonths,
  validatePurchaseForm,
  type PurchaseField,
} from '@/products/presentation/schemas/register-purchase.schema';
import { usePurchaseDraftStore } from '@/products/presentation/stores/purchase-draft.store';
import { useSettings } from '@/settings/presentation/hooks/use-settings';
import { addMonths, isIsoDate } from '@/shared/domain/value-objects/iso-date';
import { AppText } from '@/shared/presentation/components/app-text';
import { Chip } from '@/shared/presentation/components/chip';
import { DateField } from '@/shared/presentation/components/date-field';
import { FieldError } from '@/shared/presentation/components/field-error';
import { Icon } from '@/shared/presentation/components/icon';
import { PrimaryButton } from '@/shared/presentation/components/primary-button';
import { TextField } from '@/shared/presentation/components/text-field';
import { fonts } from '@/shared/presentation/constants/theme';
import { formatDate } from '@/shared/presentation/formatters/format-date';
import { useScreenInsets } from '@/shared/presentation/hooks/use-screen-insets';
import { useTheme } from '@/shared/presentation/hooks/use-theme';
import { useToday } from '@/shared/presentation/hooks/use-today';
import { showToast } from '@/shared/presentation/stores/toast.store';
import { makeStyles } from '@/shared/presentation/utils/make-styles';

const monthOptions = [6, 12, 24, 36];

export function PurchaseFormStep({ onClose }: { onClose: () => void }) {
  const colors = useTheme();
  const styles = useStyles();
  const today = useToday();
  const { top, bottom } = useScreenInsets();
  const { form, detected, errors, setField, setErrors } = usePurchaseDraftStore();
  const { data: categories = [] } = useCategories();
  const { data: settings } = useSettings();
  const register = useRegisterPurchase();

  const isDetected = (field: PurchaseField) => detected.includes(field);
  const preview = isIsoDate(form.date)
    ? `Cubierta hasta el ${formatDate(addMonths(form.date, form.months))}`
    : 'Indica la fecha para calcular el vencimiento';

  function changeMonths(months: number) {
    setField('months', Math.min(maxFormMonths, Math.max(minFormMonths, months)));
  }

  function save() {
    const formErrors = validatePurchaseForm(form, today);
    if (Object.keys(formErrors).length > 0) return setErrors(formErrors);
    if (!settings) return;

    register.mutate(
      {
        name: form.product,
        storeName: form.store,
        categoryId: form.categoryId,
        purchaseDate: form.date,
        price: { amountCents: Number(form.price) * 100, currency: settings.currency },
        months: form.months,
        receiptFileName: form.hasReceipt ? `recibo-${form.date}.jpg` : undefined,
      },
      {
        onSuccess: ({ product, warranty }) => {
          router.replace({ pathname: '/products/[id]', params: { id: product.id } });
          showToast(`Compra guardada · vence el ${formatDate(warranty.endDate)}`);
        },
      },
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: top + 2, paddingBottom: bottom + 10 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <StepHeader title="Registrar compra" cancelColor={colors.body} onCancel={onClose} />
        {detected.length > 0 && (
          <View style={styles.banner}>
            <AppText style={styles.bannerText}>
              Detectamos tienda, fecha y total en el recibo. Revisa y completa el producto.
            </AppText>
          </View>
        )}
        <TextField
          label="Producto"
          icon="product"
          placeholder="Ej. Hervidor eléctrico"
          value={form.product}
          onChangeText={(value) => setField('product', value)}
          error={errors.product}
        />
        <TextField
          label="Tienda"
          icon="store"
          placeholder="Ej. Falabella"
          value={form.store}
          onChangeText={(value) => setField('store', value)}
          error={errors.store}
          detected={isDetected('store')}
        />
        <DateField
          label="Fecha de compra"
          icon="calendar"
          value={form.date}
          max={today}
          onChange={(value) => setField('date', value)}
          error={errors.date}
          detected={isDetected('date')}
        />
        <TextField
          label="Precio"
          icon="money"
          placeholder="0"
          inputMode="numeric"
          value={form.price}
          onChangeText={(value) => setField('price', value.replace(/\D/g, ''))}
          error={errors.price}
          detected={isDetected('price')}
        />
        <View style={styles.group}>
          <AppText style={styles.label}>Categoría</AppText>
          <View style={styles.categories}>
            {categories.map(({ id, name, icon }) => (
              <Chip
                key={id}
                variant="form"
                label={name}
                icon={getCategoryIcon(icon)}
                selected={id === form.categoryId}
                onPress={() => setField('categoryId', id)}
              />
            ))}
          </View>
          <FieldError message={errors.categoryId} />
        </View>
        <View style={styles.group}>
          <AppText style={styles.label}>Meses de garantía</AppText>
          <View style={styles.stepper}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Restar un mes"
              onPress={() => changeMonths(form.months - 1)}
              style={styles.stepButton}>
              <Icon name="remove" size={16} color={colors.ink} />
            </Pressable>
            <AppText style={styles.months}>
              {form.months} <AppText style={styles.monthsUnit}>meses</AppText>
            </AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sumar un mes"
              onPress={() => changeMonths(form.months + 1)}
              style={styles.stepButton}>
              <Icon name="add" size={16} color={colors.ink} />
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {monthOptions.map((months) => (
              <Chip
                key={months}
                variant="months"
                label={`${months}m`}
                selected={months === form.months}
                onPress={() => setField('months', months)}
              />
            ))}
          </View>
          <AppText style={styles.preview}>{preview}</AppText>
          <FieldError message={errors.months} />
        </View>
        <PrimaryButton
          label="Guardar compra"
          icon="save"
          disabled={register.isPending}
          onPress={save}
          style={{ marginTop: 6 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const useStyles = makeStyles((c) => ({
  content: { paddingHorizontal: 20, gap: 16 },
  banner: { backgroundColor: c.greenSoft, borderRadius: 14, paddingVertical: 11, paddingHorizontal: 13 },
  bannerText: { fontSize: 13, color: c.green },
  group: { gap: 8 },
  label: { fontFamily: fonts.sansMedium, fontSize: 13, color: c.body },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.line15,
    backgroundColor: c.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  months: { flex: 1, textAlign: 'center', fontFamily: fonts.monoMedium, fontSize: 22 },
  monthsUnit: { fontFamily: fonts.monoMedium, fontSize: 13, color: c.muted },
  preview: { fontFamily: fonts.mono, fontSize: 12, color: c.muted },
}));
