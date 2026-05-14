import { generateCombinations, isSafeGeneration } from './core/BingoGenerator';
import * as React from 'react';
import {
  DEFAULT_BOARDS_PER_PRINT_PAGE,
  PRINT_LAYOUT_BY_COUNT,
  clampPrintCardWidthMm,
  getPrintGridLayout,
  normalizePrintCardHeightMm,
  printRowFitsApproxLandscape,
  PRINTABLE_WIDTH_MM_APPROX,
} from './constants/printLayout';
import type { GenerationPayload } from './generationPayload';

type Props = {
  setParentState: (payload: GenerationPayload) => void;
};

export class InputForm extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    const songsField = form.elements.namedItem('songs') as HTMLTextAreaElement;
    const lines = songsField.value.split('\n');
    const songs = lines.length;
    const amount = +(form.elements.namedItem('boards') as HTMLInputElement).value;
    const width = +(form.elements.namedItem('width') as HTMLInputElement).value;
    const height = +(form.elements.namedItem('height') as HTMLInputElement).value;
    const headerUrl = (form.elements.namedItem('headerUrl') as HTMLInputElement).value.trim();
    const headerFileInput = form.elements.namedItem('headerFile') as HTMLInputElement;
    const file = headerFileInput.files?.[0];
    const boardsPerPrintRaw = +(form.elements.namedItem('boardsPerPrintPage') as HTMLSelectElement).value;
    const boardsPerPrintPage = PRINT_LAYOUT_BY_COUNT[boardsPerPrintRaw]
      ? boardsPerPrintRaw
      : DEFAULT_BOARDS_PER_PRINT_PAGE;

    const printWInput = (form.elements.namedItem('printCardWidthMm') as HTMLInputElement).value;
    const printHInput = (form.elements.namedItem('printCardHeightMm') as HTMLInputElement).value;
    const printCardWidthMm = clampPrintCardWidthMm(
      printWInput.trim() === '' || !Number.isFinite(+printWInput)
        ? 46
        : +printWInput
    );
    const printCardHeightMm = normalizePrintCardHeightMm(
      printHInput.trim() === '' || !Number.isFinite(+printHInput) ? null : +printHInput
    );

    const finish = (header: string) => {
      if (!isSafeGeneration(songs, amount, height, width)) {
        alert(
          'Need at least width×height song lines, and enough combinations for unique boards (fewer boards or more songs).'
        );
        return;
      }

      const { cols } = getPrintGridLayout(boardsPerPrintPage);
      if (!printRowFitsApproxLandscape(cols, printCardWidthMm)) {
        window.alert(
          `With ${cols} columns, print width × ${cols} may be wider than a typical A4 landscape page (~${PRINTABLE_WIDTH_MM_APPROX} mm). Try a smaller print width or fewer boards per page.`
        );
      }

      const matrices = generateCombinations(width, height, songs, amount);
      if (!matrices) {
        alert('Could not generate enough unique boards in time. Try fewer boards or more songs.');
        return;
      }

      const temp = matrices.map((board) => board.map((row) => row.map((cell) => lines[cell])));
      this.props.setParentState({
        boards: temp,
        header,
        boardsPerPrintPage,
        printCardWidthMm,
        printCardHeightMm,
      });
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = () => finish(typeof reader.result === 'string' ? reader.result : headerUrl);
      reader.onerror = () => {
        alert('Could not read the image file. Try another file or use a header URL instead.');
      };
      reader.readAsDataURL(file);
    } else {
      finish(headerUrl);
    }
  }

  render() {
    return (
      <form className="mx-board-form" onSubmit={this.handleSubmit}>
        <div className="mx-board-form__group">
          <label className="mx-board-form__label mx-board-form__label--area" htmlFor="songs">
            Song list
          </label>
          <textarea
            id="songs"
            name="songs"
            className="mx-board-form__input mx-board-form__input--area"
          />
        </div>
        <div className="mx-board-form__group">
          <label className="mx-board-form__label" htmlFor="boards">
            How many boards (total)
          </label>
          <input
            className="mx-board-form__input"
            type="number"
            id="boards"
            name="boards"
            min={1}
            placeholder="e.g. 24"
          />
        </div>
        <div className="mx-board-form__group">
          <label className="mx-board-form__label" htmlFor="width">
            Song grid — cells across
          </label>
          <input className="mx-board-form__input" type="number" id="width" name="width" min={1} />
        </div>
        <div className="mx-board-form__group">
          <label className="mx-board-form__label" htmlFor="height">
            Song grid — cells down
          </label>
          <input className="mx-board-form__input" type="number" id="height" name="height" min={1} />
        </div>
        <div className="mx-board-form__group">
          <label className="mx-board-form__label" htmlFor="boardsPerPrintPage">
            Boards per printed page (layout)
          </label>
          <select
            className="mx-board-form__input"
            id="boardsPerPrintPage"
            name="boardsPerPrintPage"
            defaultValue={DEFAULT_BOARDS_PER_PRINT_PAGE}
          >
            <option value={1}>1 (1×1)</option>
            <option value={2}>2 (2×1)</option>
            <option value={4}>4 (2×2)</option>
            <option value={6}>6 (3×2)</option>
            <option value={9}>9 (3×3)</option>
            <option value={12}>12 (4×3)</option>
          </select>
        </div>
        <div className="mx-board-form__group">
          <label className="mx-board-form__label" htmlFor="printCardWidthMm">
            Print — each card width (mm)
          </label>
          <input
            className="mx-board-form__input"
            type="number"
            id="printCardWidthMm"
            name="printCardWidthMm"
            min={20}
            max={95}
            step={1}
            defaultValue={46}
            placeholder="46"
          />
          <span className="mx-board-form__hint">Used for PDF/print; typical A4 row fits about three 46 mm cards.</span>
        </div>
        <div className="mx-board-form__group">
          <label className="mx-board-form__label" htmlFor="printCardHeightMm">
            Print — each card height (mm, optional)
          </label>
          <input
            className="mx-board-form__input"
            type="number"
            id="printCardHeightMm"
            name="printCardHeightMm"
            min={25}
            max={200}
            step={1}
            placeholder="Leave empty = auto from song rows"
          />
          <span className="mx-board-form__hint">If set, content is clipped to this height. Leave empty to grow with the grid.</span>
        </div>
        <div className="mx-board-form__group">
          <label className="mx-board-form__label" htmlFor="headerUrl">
            Header image URL (optional)
          </label>
          <input
            className="mx-board-form__input"
            type="url"
            id="headerUrl"
            name="headerUrl"
            placeholder="https://…"
          />
        </div>
        <div className="mx-board-form__group">
          <label className="mx-board-form__label" htmlFor="headerFile">
            Or upload header image
          </label>
          <input
            className="mx-board-form__input mx-board-form__input--file"
            type="file"
            id="headerFile"
            name="headerFile"
            accept="image/*"
          />
        </div>
        <div className="mx-board-form__group">
          <input className="mx-board-form__sent" type="submit" value="Generate" />
        </div>
      </form>
    );
  }
}
