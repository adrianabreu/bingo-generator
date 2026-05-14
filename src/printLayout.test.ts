import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  BOARDS_PER_PRINT_SHEET,
  PRINT_GRID_COLUMNS,
  PRINT_GRID_ROWS,
  chunkIntoSheets,
} from './constants/printLayout';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('print layout constants', () => {
  it('uses a 3×3 grid so nine boards fit on one landscape sheet', () => {
    expect(PRINT_GRID_COLUMNS * PRINT_GRID_ROWS).toBe(BOARDS_PER_PRINT_SHEET);
    expect(BOARDS_PER_PRINT_SHEET).toBe(9);
  });

  it('chunks boards into sheets of nine', () => {
    const items = Array.from({ length: 14 }, (_, i) => i);
    const sheets = chunkIntoSheets(items);
    expect(sheets).toEqual([
      [0, 1, 2, 3, 4, 5, 6, 7, 8],
      [9, 10, 11, 12, 13],
    ]);
  });
});

describe('print stylesheet (landscape + grid)', () => {
  it('requests landscape @page for horizontal print', () => {
    const scssPath = join(__dirname, 'styles.scss');
    const scss = readFileSync(scssPath, 'utf8');
    expect(scss).toMatch(/@page[\s\S]*size:[^;{]*landscape/);
  });

  it('uses three equal grid rows per print sheet', () => {
    const scssPath = join(__dirname, 'styles.scss');
    const scss = readFileSync(scssPath, 'utf8');
    expect(scss).toMatch(/\.mx-bingo-print-sheet\s*\{[^}]*grid-template-rows:\s*repeat\(3,\s*1fr\)/s);
    expect(scss).toMatch(/210mm/);
  });

  it('uses a 3-column grid on each print sheet', () => {
    const scssPath = join(__dirname, 'styles.scss');
    const scss = readFileSync(scssPath, 'utf8');
    expect(scss).toMatch(/\.mx-bingo-print-sheet\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*1fr\)/s);
  });
});
