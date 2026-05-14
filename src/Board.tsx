import * as React from 'react';
import {
  DEFAULT_BOARDS_PER_PRINT_PAGE,
  chunkIntoSheets,
  getPrintGridLayout,
  getSuggestedPrintCardWidthMm,
  clampPrintCardWidthMm,
  normalizePrintCardHeightMm,
} from './constants/printLayout';
import { DEFAULT_BINGO_HEADER_IMAGE } from './defaultHeader';

export type BoardPrintOptions = {
  boardsPerPrintPage?: number;
  /** Printed card width (mm). */
  printCardWidthMm?: number;
  /** Printed card height (mm); omit or null = grow with song rows. */
  printCardHeightMm?: number | null;
};

export class Board extends React.Component<
  { boards: string[][][]; header: string } & BoardPrintOptions,
  {}
> {
  constructor(props: { boards: string[][][]; header: string } & BoardPrintOptions) {
    super(props);
  }

  render() {
    const headerSrc =
      this.props.header && this.props.header.trim() ? this.props.header.trim() : DEFAULT_BINGO_HEADER_IMAGE;
    const { cols, count: perSheet } = getPrintGridLayout(
      this.props.boardsPerPrintPage ?? DEFAULT_BOARDS_PER_PRINT_PAGE
    );
    const sheets = chunkIntoSheets(this.props.boards, perSheet);

    const widthMm = clampPrintCardWidthMm(
      this.props.printCardWidthMm ?? getSuggestedPrintCardWidthMm(cols)
    );
    const heightMm = normalizePrintCardHeightMm(this.props.printCardHeightMm);

    const sheetGridStyle = {
      ['--print-grid-cols' as string]: String(cols),
      ['--print-board-mm' as string]: `${widthMm}mm`,
    } as React.CSSProperties;

    const boardFixedHeightStyle: React.CSSProperties | undefined =
      heightMm != null
        ? { height: `${heightMm}mm`, overflow: 'hidden' as const }
        : undefined;

    return (
      <div className="mx-bingo">
        {sheets.map((boardsOnSheet, sheetIndex) => (
          <div
            className="mx-bingo-print-sheet"
            key={sheetIndex}
            data-testid="bingo-print-sheet"
            aria-label={`Print sheet ${sheetIndex + 1} of ${sheets.length}`}
            style={sheetGridStyle}
          >
            {boardsOnSheet.map((board, boardIndex) => {
              const globalIndex = sheetIndex * perSheet + boardIndex;
              return (
                <div
                  className={[
                    'mx-bingo-board',
                    heightMm != null ? 'mx-bingo-board--fixed-height' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  key={globalIndex}
                  style={boardFixedHeightStyle}
                >
                  <div className="mx-bingo-board_row mx-bingo-board_row--header">
                    <img src={headerSrc} alt="Bingo card header" />
                  </div>
                  {board.map((row, rowIndex) => (
                    <div className="mx-bingo-board_row" key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <div className="mx-bingo-board_cell" key={cellIndex}>
                          {cell}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }
}
