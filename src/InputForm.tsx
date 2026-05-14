import { generateCombinations, isSafeGeneration } from './core/BingoGenerator';
import * as React from 'react';
import { DEFAULT_BOARDS_PER_PRINT_PAGE, PRINT_LAYOUT_BY_COUNT } from './constants/printLayout';

type Props = {
  setParentState: (boards: string[][][], header: string, boardsPerPrintPage: number) => void;
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

    const finish = (header: string) => {
      if (!isSafeGeneration(songs, amount, height, width)) {
        alert(
          'Need at least width×height song lines, and enough combinations for unique boards (fewer boards or more songs).'
        );
        return;
      }

      const matrices = generateCombinations(width, height, songs, amount);
      if (!matrices) {
        alert('Could not generate enough unique boards in time. Try fewer boards or more songs.');
        return;
      }

      const temp = matrices.map((board) => board.map((row) => row.map((cell) => lines[cell])));
      this.props.setParentState(temp, header, boardsPerPrintPage);
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
            Boards
          </label>
          <input className="mx-board-form__input" type="number" id="boards" name="boards" />
        </div>
        <div className="mx-board-form__group">
          <label className="mx-board-form__label" htmlFor="width">
            Width
          </label>
          <input className="mx-board-form__input" type="number" id="width" name="width" />
        </div>
        <div className="mx-board-form__group">
          <label className="mx-board-form__label" htmlFor="height">
            Height
          </label>
          <input className="mx-board-form__input" type="number" id="height" name="height" />
        </div>
        <div className="mx-board-form__group">
          <label className="mx-board-form__label" htmlFor="boardsPerPrintPage">
            Boards per printed page
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
