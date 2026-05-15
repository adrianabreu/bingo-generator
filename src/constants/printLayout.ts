/** Default boards per sheet when the form does not specify a value. */
export const DEFAULT_BOARDS_PER_PRINT_PAGE = 9;

/** Immutable print/PDF layout for this app (nine cards per sheet in a 3×3 grid). */
export const FIXED_BOARDS_PER_PRINT_PAGE = 9;
export const FIXED_PRINT_GRID_COLS = 3;
export const FIXED_PRINT_GRID_ROWS = 3;
export const FIXED_PRINT_CARD_WIDTH_MM = 60;
export const FIXED_PRINT_CARD_HEIGHT_MM = 45;
/** Printed header image width (mm); slightly under card width for borders. */
export const FIXED_PRINT_HEADER_IMAGE_WIDTH_MM = 58;
/** Header strip height on print/PDF (mm). */
export const FIXED_PRINT_HEADER_STRIP_HEIGHT_MM = 9;

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

/** ~A4 landscape printable width (mm) with 10mm margins — used to warn if cards won’t fit. */
export const PRINTABLE_WIDTH_MM_APPROX = 277;

export const PRINT_CARD_WIDTH_MM_MIN = 20;
export const PRINT_CARD_WIDTH_MM_MAX = 95;
export const PRINT_CARD_HEIGHT_MM_MIN = 25;
export const PRINT_CARD_HEIGHT_MM_MAX = 200;

export function getPrintGridLayout(boardsPerPage: number): {
  cols: number;
  rows: number;
  count: number;
} {
  const count = PRINT_LAYOUT_BY_COUNT[boardsPerPage] ? boardsPerPage : DEFAULT_BOARDS_PER_PRINT_PAGE;
  const { cols, rows } = PRINT_LAYOUT_BY_COUNT[count];
  return { cols, rows, count };
}

/** Suggested default print card width (mm) when the form leaves width unset. */
export function getSuggestedPrintCardWidthMm(columnCount: number): number {
  const mm = columnCount >= 4 ? 36 : columnCount >= 3 ? 46 : columnCount >= 2 ? 56 : 76;
  return clampPrintCardWidthMm(mm);
}

export function clampPrintCardWidthMm(value: number): number {
  return Math.min(PRINT_CARD_WIDTH_MM_MAX, Math.max(PRINT_CARD_WIDTH_MM_MIN, Math.round(value)));
}

/** `null` = height grows with content (auto). */
export function normalizePrintCardHeightMm(value: number | undefined | null): number | null {
  if (value == null || !Number.isFinite(value) || value <= 0) return null;
  return Math.min(PRINT_CARD_HEIGHT_MM_MAX, Math.max(PRINT_CARD_HEIGHT_MM_MIN, Math.round(value)));
}

export function printRowFitsApproxLandscape(
  columnCount: number,
  cardWidthMm: number,
  gapMm: number = 4
): boolean {
  if (columnCount < 1) return true;
  return columnCount * cardWidthMm + (columnCount - 1) * gapMm <= PRINTABLE_WIDTH_MM_APPROX + 0.5;
}

export function chunkIntoSheets<T>(items: readonly T[], perSheet: number): T[][] {
  const n = Math.max(1, Math.floor(perSheet));
  const sheets: T[][] = [];
  for (let i = 0; i < items.length; i += n) {
    sheets.push(items.slice(i, i + n) as T[]);
  }
  return sheets;
}
