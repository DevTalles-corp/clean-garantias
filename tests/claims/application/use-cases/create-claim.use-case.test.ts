import { CreateClaimUseCase } from '@/claims/application/use-cases/create-claim.use-case';
import { Claim, type CreateClaimData } from '@/claims/domain/entities/claim.entity';

import {
  conflictError,
  createSeededContext,
  entities,
  firstGeneratedId,
  ids,
  missingId,
  notFoundError,
  today,
  validationError,
  type TestContext,
} from '../../../shared/application/test-context';

const input: CreateClaimData = { warrantyId: ids.warranty, issue: '  Pantalla rota  ' };

describe('CreateClaimUseCase', () => {
  let context: TestContext;
  let useCase: CreateClaimUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new CreateClaimUseCase({
      claimRepository: context.claims,
      warrantyRepository: context.warranties,
      idGenerator: context.idGenerator,
      clock: context.clock,
    });
  });

  test('crea, guarda y devuelve la entidad con id y fecha inyectados', async () => {
    const claim = await useCase.execute(input);

    expect(claim).toBeInstanceOf(Claim);
    expect(claim).toMatchObject({
      id: firstGeneratedId,
      warrantyId: ids.warranty,
      issue: 'Pantalla rota',
      status: 'open',
      openedAt: today,
    });
    expect(await context.claims.findById(firstGeneratedId)).toBe(claim);
  });

  test('lanza ValidationError y no guarda con datos inválidos', async () => {
    const save = jest.spyOn(context.claims, 'save');

    await expect(
      useCase.execute({ ...input, issue: '' }),
    ).rejects.toThrow(validationError('La descripción del problema es obligatoria.'));
    expect(save).not.toHaveBeenCalled();
  });

  test('lanza ConflictError y no guarda si la garantía está vencida', async () => {
    const save = jest.spyOn(context.claims, 'save');
    // Vence el 2026-06-10, antes de hoy.
    await context.warranties.save(entities.warranty.update({ durationMonths: 5 }, '2026-01-10', today));

    await expect(useCase.execute(input)).rejects.toThrow(
      conflictError('No se puede abrir un reclamo sobre una garantía vencida.'),
    );
    expect(save).not.toHaveBeenCalled();
  });

  test('lanza NotFoundError si la garantía no existe', async () => {
    await expect(useCase.execute({ ...input, warrantyId: missingId })).rejects.toThrow(
      notFoundError('Garantía no encontrada.'),
    );
  });
});
