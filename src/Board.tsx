import * as React from 'react';
import {
  FIXED_BOARDS_PER_PRINT_PAGE,
  FIXED_PRINT_CARD_HEIGHT_MM,
  FIXED_PRINT_CARD_WIDTH_MM,
  FIXED_PRINT_GRID_COLS,
  chunkIntoSheets,
} from './constants/printLayout';
import { DEFAULT_BINGO_HEADER_IMAGE } from './defaultHeader';

export class Board extends React.Component<{ boards: string[][][]; header: string }, {}> {
  constructor(props: { boards: string[][][]; header: string }) {
    super(props);
  }

  render() {
    const headerSrc =
      this.props.header && this.props.header.trim() ? this.props.header.trim() : DEFAULT_BINGO_HEADER_IMAGE;
    const perSheet = FIXED_BOARDS_PER_PRINT_PAGE;
    const cols = FIXED_PRINT_GRID_COLS;
    const sheets = chunkIntoSheets(this.props.boards, perSheet);

    const widthMm = FIXED_PRINT_CARD_WIDTH_MM;
    const heightMm = FIXED_PRINT_CARD_HEIGHT_MM;

    const sheetGridStyle = {
      ['--print-grid-cols' as string]: String(cols),
      ['--print-board-mm' as string]: `${widthMm}mm`,
    } as React.CSSProperties;

    const boardFixedHeightStyle: React.CSSProperties = {
      height: `${heightMm}mm`,
      overflow: 'hidden',
    };

    const headerBannerStyle: React.CSSProperties = {
      backgroundImage: `url(${JSON.stringify(headerSrc)})`,
    };

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
                  className="mx-bingo-board mx-bingo-board--fixed-height"
                  key={globalIndex}
                  style={boardFixedHeightStyle}
                >
                  <div className="mx-bingo-board_row mx-bingo-board_row--header">
                    <div
                      className="mx-bingo-board_header-banner"
                      role="img"
                      aria-label="Bingo card header"
                      style={headerBannerStyle}
                    />
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
