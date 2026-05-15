import * as React from 'react';
import './styles.scss';
import { Board } from './Board';
import { InputForm } from './InputForm';
import { PrintOptionsPanel } from './PrintOptionsPanel';

export type AppBoardsState = {
  boards: string[][][] | undefined;
  header: string;
};

export default class App extends React.Component<{}, AppBoardsState> {
  constructor(props) {
    super(props);
    this.state = {
      boards: undefined,
      header: '',
    };
  }

  render() {
    return (
      <div>
        {this.state.boards ? (
          <>
            <PrintOptionsPanel onBackToGenerator={() => this.setState({ boards: undefined })} />
            <Board boards={this.state.boards} header={this.state.header} />
          </>
        ) : (
          <InputForm setParentState={(payload) => this.setState(payload)} />
        )}
      </div>
    );
  }
}
