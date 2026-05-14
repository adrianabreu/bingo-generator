/** Row-major cell indices for one board (each value is an index into the song list). */
export type BingoBoardMatrix = number[][];

function factorial(r: number): bigint {
  let s = BigInt(1);
  let i = BigInt(r);
  while (i > BigInt(1)) s *= i--;
  return s;
}

/** Binomial C(n, r) — number of ways to choose r distinct items from n. */
export function combinations(n: number, r: number): bigint {
  if (r < 0 || r > n || n < 0) return BigInt(0);
  if (r === 0 || r === n) return BigInt(1);
  let s = BigInt(1);
  let i = BigInt(r);
  while (i < BigInt(n)) s *= ++i;
  return s / factorial(n - r);
}

export function isSafeGeneration(
  songs: number,
  boards: number,
  height: number,
  width: number
): boolean {
  const cells = height * width;
  if (boards < 1 || width < 1 || height < 1) return false;
  if (songs < cells) return false;
  return combinations(songs, cells) >= BigInt(boards);
}

function randomIntBelow(max: number): number {
  if (max <= 0) return 0;
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const cap = Math.floor(0x1_0000_0000 / max) * max;
    const buf = new Uint32Array(1);
    do {
      crypto.getRandomValues(buf);
    } while (buf[0] >= cap);
    return buf[0] % max;
  }
  return Math.floor(Math.random() * max);
}

/** Returns integer in [0, maxExclusive). Used by tests with a seeded PRNG. */
export type RandomIntFn = (maxExclusive: number) => number;

/** Partial Fisher–Yates: returns k distinct indices from [0, poolSize), in random order. */
function pickDistinctIndices(
  poolSize: number,
  k: number,
  rng: RandomIntFn
): number[] {
  const indices = Array.from({ length: poolSize }, (_, i) => i);
  for (let i = 0; i < k; i++) {
    const j = i + rng(poolSize - i);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, k);
}

function boardCanonicalKey(indices: readonly number[]): string {
  return [...indices].sort((a, b) => a - b).join(',');
}

/**
 * Builds unique random boards. Each board uses `height * width` distinct song indices.
 * Bounded work: returns null if not enough unique boards within the attempt budget.
 *
 * @param randomInt — optional RNG for tests; defaults to `crypto` / `Math.random`.
 */
export function generateCombinations(
  width: number,
  height: number,
  elementSize: number,
  amount: number,
  randomInt: RandomIntFn = randomIntBelow
): BingoBoardMatrix[] | null {
  const cells = height * width;
  if (amount < 1 || width < 1 || height < 1 || elementSize < cells) return null;

  const seen = new Set<string>();
  const result: BingoBoardMatrix[] = [];
  const maxAttempts = Math.min(250_000, Math.max(5_000, amount * 400));
  let attempts = 0;

  while (result.length < amount && attempts < maxAttempts) {
    attempts++;
    const flat = pickDistinctIndices(elementSize, cells, randomInt);
    const key = boardCanonicalKey(flat);
    if (seen.has(key)) continue;
    seen.add(key);

    const rows: BingoBoardMatrix = [];
    for (let r = 0; r < height; r++) {
      rows.push(flat.slice(r * width, (r + 1) * width));
    }
    result.push(rows);
  }

  return result.length === amount ? result : null;
}

/** How many times each song index (0 … poolSize−1) appears across all boards. */
export function countAppearancesBySongIndex(
  boards: readonly BingoBoardMatrix[],
  poolSize: number
): number[] {
  const out = Array.from({ length: poolSize }, () => 0);
  for (const board of boards) {
    for (const row of board) {
      for (const i of row) {
        if (i >= 0 && i < poolSize) out[i]++;
      }
    }
  }
  return out;
}
