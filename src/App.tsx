import * as React from 'react';
import './styles.scss';
import { Board } from './Board';
import { InputForm } from './InputForm';

export type AppBoardsState = {
  boards: string[][][] | undefined;
  header: string;
  boardsPerPrintPage: number;
  printCardWidthMm: number;
  printCardHeightMm: number | null;
};

export default class App extends React.Component<{}, AppBoardsState> {
  constructor(props) {
    super(props);
    this.state = {
      boards: undefined,
      header: '',
      boardsPerPrintPage: 9,
      printCardWidthMm: 46,
      printCardHeightMm: null,
    };
  }

  render() {
    return (
      <div>
        {this.state.boards ? (
          <Board
            boards={this.state.boards}
            header={this.state.header}
            boardsPerPrintPage={this.state.boardsPerPrintPage}
            printCardWidthMm={this.state.printCardWidthMm}
            printCardHeightMm={this.state.printCardHeightMm}
          />
        ) : (
          <InputForm
            setParentState={(payload) => this.setState(payload)}
          />
        )}
      </div>
    );
  }
}
