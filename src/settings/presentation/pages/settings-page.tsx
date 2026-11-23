import { View } from 'react-native';

import { useExportBackup } from '@/products/presentation/hooks/use-export-backup';
import { useRestoreSamplePurchases } from '@/products/presentation/hooks/use-restore-sample-purchases';
import { reminderOffsets } from '@/reminders/presentation/constants/reminder-offsets';
import { SettingAction } from '@/settings/presentation/components/setting-action';
import { SettingField } from '@/settings/presentation/components/setting-field';
import { useSettings } from '@/settings/presentation/hooks/use-settings';
import { useUpdateSettings } from '@/settings/presentation/hooks/use-update-settings';
import { usePreferencesStore } from '@/settings/presentation/stores/preferences.store';
import { Card } from '@/shared/presentation/components/card';
import { Screen } from '@/shared/presentation/components/screen';
import { ScreenTitle } from '@/shared/presentation/components/screen-title';
import { SectionLabel } from '@/shared/presentation/components/section-label';
import { SegmentedControl } from '@/shared/presentation/components/segmented-control';
import { SwitchRow } from '@/shared/presentation/components/switch-row';
import { formatMoney } from '@/shared/presentation/formatters/format-money';
import { useScheme } from '@/shared/presentation/providers/theme.context';
import { showToast } from '@/shared/presentation/stores/toast.store';
import { confirmAction } from '@/shared/presentation/utils/confirm-action';

const currencyOptions = (['CLP', 'USD', 'EUR', 'MXN'] as const).map((value) => ({ value, label: value }));
const themeOptions = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
] as const;
const monthOptions = [6, 12, 24, 36].map((value) => ({ value, label: `${value} meses` }));

export function SettingsPage() {
  const scheme = useScheme();
  const { data: settings } = useSettings();
  const update = useUpdateSettings();
  const { defaultMonths, setDefaultMonths } = usePreferencesStore();
  const { exportBackup, total } = useExportBackup();
  const restoreSamples = useRestoreSamplePurchases();

  function toggleReminder(offsetDays: number) {
    if (!settings || update.isPending) return;
    const current = settings.reminderOffsetsDays;
    const next = current.includes(offsetDays)
      ? current.filter((days) => days !== offsetDays)
      : [...current, offsetDays].sort((a, b) => b - a);
    update.mutate({ reminderOffsetsDays: next });
  }

  function confirmRestore() {
    confirmAction('Restaurar datos de ejemplo', 'Se borrarán todas tus compras actuales.', () =>
      restoreSamples.mutate(undefined, { onSuccess: () => showToast('Datos de ejemplo restaurados') }),
    );
  }

  return (
    <Screen gap={20}>
      <ScreenTitle>Ajustes</ScreenTitle>
      {settings && (
        <>
          <View style={{ gap: 10 }}>
            <SectionLabel>Preferencias</SectionLabel>
            <Card>
              <SettingField
                divider
                label="Moneda"
                sample={formatMoney({ amountCents: 129999000, currency: settings.currency })}>
                <SegmentedControl<string>
                  variant="setting"
                  options={currencyOptions}
                  value={settings.currency}
                  onChange={(value) => {
                    const option = currencyOptions.find((item) => item.value === value);
                    if (option) update.mutate({ currency: option.value });
                  }}
                />
              </SettingField>
              <SettingField label="Tema">
                <SegmentedControl
                  variant="setting"
                  options={themeOptions}
                  value={scheme}
                  onChange={(theme) => update.mutate({ theme })}
                />
              </SettingField>
            </Card>
          </View>
          <View style={{ gap: 10 }}>
            <SectionLabel>Nuevas compras</SectionLabel>
            <Card>
              <SettingField divider label="Garantía por defecto">
                <SegmentedControl
                  variant="setting"
                  options={monthOptions}
                  value={defaultMonths}
                  onChange={setDefaultMonths}
                />
              </SettingField>
              {reminderOffsets.map((offsetDays) => (
                <SwitchRow
                  key={offsetDays}
                  label={`Avisar ${offsetDays} días antes`}
                  detail="Antes de que venza la garantía"
                  value={settings.reminderOffsetsDays.includes(offsetDays)}
                  onPress={() => toggleReminder(offsetDays)}
                />
              ))}
            </Card>
          </View>
        </>
      )}
      <View style={{ gap: 10 }}>
        <SectionLabel>Tus datos</SectionLabel>
        <Card>
          <SettingAction divider label="Crear respaldo" detail={`${total} compras`} onPress={exportBackup} />
          <SettingAction
            divider
            label="Restaurar respaldo…"
            onPress={() => showToast('Restaurar respaldo estará disponible pronto')}
          />
          <SettingAction destructive label="Restaurar datos de ejemplo" onPress={confirmRestore} />
        </Card>
      </View>
    </Screen>
  );
}
