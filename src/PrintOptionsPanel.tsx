import * as React from 'react';
import {
  FIXED_BOARDS_PER_PRINT_PAGE,
  FIXED_PRINT_CARD_HEIGHT_MM,
  FIXED_PRINT_CARD_WIDTH_MM,
  FIXED_PRINT_GRID_COLS,
  FIXED_PRINT_GRID_ROWS,
  FIXED_PRINT_HEADER_IMAGE_WIDTH_MM,
  FIXED_PRINT_HEADER_STRIP_HEIGHT_MM,
} from './constants/printLayout';

export type PrintOptionsPanelProps = {
  onBackToGenerator: () => void;
};

export class PrintOptionsPanel extends React.Component<PrintOptionsPanelProps> {
  render() {
    return (
      <div className="mx-print-opts" data-testid="print-options-panel">
        <div className="mx-print-opts__header">
          <h2 className="mx-print-opts__title">Print layout</h2>
          <button type="button" className="mx-print-opts__back" onClick={() => this.props.onBackToGenerator()}>
            Change songs &amp; settings
          </button>
        </div>
        <p className="mx-print-opts__intro">
          PDF and paper print use this fixed layout (not editable here).
        </p>
        <dl className="mx-print-opts__fixed" aria-label="Fixed print dimensions">
          <div className="mx-print-opts__fixed-row">
            <dt>Boards per sheet</dt>
            <dd>{FIXED_BOARDS_PER_PRINT_PAGE}</dd>
          </div>
          <div className="mx-print-opts__fixed-row">
            <dt>Columns × rows</dt>
            <dd>
              {FIXED_PRINT_GRID_COLS} × {FIXED_PRINT_GRID_ROWS}
            </dd>
          </div>
          <div className="mx-print-opts__fixed-row">
            <dt>Each card width</dt>
            <dd>{FIXED_PRINT_CARD_WIDTH_MM} mm</dd>
          </div>
          <div className="mx-print-opts__fixed-row">
            <dt>Each card height</dt>
            <dd>{FIXED_PRINT_CARD_HEIGHT_MM} mm</dd>
          </div>
          <div className="mx-print-opts__fixed-row">
            <dt>Header image (print)</dt>
            <dd>
              {FIXED_PRINT_HEADER_IMAGE_WIDTH_MM} mm × {FIXED_PRINT_HEADER_STRIP_HEIGHT_MM} mm
            </dd>
          </div>
        </dl>
      </div>
    );
  }
}
