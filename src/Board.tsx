import * as React from 'react';

export class Board extends React.Component<{ boards: string[][][], header: string}, {}> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="mx-bingo">
        {this.props.boards.map((board) => {
          return (
            <div className="mx-bingo-board">
              <div className="mx-bingo-board_row--header">
                <img src={this.props.header} />
              </div>
              {board.map((row) => {
                return (
                  <div className="mx-bingo-board_row">
                    {row.map((cell) => (
                      <div className="mx-bingo-board_cell">{cell}</div>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}
