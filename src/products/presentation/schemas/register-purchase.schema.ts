// Validación del formulario: da un mensaje por campo antes de llamar a los casos de uso.

import { isIsoDate, type IsoDate } from '@/shared/domain/value-objects/iso-date';

export interface PurchaseForm {
  product: string;
  store: string;
  date: IsoDate;
  price: string;
  categoryId: string;
  months: number;
  hasReceipt: boolean;
}

export type PurchaseField = keyof PurchaseForm;
export type PurchaseFormErrors = Partial<Record<PurchaseField, string>>;

export const minFormMonths = 1;
export const maxFormMonths = 120;

export function validatePurchaseForm(form: PurchaseForm, today: IsoDate): PurchaseFormErrors {
  const errors: PurchaseFormErrors = {};

  if (form.product.trim().length < 2) errors.product = 'Escribe el nombre del producto';
  if (!form.store.trim()) errors.store = 'Indica la tienda';
  if (!isIsoDate(form.date)) errors.date = 'Fecha inválida';
  else if (form.date > today) errors.date = 'La fecha no puede ser futura';
  if (!Number(form.price)) errors.price = 'El precio debe ser mayor a 0';
  else if (!Number.isSafeInteger(Number(form.price) * 100)) errors.price = 'El precio es demasiado alto';
  if (!form.categoryId) errors.categoryId = 'Elige una categoría';
  if (!Number.isInteger(form.months) || form.months < minFormMonths || form.months > maxFormMonths) {
    errors.months = `Entre ${minFormMonths} y ${maxFormMonths} meses`;
  }
  return errors;
}
