// Implementación CryptoIdGenerator: genera UUID v4 con expo-crypto.
// Cumple el contrato IdGenerator.

import { randomUUID } from 'expo-crypto';

import type { IdGenerator } from '@/shared/domain/services/id-generator';

export class CryptoIdGenerator implements IdGenerator {
  generate(): string {
    return randomUUID();
  }
}
