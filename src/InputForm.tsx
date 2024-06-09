import {
    generateCombinations,
    transformToDrawableMatrix,
    isSafeGeneration,
  } from './core/BingoGenerator';
  import * as React from 'react';
  
  let width = 4;
  let height = 4;
  
  export class InputForm extends React.Component<any, { value: string }> {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleSubmit(event) {
      event.preventDefault();
  
      let lines = event.target.elements[0].value.split('\n');
      let songs = lines.length;
      let amount = +event.target.elements[1].value;
  
      if (isSafeGeneration(songs, amount)) {
        let temp = transformToDrawableMatrix(
          generateCombinations(width, height, songs, amount)
        ).map((board) => board.map((row) => row.map((cell) => lines[cell])));
  
        this.props.setParentState(temp);
      } else {
        alert('Preventing loop. You need either more lines or less cartons');
      }
    }
  
    render() {
      return (
        <form className="mx-board-form" onSubmit={this.handleSubmit}>
          <div className="mx-board-form__group">
            <label className="mx-board-form__label">Lista de canciones:</label>
            <textarea className="mx-board-form__input mx-board-form__input--area" />
          </div>
          <div className="mx-board-form__group">
            <label className="mx-board-form__label">Cartones:</label>
            <input className="mx-board-form__input" type="number" id="boards" />
          </div>
          <div className="mx-board-form__group">
            <input
              className="mx-board-form__sent"
              type="submit"
              value="Generar"
            />
          </div>
        </form>
      );
    }
  }
  