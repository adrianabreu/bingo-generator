import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import {
  FIXED_BOARDS_PER_PRINT_PAGE,
  FIXED_PRINT_CARD_WIDTH_MM,
} from './constants/printLayout';
import { DEFAULT_BINGO_HEADER_IMAGE } from './defaultHeader';
import { Board } from './Board';

const sampleBoards: string[][][] = [
  [
    ['Alpha', 'Bravo'],
    ['Charlie', 'Delta'],
  ],
  [
    ['Echo', 'Foxtrot'],
    ['Golf', 'Hotel'],
  ],
];

const singleCellBoard = (label: string): string[][] => [[label]];

describe('Board', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders all cells for every board', () => {
    render(<Board boards={sampleBoards} header="" />);

    for (const text of ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel']) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
  });

  it('renders two board containers', () => {
    const { container } = render(<Board boards={sampleBoards} header="" />);
    const boards = container.querySelectorAll('.mx-bingo-board');
    expect(boards).toHaveLength(2);
  });

  it('uses default SVG header when header prop is empty', () => {
    render(<Board boards={sampleBoards} header="" />);
    const imgs = screen.getAllByRole('img', { name: /bingo card header/i });
    expect(imgs).toHaveLength(2);
    expect(imgs[0].getAttribute('src')).toBe(DEFAULT_BINGO_HEADER_IMAGE);
  });

  it('uses custom header URL when provided', () => {
    render(<Board boards={sampleBoards} header="https://example.com/logo.png" />);
    const imgs = screen.getAllByRole('img', { name: /bingo card header/i });
    expect(imgs).toHaveLength(2);
    expect(imgs[0]).toHaveAttribute('src', 'https://example.com/logo.png');
  });

  it('always uses fixed print height class on every card', () => {
    render(<Board boards={sampleBoards} header="" />);
    expect(document.querySelectorAll('.mx-bingo-board--fixed-height')).toHaveLength(2);
  });

  it('places song cells inside grid rows', () => {
    const { container } = render(<Board boards={[sampleBoards[0]]} header="" />);
    const board = container.querySelector('.mx-bingo-board')!;
    expect(board.querySelector('.mx-bingo-board_row--header')).not.toBeNull();
    const dataRows = board.querySelectorAll(':scope > .mx-bingo-board_row:not(.mx-bingo-board_row--header)');
    expect(dataRows).toHaveLength(2);
    expect(within(dataRows[0] as HTMLElement).getByText('Alpha')).toBeInTheDocument();
    expect(within(dataRows[0] as HTMLElement).getByText('Bravo')).toBeInTheDocument();
  });

  it(`chunks boards into print sheets of ${FIXED_BOARDS_PER_PRINT_PAGE}`, () => {
    const boards = Array.from({ length: 12 }, (_, i) => singleCellBoard(`C${i}`));
    const { container } = render(<Board boards={boards} header="" />);

    const sheets = screen.getAllByTestId('bingo-print-sheet');
    expect(sheets).toHaveLength(2);
    expect(sheets[0].querySelectorAll('.mx-bingo-board')).toHaveLength(FIXED_BOARDS_PER_PRINT_PAGE);
    expect(sheets[1].querySelectorAll('.mx-bingo-board')).toHaveLength(3);
    expect(container.querySelectorAll('.mx-bingo-board')).toHaveLength(12);
  });

  it('uses fixed grid CSS variables for print', () => {
    const boards = Array.from({ length: 12 }, (_, i) => singleCellBoard(`C${i}`));
    render(<Board boards={boards} header="" />);

    const sheets = screen.getAllByTestId('bingo-print-sheet');
    expect(sheets[0]).toHaveStyle({
      '--print-grid-cols': '3',
      '--print-board-mm': `${FIXED_PRINT_CARD_WIDTH_MM}mm`,
    });
  });

  it('last print sheet holds fewer boards when total is not a multiple of per-page count', () => {
    const boards = Array.from({ length: 8 }, (_, i) => singleCellBoard(`K${i}`));
    render(<Board boards={boards} header="" />);
    const sheets = screen.getAllByTestId('bingo-print-sheet');
    expect(sheets).toHaveLength(1);
    expect(sheets[0].querySelectorAll('.mx-bingo-board')).toHaveLength(8);
  });
});
