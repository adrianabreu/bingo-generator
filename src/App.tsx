import * as React from 'react';
import './styles.scss';
import { Board } from './Board';
import { InputForm } from './InputForm';

export default class App extends React.Component<{}, { boards: string[][][], header: string }> {
  constructor(props) {
    super(props);
    this.state = { boards: undefined, header: "" };
  }

  render() {
    return (
      <div>
        {this.state.boards ? (
          <Board boards={this.state.boards} header={this.state.header}></Board>
        ) : (
          <InputForm
            setParentState={(b: string[][][], h: string) => this.setState({ boards: b, header: h})}
          >
            {' '}
          </InputForm>
        )}
      </div>
    );
  }
}
