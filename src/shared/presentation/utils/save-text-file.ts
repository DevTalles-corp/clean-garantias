import { Share } from 'react-native';

// Devuelve false si el usuario cancela.
export async function saveTextFile(fileName: string, content: string): Promise<boolean> {
  const { action } = await Share.share({ title: fileName, message: content });
  return action === Share.sharedAction;
}
