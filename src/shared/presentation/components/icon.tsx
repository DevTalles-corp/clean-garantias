import { SymbolView } from 'expo-symbols';
import { View } from 'react-native';

import { icons, type IconName } from '@/shared/presentation/constants/icons';

interface Props {
  name: IconName;
  color: string;
  size?: number;
}

// Decorativo: el nombre accesible lo da el control que lo contiene.
export function Icon({ name, color, size = 20 }: Props) {
  return (
    <View aria-hidden style={{ width: size, height: size, flexShrink: 0 }}>
      <SymbolView name={icons[name]} size={size} tintColor={color} />
    </View>
  );
}
