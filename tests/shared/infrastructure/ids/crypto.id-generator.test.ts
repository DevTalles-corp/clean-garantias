import { randomUUID } from 'expo-crypto';

import { CryptoIdGenerator } from '@/shared/infrastructure/ids/crypto.id-generator';

jest.mock('expo-crypto', () => ({ randomUUID: jest.fn() }));

describe('CryptoIdGenerator', () => {
  test('devuelve el UUID generado por expo-crypto', () => {
    const id = '3f1c1f0e-6a53-4f5e-9b7e-0a1b2c3d4e5f';
    jest.mocked(randomUUID).mockReturnValue(id);
    expect(new CryptoIdGenerator().generate()).toBe(id);
  });
});
