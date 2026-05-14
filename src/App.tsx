import * as React from 'react';
import './styles.scss';
import { Board } from './Board';
import { InputForm } from './InputForm';

export default class App extends React.Component<
  {},
  { boards: string[][][] | undefined; header: string; boardsPerPrintPage: number }
> {
  constructor(props) {
    super(props);
    this.state = { boards: undefined, header: '', boardsPerPrintPage: 9 };
  }

  render() {
    return (
      <div>
        {this.state.boards ? (
          <Board
            boards={this.state.boards}
            header={this.state.header}
            boardsPerPrintPage={this.state.boardsPerPrintPage}
          />
        ) : (
          <InputForm
            setParentState={(b: string[][][], h: string, perPrint: number) =>
              this.setState({ boards: b, header: h, boardsPerPrintPage: perPrint })
            }
          />
        )}
      </div>
    );
  }
}
