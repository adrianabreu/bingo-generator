import * as React from 'react';
import './styles.scss';
import { Board } from './Board';
import { InputForm } from './InputForm';

export default class App extends React.Component<{}, { boards: string[][][] }> {
  constructor(props) {
    super(props);
    this.state = { boards: undefined };
  }

  render() {
    return (
      <div>
        {this.state.boards ? (
          <Board boards={this.state.boards}></Board>
        ) : (
          <InputForm
            setParentState={(b: string[][][]) => this.setState({ boards: b })}
          >
            {' '}
          </InputForm>
        )}
      </div>
    );
  }
}
