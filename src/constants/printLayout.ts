/** Boards per printed page (3 columns × 3 rows). */
export const BOARDS_PER_PRINT_SHEET = 9;

export const PRINT_GRID_COLUMNS = 3;
export const PRINT_GRID_ROWS = 3;

export function chunkIntoSheets<T>(items: readonly T[], perSheet = BOARDS_PER_PRINT_SHEET): T[][] {
  const sheets: T[][] = [];
  for (let i = 0; i < items.length; i += perSheet) {
    sheets.push(items.slice(i, i + perSheet) as T[]);
  }
  return sheets;
}
