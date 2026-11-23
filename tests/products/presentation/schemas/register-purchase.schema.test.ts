import { validatePurchaseForm } from '@/products/presentation/schemas/register-purchase.schema';

const form = {
  product: 'Hervidor',
  store: 'Falabella',
  date: '2026-06-15',
  price: '100',
  categoryId: 'id',
  months: 12,
  hasReceipt: false,
};

describe('validatePurchaseForm', () => {
  test('acepta un formulario completo', () => {
    expect(validatePurchaseForm(form, '2026-06-15')).toEqual({});
  });

  test.each([
    ['product', { product: 'a' }, 'Escribe el nombre del producto'],
    ['store', { store: ' ' }, 'Indica la tienda'],
    ['date', { date: '' }, 'Fecha inválida'],
    ['date', { date: '2026-06-16' }, 'La fecha no puede ser futura'],
    ['price', { price: '0' }, 'El precio debe ser mayor a 0'],
    ['price', { price: '9'.repeat(20) }, 'El precio es demasiado alto'],
    ['categoryId', { categoryId: '' }, 'Elige una categoría'],
    ['months', { months: 0 }, 'Entre 1 y 120 meses'],
  ])('rechaza %s con %j', (field, changes, message) => {
    expect(validatePurchaseForm({ ...form, ...changes }, '2026-06-15')).toEqual({ [field]: message });
  });
});
