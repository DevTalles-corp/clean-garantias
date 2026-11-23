import { Alert } from 'react-native';

export function confirmAction(title: string, message: string, onConfirm: () => void): void {
  Alert.alert(title, message, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Continuar', style: 'destructive', onPress: onConfirm },
  ]);
}
