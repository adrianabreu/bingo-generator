import { describe, expect, it } from 'vitest';
import type { RandomIntFn } from './BingoGenerator';
import {
  combinations,
  countAppearancesBySongIndex,
  generateCombinations,
  isSafeGeneration,
} from './BingoGenerator';

/** Deterministic PRNG for stable tests (returns [0, maxExclusive)). */
function mulberry32(seed: number): RandomIntFn {
  let a = seed >>> 0;
  return (maxExclusive: number) => {
    if (maxExclusive <= 0) return 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    const u = (t ^ (t >>> 14)) >>> 0;
    return u % maxExclusive;
  };
}

describe('combinations (binomial C(n,r))', () => {
  it('matches textbook values for a small sample set', () => {
    expect(combinations(5, 0)).toBe(1n);
    expect(combinations(5, 5)).toBe(1n);
    expect(combinations(5, 2)).toBe(10n);
    expect(combinations(6, 3)).toBe(20n);
    expect(combinations(10, 4)).toBe(210n);
  });

  it('C(20,6) — max distinct 6-song boards from a pool of 20', () => {
    expect(combinations(20, 6)).toBe(38760n);
  });

  it('returns 0 for invalid r', () => {
    expect(combinations(5, 6)).toBe(0n);
    expect(combinations(3, -1)).toBe(0n);
  });
});

describe('isSafeGeneration', () => {
  it('allows one full 5×5 board from exactly 25 songs', () => {
    expect(isSafeGeneration(25, 1, 5, 5)).toBe(true);
  });

  it('rejects when the pool is smaller than the board', () => {
    expect(isSafeGeneration(5, 1, 2, 3)).toBe(false);
  });

  it('allows 100 six-cell boards from 20 songs (combinatorics)', () => {
    expect(isSafeGeneration(20, 100, 2, 3)).toBe(true);
  });

  it('rejects when C(n,k) < number of boards', () => {
    expect(isSafeGeneration(6, 100, 2, 3)).toBe(false);
  });
});

describe('generateCombinations', () => {
  const width = 3;
  const height = 2;
  const pool = 20;
  const cells = 6;

  it('returns null when the pool cannot fill one board', () => {
    expect(generateCombinations(3, 2, 5, 1, mulberry32(1))).toBeNull();
  });

  it('with a degenerate RNG that always picks 0, only one unique board is possible', () => {
    const alwaysZero: RandomIntFn = () => 0;
    expect(generateCombinations(2, 1, 4, 1, alwaysZero)).toEqual([[[0, 1]]]);
    expect(generateCombinations(2, 1, 4, 2, alwaysZero)).toBeNull();
  });

  it('builds 100 unique 2×3 boards from 20 songs (sample: seeded RNG)', () => {
    const boards = generateCombinations(width, height, pool, 100, mulberry32(42));
    expect(boards).not.toBeNull();
    if (!boards) return;

    expect(boards).toHaveLength(100);

    const keys = new Set<string>();
    for (const board of boards) {
      expect(board).toHaveLength(height);
      for (const row of board) {
        expect(row).toHaveLength(width);
        const seen = new Set<number>();
        for (const idx of row) {
          expect(idx).toBeGreaterThanOrEqual(0);
          expect(idx).toBeLessThan(pool);
          expect(seen.has(idx)).toBe(false);
          seen.add(idx);
        }
      }
      const flat = board.flat();
      expect(flat).toHaveLength(cells);
      const key = [...flat].sort((a, b) => a - b).join(',');
      expect(keys.has(key)).toBe(false);
      keys.add(key);
    }
  });

  it('total appearances across 100×6 cells equals 600', () => {
    const boards = generateCombinations(width, height, pool, 100, mulberry32(42));
    expect(boards).not.toBeNull();
    if (!boards) return;
    const counts = countAppearancesBySongIndex(boards, pool);
    expect(counts.reduce((a, b) => a + b, 0)).toBe(600);
  });
});

describe('100 cards × 6 cells from 20 songs — coverage (sample set)', () => {
  it('records spread stats for the mulberry32(42) deck (min/max per song)', () => {
    const boards = generateCombinations(3, 2, 20, 100, mulberry32(42))!;
    const counts = countAppearancesBySongIndex(boards, 20);
    const min = Math.min(...counts);
    const max = Math.max(...counts);
    expect(min).toBe(23);
    expect(max).toBe(40);
  });
});
