export type GenerationPayload = {
  boards: string[][][];
  header: string;
  boardsPerPrintPage: number;
  printCardWidthMm: number;
  printCardHeightMm: number | null;
};
