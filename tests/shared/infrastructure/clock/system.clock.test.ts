import { SystemClock } from '@/shared/infrastructure/clock/system.clock';

describe('SystemClock', () => {
  afterEach(() => jest.useRealTimers());

  test('devuelve la fecha local con ceros a la izquierda', () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 0, 5, 23, 59));
    expect(new SystemClock().today()).toBe('2026-01-05');
  });
});
