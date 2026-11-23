import type { CreateSettingsData } from '@/settings/domain/entities/settings.entity';
import { useAppMutation } from '@/shared/presentation/hooks/use-app-mutation';
import { useUseCases } from '@/shared/presentation/providers/use-cases.context';

export function useUpdateSettings() {
  const { settings } = useUseCases();
  return useAppMutation((changes: Partial<CreateSettingsData>) => settings.update.execute(changes));
}
