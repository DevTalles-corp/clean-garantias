// Barra flotante de pestañas con el botón para registrar una compra.

import { usePathname } from 'expo-router';
import { TabTrigger } from 'expo-router/ui';
import { Platform, Pressable, View, type ViewStyle } from 'react-native';

import { Icon } from '@/shared/presentation/components/icon';
import type { IconName } from '@/shared/presentation/constants/icons';
import { useScreenInsets } from '@/shared/presentation/hooks/use-screen-insets';
import { useTheme } from '@/shared/presentation/hooks/use-theme';
import { makeStyles } from '@/shared/presentation/utils/make-styles';

export const appTabs = [
  { name: 'summary', href: '/', label: 'Resumen', icon: 'summary' },
  { name: 'products', href: '/products', label: 'Compras', icon: 'purchases' },
  { name: 'settings', href: '/settings', label: 'Ajustes', icon: 'settings' },
] as const satisfies readonly { name: string; href: string; label: string; icon: IconName }[];

export function AppTabBar({ onAdd }: { onAdd: () => void }) {
  const colors = useTheme();
  const styles = useStyles();
  const pathname = usePathname();
  const { bottom } = useScreenInsets();

  return (
    <View pointerEvents="box-none" style={[styles.container, { bottom }]}>
      <View style={[styles.bar, webBlur]}>
        {appTabs.map((tab) => {
          const selected = pathname === tab.href;
          return (
            <TabTrigger
              key={tab.name}
              name={tab.name}
              accessibilityRole="tab"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected }}
              style={[styles.tab, selected && styles.selected]}>
              <Icon name={tab.icon} size={24} color={selected ? colors.paper : colors.body} />
            </TabTrigger>
          );
        })}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Nueva compra"
        onPress={onAdd}
        style={styles.add}>
        <Icon name="add" size={24} color={colors.paper} />
      </Pressable>
    </View>
  );
}

const webBlur = Platform.OS === 'web' ? ({ backdropFilter: 'blur(16px)' } as ViewStyle) : undefined;

const useStyles = makeStyles((c) => ({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    zIndex: 5,
  },
  bar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: c.tabBar,
    borderWidth: 1,
    borderColor: c.line08,
    borderRadius: 999,
    padding: 5,
    boxShadow: `0 8px 24px ${c.shadow12}`,
  },
  tab: {
    flex: 1,
    height: 50,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: { backgroundColor: c.ink },
  add: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: c.ink,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0 8px 24px ${c.shadow30}`,
  },
}));
