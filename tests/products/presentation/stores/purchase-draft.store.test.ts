import { usePurchaseDraftStore } from '@/products/presentation/stores/purchase-draft.store';

import { pickedPhoto } from '../../../shared/application/test-context';

describe('usePurchaseDraftStore', () => {
  const draft = usePurchaseDraftStore.getState;

  beforeEach(() => draft().start());

  test('empieza sin foto', () => {
    expect(draft().photo).toBeNull();
  });

  test('con una foto abre el formulario sin inventar datos', () => {
    draft().fillFromPhoto(pickedPhoto, '2026-06-15', 24);

    expect(draft()).toMatchObject({ step: 'form', photo: pickedPhoto, detected: [], errors: {} });
    expect(draft().form).toEqual({
      product: '',
      store: '',
      date: '2026-06-15',
      price: '',
      categoryId: '',
      months: 24,
      hasReceipt: false,
    });
  });

  test('quitar la foto conserva los campos', () => {
    draft().fillFromPhoto(pickedPhoto, '2026-06-15', 24);
    draft().setField('product', 'Hervidor');
    const { form } = draft();

    draft().removePhoto();

    expect(draft()).toMatchObject({ step: 'form', photo: null, form });
  });

  test.each([
    ['fillManually', () => draft().fillManually('2026-06-15', 12)],
    ['fillFromReceipt', () => draft().fillFromReceipt(12)],
    ['start', () => draft().start()],
  ])('%s descarta la foto', (_name, act) => {
    draft().fillFromPhoto(pickedPhoto, '2026-06-15', 24);
    act();
    expect(draft().photo).toBeNull();
  });
});
