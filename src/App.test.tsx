import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import {
  FIXED_BOARDS_PER_PRINT_PAGE,
  FIXED_PRINT_CARD_HEIGHT_MM,
  FIXED_PRINT_CARD_WIDTH_MM,
  FIXED_PRINT_GRID_COLS,
  FIXED_PRINT_GRID_ROWS,
} from './constants/printLayout';

const genMocks = vi.hoisted(() => ({
  isSafeGeneration: vi.fn(() => true),
  generateCombinations: vi.fn(() => [
    [
      [0, 1],
      [2, 3],
    ],
  ]),
}));

vi.mock('./core/BingoGenerator', () => ({
  isSafeGeneration: genMocks.isSafeGeneration,
  generateCombinations: genMocks.generateCombinations,
}));

describe('App UI', () => {
  beforeEach(() => {
    cleanup();
    genMocks.isSafeGeneration.mockReturnValue(true);
    genMocks.generateCombinations.mockReturnValue([
      [
        [0, 1],
        [2, 3],
      ],
    ]);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows the generator form first', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/song list/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/how many boards \(total\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/song grid.*across/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/song grid.*down/i)).toBeInTheDocument();
    expect(screen.getByText(/print \/ pdf layout \(fixed\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fixed print dimensions/i)).toBeInTheDocument();
    expect(screen.getByText(String(FIXED_BOARDS_PER_PRINT_PAGE))).toBeInTheDocument();
    expect(screen.getByText(`${FIXED_PRINT_GRID_COLS} × ${FIXED_PRINT_GRID_ROWS}`)).toBeInTheDocument();
    expect(screen.getByText(`${FIXED_PRINT_CARD_WIDTH_MM} mm`)).toBeInTheDocument();
    expect(screen.getByText(`${FIXED_PRINT_CARD_HEIGHT_MM} mm`)).toBeInTheDocument();
    expect(screen.getByLabelText(/header image url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/upload header image/i)).toBeInTheDocument();
  });

  it('submits the form and shows board cells from the song list', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/song list/i), 'A\nB\nC\nD');
    await user.type(screen.getByLabelText(/how many boards \(total\)/i), '1');
    await user.type(screen.getByLabelText(/song grid.*across/i), '2');
    await user.type(screen.getByLabelText(/song grid.*down/i), '2');
    await user.click(screen.getByRole('button', { name: /generate/i }));

    await waitFor(() => {
      expect(screen.getByText('A')).toBeInTheDocument();
    });
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
    const imgs = screen.getAllByRole('img', { name: /bingo card header/i });
    expect((imgs[0] as HTMLElement).style.backgroundImage).toContain('Bingo');
    expect(screen.queryByRole('button', { name: /generate/i })).not.toBeInTheDocument();
    expect(screen.getByTestId('print-options-panel')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /print layout/i })).toBeInTheDocument();
  });

  it('shows fixed print summary on the board view and can return to the form', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/song list/i), 'A\nB\nC\nD');
    await user.type(screen.getByLabelText(/how many boards \(total\)/i), '1');
    await user.type(screen.getByLabelText(/song grid.*across/i), '2');
    await user.type(screen.getByLabelText(/song grid.*down/i), '2');
    await user.click(screen.getByRole('button', { name: /generate/i }));

    await waitFor(() => {
      expect(screen.getByTestId('print-options-panel')).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/fixed print dimensions/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /change songs/i }));
    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument();
  });

  it('calls alert when validation fails', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    genMocks.isSafeGeneration.mockReturnValue(false);

    render(<App />);
    try {
      await user.type(screen.getByLabelText(/song list/i), 'only');
      await user.type(screen.getByLabelText(/how many boards \(total\)/i), '99');
      await user.type(screen.getByLabelText(/song grid.*across/i), '5');
      await user.type(screen.getByLabelText(/song grid.*down/i), '5');
      await user.click(screen.getByRole('button', { name: /generate/i }));

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalled();
      });
      expect(alertSpy.mock.calls[0][0]).toMatch(/width|height|song|board|combinations/i);
      expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument();
    } finally {
      alertSpy.mockRestore();
    }
  });

  it('uses FileReader result as header when a file is selected', async () => {
    const user = userEvent.setup();
    const dataUrl = 'data:image/png;base64,teststub';
    class MockFileReader {
      result: string | null = null;
      onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;
      readAsDataURL() {
        this.result = dataUrl;
        queueMicrotask(() => {
          if (this.onload) this.onload.call(this as unknown as FileReader, {} as ProgressEvent<FileReader>);
        });
      }
    }
    vi.stubGlobal('FileReader', MockFileReader as unknown as typeof FileReader);

    render(<App />);
    await user.type(screen.getByLabelText(/song list/i), 'A\nB\nC\nD');
    await user.type(screen.getByLabelText(/how many boards \(total\)/i), '1');
    await user.type(screen.getByLabelText(/song grid.*across/i), '2');
    await user.type(screen.getByLabelText(/song grid.*down/i), '2');

    const file = new File(['x'], 'banner.png', { type: 'image/png' });
    await user.upload(screen.getByLabelText(/upload header image/i), file);
    await user.click(screen.getByRole('button', { name: /generate/i }));

    await waitFor(() => {
      const img = screen.getByRole('img', { name: /bingo card header/i });
      expect((img as HTMLElement).style.backgroundImage).toContain('data:image/png');
    });
  });
});
