import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { addMonths, type IsoDate } from '@/shared/domain/value-objects/iso-date';
import { AppText } from '@/shared/presentation/components/app-text';
import { BottomSheet } from '@/shared/presentation/components/bottom-sheet';
import { Chip } from '@/shared/presentation/components/chip';
import { PrimaryButton } from '@/shared/presentation/components/primary-button';
import { SegmentedControl } from '@/shared/presentation/components/segmented-control';
import { useFieldStyles } from '@/shared/presentation/components/text-field';
import { fonts } from '@/shared/presentation/constants/theme';
import { formatDate } from '@/shared/presentation/formatters/format-date';
import { useTheme } from '@/shared/presentation/hooks/use-theme';
import { showToast } from '@/shared/presentation/stores/toast.store';
import { useExtendWarranty } from '@/warranties/presentation/hooks/use-extend-warranty';

type ExtensionType = 'store' | 'extended';

const typeOptions = [
  { value: 'store', label: 'Meses extra' },
  { value: 'extended', label: 'Segunda póliza' },
] as const;
const monthOptions = [3, 6, 12, 24];

interface Props {
  visible: boolean;
  productId: string;
  storeName: string;
  endDate: IsoDate;
  hasPolicy: boolean;
  onClose: () => void;
}

export function ExtendWarrantySheet({ visible, onClose, ...props }: Props) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      {/* Se monta al abrir para empezar siempre con el formulario limpio. */}
      {visible && <ExtendWarrantyForm {...props} onClose={onClose} />}
    </BottomSheet>
  );
}

function ExtendWarrantyForm({ productId, storeName, endDate, hasPolicy, onClose }: Omit<Props, 'visible'>) {
  const colors = useTheme();
  const fieldStyles = useFieldStyles();
  const extend = useExtendWarranty(productId);
  const [type, setType] = useState<ExtensionType>('store');
  const [months, setMonths] = useState(12);
  const [provider, setProvider] = useState('');
  const [error, setError] = useState('');
  const isPolicy = type === 'extended';
  const labelStyle = { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.body };

  function submit() {
    if (isPolicy && !provider.trim()) return setError('Indica la aseguradora o tienda');
    if (isPolicy && hasPolicy) return setError('Solo se permite una segunda póliza por compra');

    extend.mutate(
      { type, provider: isPolicy ? provider : storeName, startDate: endDate, durationMonths: months },
      {
        onSuccess: () => {
          onClose();
          showToast(`Garantía extendida ${months} meses`);
        },
      },
    );
  }

  return (
    <>
      <AppText style={{ fontFamily: fonts.display, fontSize: 24 }}>Extender garantía</AppText>
      <SegmentedControl
        variant="sheet"
        options={typeOptions}
        value={type}
        onChange={(value) => {
          setType(value);
          setError('');
        }}
      />
      {isPolicy && (
        <View style={{ gap: 6 }}>
          <AppText style={labelStyle}>Aseguradora o tienda</AppText>
          <TextInput
            accessibilityLabel="Aseguradora o tienda"
            value={provider}
            onChangeText={(value) => {
              setProvider(value);
              setError('');
            }}
            placeholder="Ej. Garantía Extendida Falabella"
            placeholderTextColor={colors.receiptMuted}
            style={[fieldStyles.input, { height: 50 }]}
          />
        </View>
      )}
      <View style={{ gap: 8 }}>
        <AppText style={labelStyle}>Meses adicionales</AppText>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {monthOptions.map((value) => (
            <Chip
              key={value}
              variant="extension"
              label={`+${value}`}
              selected={value === months}
              onPress={() => setMonths(value)}
            />
          ))}
        </View>
      </View>
      <AppText style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.body }}>
        Nuevo vencimiento: {formatDate(addMonths(endDate, months))}
      </AppText>
      {!!error && <AppText style={{ fontSize: 13, color: colors.red }}>{error}</AppText>}
      <PrimaryButton
        label="Agregar extensión"
        icon="add"
        height={52}
        disabled={extend.isPending}
        onPress={submit}
      />
    </>
  );
}
