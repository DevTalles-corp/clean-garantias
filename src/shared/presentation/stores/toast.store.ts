// Aviso breve que se muestra sobre cualquier pantalla.

import { create } from 'zustand';

const durationMs = 2600;

interface ToastState {
  message: string | null;
}

export const useToastStore = create<ToastState>(() => ({ message: null }));

let timer: ReturnType<typeof setTimeout> | undefined;

export function showToast(message: string): void {
  clearTimeout(timer);
  useToastStore.setState({ message });
  timer = setTimeout(() => useToastStore.setState({ message: null }), durationMs);
}
