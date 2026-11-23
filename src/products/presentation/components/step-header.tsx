import { View } from 'react-native';

import { AppText } from '@/shared/presentation/components/app-text';
import { TextButton } from '@/shared/presentation/components/text-button';
import { fonts } from '@/shared/presentation/constants/theme';

interface Props {
  title: string;
  cancelColor: string;
  onCancel: () => void;
}

export function StepHeader({ title, cancelColor, onCancel }: Props) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <TextButton
        label="Cancelar"
        onPress={onCancel}
        style={{ paddingVertical: 8 }}
        textStyle={{ fontSize: 15, color: cancelColor }}
      />
      <AppText accessibilityRole="header" style={{ fontFamily: fonts.displaySemi, fontSize: 17 }}>
        {title}
      </AppText>
      <View style={{ width: 60 }} />
    </View>
  );
}
