import { router } from 'expo-router';
import { TabList, Tabs, TabSlot, TabTrigger } from 'expo-router/ui';

import { AppTabBar, appTabs } from '@/shared/presentation/components/app-tab-bar';

export default function TabsLayout() {
  return (
    <Tabs style={{ flex: 1 }}>
      {/* Sin encogerse, en web la pantalla crecería con su contenido y no se desplazaría. */}
      <TabSlot style={{ flexShrink: 1, minHeight: 0 }} />
      <TabList style={{ display: 'none' }}>
        {appTabs.map(({ name, href }) => (
          <TabTrigger key={name} name={name} href={href} />
        ))}
      </TabList>
      <AppTabBar onAdd={() => router.push('/new-purchase')} />
    </Tabs>
  );
}
