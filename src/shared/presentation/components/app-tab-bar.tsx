// Barra flotante de pestañas con el botón para registrar una compra.

import { usePathname } from 'expo-router';
import { TabTrigger } from 'expo-router/ui';
import { Platform, Pressable, View, type ViewStyle } from 'react-native';

import { AppText } from '@/shared/presentation/components/app-text';
import { fonts } from '@/shared/presentation/constants/theme';
import { useScreenInsets } from '@/shared/presentation/hooks/use-screen-insets';
import { makeStyles } from '@/shared/presentation/utils/make-styles';

// ︎ evita que el sistema dibuje el símbolo como emoji.
export const appTabs = [
  { name: 'summary', href: '/', label: 'Resumen', glyph: '◐︎' },
  { name: 'products', href: '/products', label: 'Compras', glyph: '≡' },
  { name: 'settings', href: '/settings', label: 'Ajustes', glyph: '⚙︎' },
] as const;

export function AppTabBar({ onAdd }: { onAdd: () => void }) {
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
              accessibilityState={{ selected }}
              style={[styles.tab, selected && styles.selected]}>
              <AppText style={[styles.glyph, selected && styles.selectedText]}>{tab.glyph}</AppText>
              <AppText style={[styles.label, selected && styles.selectedText]}>{tab.label}</AppText>
            </TabTrigger>
          );
        })}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Nueva compra"
        onPress={onAdd}
        style={styles.add}>
        <AppText style={styles.plus}>+</AppText>
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
    gap: 2,
  },
  selected: { backgroundColor: c.ink },
  glyph: { fontFamily: fonts.monoMedium, fontSize: 15, lineHeight: 15, color: c.body },
  label: { fontFamily: fonts.sansMedium, fontSize: 11, color: c.body },
  selectedText: { color: c.paper },
  add: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: c.ink,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0 8px 24px ${c.shadow30}`,
  },
  plus: { fontSize: 30, color: c.paper },
}));
