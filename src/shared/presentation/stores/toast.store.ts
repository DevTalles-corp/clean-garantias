// Aviso breve que se muestra sobre cualquier pantalla.

import { create } from 'zustand';

const durationMs = 2600;

export type ToastType = 'success' | 'info';

interface ToastState {
  message: string | null;
  type: ToastType;
}

export const useToastStore = create<ToastState>(() => ({ message: null, type: 'success' }));

let timer: ReturnType<typeof setTimeout> | undefined;

export function showToast(message: string, type: ToastType = 'success'): void {
  clearTimeout(timer);
  useToastStore.setState({ message, type });
  timer = setTimeout(() => useToastStore.setState({ message: null }), durationMs);
}
