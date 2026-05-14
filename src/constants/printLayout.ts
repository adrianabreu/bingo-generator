/** Default boards per sheet when the form does not specify a value. */
export const DEFAULT_BOARDS_PER_PRINT_PAGE = 9;

/**
 * Allowed counts for “boards per printed page” and the CSS grid used on each sheet
 * (columns × rows, landscape A4).
 */
export const PRINT_LAYOUT_BY_COUNT: Readonly<Record<number, { cols: number; rows: number }>> = {
  1: { cols: 1, rows: 1 },
  2: { cols: 2, rows: 1 },
  4: { cols: 2, rows: 2 },
  6: { cols: 3, rows: 2 },
  9: { cols: 3, rows: 3 },
  12: { cols: 4, rows: 3 },
};

export const PRINT_PAGE_SIZE_OPTIONS = Object.keys(PRINT_LAYOUT_BY_COUNT)
  .map(Number)
  .sort((a, b) => a - b);

export function getPrintGridLayout(boardsPerPage: number): {
  cols: number;
  rows: number;
  count: number;
} {
  const count = PRINT_LAYOUT_BY_COUNT[boardsPerPage] ? boardsPerPage : DEFAULT_BOARDS_PER_PRINT_PAGE;
  const { cols, rows } = PRINT_LAYOUT_BY_COUNT[count];
  return { cols, rows, count };
}

export function chunkIntoSheets<T>(items: readonly T[], perSheet: number): T[][] {
  const n = Math.max(1, Math.floor(perSheet));
  const sheets: T[][] = [];
  for (let i = 0; i < items.length; i += n) {
    sheets.push(items.slice(i, i + n) as T[]);
  }
  return sheets;
}
