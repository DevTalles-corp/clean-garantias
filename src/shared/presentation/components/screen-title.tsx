import { AppText } from '@/shared/presentation/components/app-text';
import { fonts } from '@/shared/presentation/constants/theme';

export function ScreenTitle({ children }: { children: string }) {
  return (
    <AppText
      accessibilityRole="header"
      style={{ fontFamily: fonts.display, fontSize: 34, lineHeight: 35.7, letterSpacing: -0.68 }}>
      {children}
    </AppText>
  );
}
