import { useUseCases } from '@/shared/presentation/providers/use-cases.context';

// null: no hay archivo que mostrar.
export function useAttachmentUri(fileUri?: string): string | null {
  const { attachments } = useUseCases();
  return fileUri ? attachments.getUri.execute(fileUri) : null;
}
