import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_BOARDS_PER_PRINT_PAGE,
  PRINT_LAYOUT_BY_COUNT,
  chunkIntoSheets,
  getPrintGridLayout,
} from './constants/printLayout';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('print layout', () => {
  it('maps each preset count to a grid whose area matches the count', () => {
    for (const [count, { cols, rows }] of Object.entries(PRINT_LAYOUT_BY_COUNT)) {
      expect(cols * rows).toBe(+count);
    }
  });

  it('defaults unknown boards-per-page to nine', () => {
    expect(getPrintGridLayout(99)).toEqual({ cols: 3, rows: 3, count: DEFAULT_BOARDS_PER_PRINT_PAGE });
  });

  it('chunks by explicit per-sheet size', () => {
    const items = Array.from({ length: 14 }, (_, i) => i);
    const sheets = chunkIntoSheets(items, 6);
    expect(sheets).toEqual([
      [0, 1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10, 11],
      [12, 13],
    ]);
  });
});

describe('print stylesheet (landscape + grid)', () => {
  it('requests landscape @page for horizontal print', () => {
    const scssPath = join(__dirname, 'styles.scss');
    const scss = readFileSync(scssPath, 'utf8');
    expect(scss).toMatch(/@page[\s\S]*size:[^;{]*landscape/);
  });

  it('uses CSS variables for print grid columns and rows', () => {
    const scssPath = join(__dirname, 'styles.scss');
    const scss = readFileSync(scssPath, 'utf8');
    expect(scss).toMatch(/grid-template-columns:\s*repeat\(var\(--print-grid-cols/);
    expect(scss).toMatch(/grid-template-rows:\s*repeat\(var\(--print-grid-rows/);
    expect(scss).toMatch(/210mm/);
  });
});
