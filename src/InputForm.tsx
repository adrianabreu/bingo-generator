import { generateCombinations, isSafeGeneration } from './core/BingoGenerator';
import * as React from 'react';
import {
  FIXED_BOARDS_PER_PRINT_PAGE,
  FIXED_PRINT_CARD_HEIGHT_MM,
  FIXED_PRINT_CARD_WIDTH_MM,
  FIXED_PRINT_GRID_COLS,
  FIXED_PRINT_GRID_ROWS,
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
      this.props.setParentState({
        boards: temp,
        header,
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
        <div className="mx-board-form__group mx-board-form__group--fixed-print">
          <span className="mx-board-form__label">Print / PDF layout (fixed)</span>
          <dl className="mx-board-form__fixed-print" aria-label="Fixed print dimensions">
            <div className="mx-board-form__fixed-print-row">
              <dt>Boards per sheet</dt>
              <dd>{FIXED_BOARDS_PER_PRINT_PAGE}</dd>
            </div>
            <div className="mx-board-form__fixed-print-row">
              <dt>Columns × rows</dt>
              <dd>
                {FIXED_PRINT_GRID_COLS} × {FIXED_PRINT_GRID_ROWS}
              </dd>
            </div>
            <div className="mx-board-form__fixed-print-row">
              <dt>Each card width</dt>
              <dd>{FIXED_PRINT_CARD_WIDTH_MM} mm</dd>
            </div>
            <div className="mx-board-form__fixed-print-row">
              <dt>Each card height</dt>
              <dd>{FIXED_PRINT_CARD_HEIGHT_MM} mm</dd>
            </div>
          </dl>
          <span className="mx-board-form__hint">
            Nine cards per sheet use a 3×3 grid (three columns and three rows).
          </span>
        </div>
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
