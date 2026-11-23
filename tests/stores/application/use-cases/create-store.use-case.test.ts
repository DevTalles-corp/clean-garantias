import { CreateStoreUseCase } from '@/stores/application/use-cases/create-store.use-case';
import { Store, type CreateStoreData } from '@/stores/domain/entities/store.entity';

import {
  createSeededContext,
  firstGeneratedId,
  today,
  validationError,
  type TestContext,
} from '../../../shared/application/test-context';

const input: CreateStoreData = { name: '  Nueva  ', email: 'HOLA@TIENDA.TEST' };

describe('CreateStoreUseCase', () => {
  let context: TestContext;
  let useCase: CreateStoreUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new CreateStoreUseCase({
      storeRepository: context.stores,
      idGenerator: context.idGenerator,
      clock: context.clock,
    });
  });

  test('crea, guarda y devuelve la entidad con id y fecha inyectados', async () => {
    const store = await useCase.execute(input);

    expect(store).toBeInstanceOf(Store);
    expect(store).toMatchObject({
      id: firstGeneratedId,
      name: 'Nueva',
      email: 'hola@tienda.test',
      createdAt: today,
    });
    expect(await context.stores.findById(firstGeneratedId)).toBe(store);
  });

  test('lanza ValidationError y no guarda con datos inválidos', async () => {
    const save = jest.spyOn(context.stores, 'save');

    await expect(
      useCase.execute({ ...input, name: '' }),
    ).rejects.toThrow(validationError('El nombre es obligatorio.'));
    expect(save).not.toHaveBeenCalled();
  });
});
