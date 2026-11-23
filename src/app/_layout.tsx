import 'expo-sqlite/localStorage/install';
import '@/shared/presentation/global.css';

import { Geist_400Regular, Geist_500Medium } from '@expo-google-fonts/geist';
import { GeistMono_400Regular, GeistMono_500Medium } from '@expo-google-fonts/geist-mono';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useColorScheme, View } from 'react-native';

import { startApp } from '@/app.bootstrap';
import type { AppUseCases } from '@/app.composition';
import { useSettings } from '@/settings/presentation/hooks/use-settings';
import { AppText } from '@/shared/presentation/components/app-text';
import { TextButton } from '@/shared/presentation/components/text-button';
import { Toast } from '@/shared/presentation/components/toast';
import { fonts, maxContentWidth } from '@/shared/presentation/constants/theme';
import { useTheme } from '@/shared/presentation/hooks/use-theme';
import { QueryProvider } from '@/shared/presentation/providers/query-provider';
import { AppThemeProvider } from '@/shared/presentation/providers/theme.context';
import { UseCasesProvider } from '@/shared/presentation/providers/use-cases.context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    [fonts.sans]: Geist_400Regular,
    [fonts.sansMedium]: Geist_500Medium,
    [fonts.mono]: GeistMono_400Regular,
    [fonts.monoMedium]: GeistMono_500Medium,
    [fonts.display]: require('@/assets/fonts/BricolageGrotesque-Bold.ttf'),
    [fonts.displaySemi]: require('@/assets/fonts/BricolageGrotesque-SemiBold.ttf'),
  });
  const [useCases, setUseCases] = useState<AppUseCases>();
  const [hasFailed, setHasFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const isReady = (fontsLoaded || !!fontsError) && (!!useCases || hasFailed);

  useEffect(() => {
    let isActive = true;
    startApp().then(
      (app) => isActive && setUseCases(app),
      (error: unknown) => {
        console.error(error);
        if (isActive) setHasFailed(true);
      },
    );
    return () => {
      isActive = false;
    };
  }, [attempt]);

  useEffect(() => {
    if (isReady) SplashScreen.hideAsync();
  }, [isReady]);

  if (!isReady) return null;
  if (!useCases) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20 }}>
        <AppText>No se pudo abrir la base de datos.</AppText>
        <TextButton
          label="Reintentar"
          onPress={() => {
            setHasFailed(false);
            setAttempt((current) => current + 1);
          }}
        />
      </View>
    );
  }

  return (
    <UseCasesProvider useCases={useCases}>
      <QueryProvider>
        <AppNavigator />
      </QueryProvider>
    </UseCasesProvider>
  );
}

function AppNavigator() {
  const systemScheme = useColorScheme();
  const { data: settings } = useSettings();
  if (!settings) return null;

  const scheme = settings.theme === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : settings.theme;
  return (
    <AppThemeProvider scheme={scheme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <AppFrame />
    </AppThemeProvider>
  );
}

function AppFrame() {
  const colors = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <View style={{ flex: 1, width: '100%', maxWidth: maxContentWidth, alignSelf: 'center' }}>
        <Stack
          screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="products/[id]" />
          <Stack.Screen name="new-purchase" options={{ animation: 'slide_from_bottom' }} />
        </Stack>
        <Toast />
      </View>
    </View>
  );
}
