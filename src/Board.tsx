import * as React from 'react';
import {
  DEFAULT_BOARDS_PER_PRINT_PAGE,
  chunkIntoSheets,
  getPrintGridLayout,
} from './constants/printLayout';
import { DEFAULT_BINGO_HEADER_IMAGE } from './defaultHeader';

export class Board extends React.Component<
  { boards: string[][][]; header: string; boardsPerPrintPage?: number },
  {}
> {
  constructor(props: { boards: string[][][]; header: string; boardsPerPrintPage?: number }) {
    super(props);
  }

  render() {
    const headerSrc =
      this.props.header && this.props.header.trim() ? this.props.header.trim() : DEFAULT_BINGO_HEADER_IMAGE;
    const { cols, rows, count: perSheet } = getPrintGridLayout(
      this.props.boardsPerPrintPage ?? DEFAULT_BOARDS_PER_PRINT_PAGE
    );
    const sheets = chunkIntoSheets(this.props.boards, perSheet);

    const sheetGridStyle = {
      ['--print-grid-cols' as string]: String(cols),
      ['--print-grid-rows' as string]: String(rows),
    } as React.CSSProperties;

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
                <div className="mx-bingo-board" key={globalIndex}>
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
