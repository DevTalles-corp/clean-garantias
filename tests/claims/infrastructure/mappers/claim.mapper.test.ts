import { Claim } from '@/claims/domain/entities/claim.entity';
import { ClaimMapper } from '@/claims/infrastructure/mappers/claim.mapper';

const claim = Claim.restore({
  id: '00000006-0000-4000-8000-000000000000',
  warrantyId: '00000004-0000-4000-8000-000000000000',
  issue: 'No enciende',
  status: 'resolved',
  ticketNumber: 'T-1',
  openedAt: '2026-03-01',
  resolvedAt: '2026-03-10',
  resolution: 'Reparado',
  updatedAt: '2026-03-10',
});

describe('ClaimMapper', () => {
  test('conserva todos los datos al convertir a fila y de vuelta', () => {
    const restored = ClaimMapper.toDomain(ClaimMapper.toRow(claim));

    expect(restored).toBeInstanceOf(Claim);
    expect({ ...restored }).toEqual({ ...claim });
  });

  test('convierte los opcionales ausentes en null y de vuelta', () => {
    const minimal = Claim.restore({
      ...claim,
      ticketNumber: undefined,
      resolution: undefined,
    });
    const row = ClaimMapper.toRow(minimal);

    expect(Object.values(row)).not.toContain(undefined);
    expect(Object.values(row)).toContain(null);
    expect({ ...ClaimMapper.toDomain(row) }).toEqual({ ...minimal });
  });

  test('rechaza una fila con datos inválidos', () => {
    expect(() => ClaimMapper.toDomain({ ...ClaimMapper.toRow(claim), status: 'x' })).toThrow(
      expect.objectContaining({ name: 'ValidationError' }),
    );
  });
});
