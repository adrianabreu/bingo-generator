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

export type PrintOptionsPanelProps = {
  boardsPerPrintPage: number;
  printCardWidthMm: number;
  printCardHeightMm: number | null;
  onBoardsPerPrintPage: (value: number) => void;
  onPrintCardWidthMm: (value: number) => void;
  onPrintCardHeightMm: (value: number | null) => void;
  onBackToGenerator: () => void;
};

export class PrintOptionsPanel extends React.Component<PrintOptionsPanelProps> {
  render() {
    const { cols } = getPrintGridLayout(this.props.boardsPerPrintPage);
    const widthOk = printRowFitsApproxLandscape(cols, this.props.printCardWidthMm);

    return (
      <div className="mx-print-opts" data-testid="print-options-panel">
        <div className="mx-print-opts__header">
          <h2 className="mx-print-opts__title">Print layout</h2>
          <button type="button" className="mx-print-opts__back" onClick={() => this.props.onBackToGenerator()}>
            Change songs &amp; settings
          </button>
        </div>
        <p className="mx-print-opts__intro">
          Adjust how boards are arranged for PDF or paper print. These settings apply immediately below.
        </p>
        <div className="mx-print-opts__grid">
          <div className="mx-print-opts__group">
            <label className="mx-print-opts__label" htmlFor="viewBoardsPerPrintPage">
              Boards per printed page
            </label>
            <select
              className="mx-print-opts__input"
              id="viewBoardsPerPrintPage"
              value={this.props.boardsPerPrintPage}
              onChange={(e) => {
                const v = +e.target.value;
                this.props.onBoardsPerPrintPage(
                  PRINT_LAYOUT_BY_COUNT[v] ? v : DEFAULT_BOARDS_PER_PRINT_PAGE
                );
              }}
            >
              <option value={1}>1 (1×1)</option>
              <option value={2}>2 (2×1)</option>
              <option value={4}>4 (2×2)</option>
              <option value={6}>6 (3×2)</option>
              <option value={9}>9 (3×3)</option>
              <option value={12}>12 (4×3)</option>
            </select>
          </div>
          <div className="mx-print-opts__group">
            <label className="mx-print-opts__label" htmlFor="viewPrintCardWidthMm">
              Each card width (mm)
            </label>
            <input
              className="mx-print-opts__input"
              type="number"
              id="viewPrintCardWidthMm"
              min={20}
              max={95}
              step={1}
              value={this.props.printCardWidthMm}
              onChange={(e) => {
                const n = +e.target.value;
                if (!Number.isFinite(n)) return;
                this.props.onPrintCardWidthMm(clampPrintCardWidthMm(n));
              }}
            />
            {!widthOk && (
              <span className="mx-print-opts__warn">
                With {cols} columns this may be wider than a typical A4 landscape page (~
                {PRINTABLE_WIDTH_MM_APPROX} mm).
              </span>
            )}
          </div>
          <div className="mx-print-opts__group">
            <label className="mx-print-opts__label" htmlFor="viewPrintCardHeightMm">
              Each card height (mm)
            </label>
            <input
              className="mx-print-opts__input"
              type="number"
              id="viewPrintCardHeightMm"
              min={25}
              max={200}
              step={1}
              placeholder="Auto"
              value={this.props.printCardHeightMm ?? ''}
              onChange={(e) => {
                const raw = e.target.value.trim();
                if (raw === '') {
                  this.props.onPrintCardHeightMm(null);
                  return;
                }
                const n = +raw;
                this.props.onPrintCardHeightMm(normalizePrintCardHeightMm(Number.isFinite(n) ? n : null));
              }}
            />
            <span className="mx-print-opts__hint">Leave empty for height from song rows.</span>
          </div>
        </div>
      </div>
    );
  }
}
