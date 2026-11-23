// Asistente de nueva compra: paso actual y datos del formulario.

import { create } from 'zustand';

import { mockReceipts, type MockReceipt } from '@/products/presentation/constants/mock-receipts';
import type {
  PurchaseField,
  PurchaseForm,
  PurchaseFormErrors,
} from '@/products/presentation/schemas/register-purchase.schema';
import type { IsoDate } from '@/shared/domain/value-objects/iso-date';

export type PurchaseStep = 'source' | 'camera' | 'gallery' | 'reading' | 'form';

interface PurchaseDraftState {
  step: PurchaseStep;
  receipt: MockReceipt;
  form: PurchaseForm;
  detected: readonly PurchaseField[];
  errors: PurchaseFormErrors;
  start: () => void;
  goTo: (step: PurchaseStep) => void;
  read: (receipt: MockReceipt) => void;
  fillFromReceipt: (months: number) => void;
  fillManually: (today: IsoDate, months: number) => void;
  setField: <K extends PurchaseField>(field: K, value: PurchaseForm[K]) => void;
  setErrors: (errors: PurchaseFormErrors) => void;
}

const emptyForm: PurchaseForm = {
  product: '',
  store: '',
  date: '',
  price: '',
  categoryId: '',
  months: 12,
  hasReceipt: false,
};

const initial = {
  step: 'source' as PurchaseStep,
  receipt: mockReceipts[0],
  form: emptyForm,
  detected: [] as readonly PurchaseField[],
  errors: {} as PurchaseFormErrors,
};

export const usePurchaseDraftStore = create<PurchaseDraftState>((set) => ({
  ...initial,
  start: () => set(initial),
  goTo: (step) => set({ step, receipt: mockReceipts[0] }),
  read: (receipt) => set({ step: 'reading', receipt }),
  fillFromReceipt: (months) =>
    set(({ receipt }) => ({
      step: 'form',
      form: {
        ...emptyForm,
        store: receipt.store[0] + receipt.store.slice(1).toLowerCase(),
        date: receipt.date,
        price: String(receipt.total.amountCents / 100),
        months,
        hasReceipt: true,
      },
      detected: ['store', 'date', 'price'],
      errors: {},
    })),
  fillManually: (today, months) =>
    set({ step: 'form', form: { ...emptyForm, date: today, months }, detected: [], errors: {} }),
  setField: (field, value) =>
    set(({ form, detected, errors }) => ({
      form: { ...form, [field]: value },
      detected: detected.filter((item) => item !== field),
      errors: { ...errors, [field]: undefined },
    })),
  setErrors: (errors) => set({ errors }),
}));
