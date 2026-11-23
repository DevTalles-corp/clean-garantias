// Alert de React Native no funciona en web.
export function confirmAction(title: string, message: string, onConfirm: () => void): void {
  if (window.confirm(`${title}\n\n${message}`)) onConfirm();
}
