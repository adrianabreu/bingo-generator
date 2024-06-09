import {
    generateCombinations,
    transformToDrawableMatrix,
    isSafeGeneration,
  } from './core/BingoGenerator';
  import * as React from 'react';
  
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
      let width = +event.target.elements[2].value;
      let height = +event.target.elements[3].value;
      let header = event.target.elements.value;

      if (isSafeGeneration(songs, amount, height, width)) {
        let temp = transformToDrawableMatrix(
          generateCombinations(width, height, songs, amount),
          width,
          height
        ).map((board) => board.map((row) => row.map((cell) => lines[cell])));
  
        this.props.setParentState(temp, header);
      } else {
        alert('Preventing loop. You need either more lines or less cartons');
      }
    }
  
    render() {
      return (
        <form className="mx-board-form" onSubmit={this.handleSubmit}>
          <div className="mx-board-form__group">
            <label className="mx-board-form__label mx-board-form__label--area">Song list</label>
            <textarea className="mx-board-form__input mx-board-form__input--area" />
          </div>
          <div className="mx-board-form__group">
            <label className="mx-board-form__label">Boards</label>
            <input className="mx-board-form__input" type="number" id="boards" />
          </div>
          <div className="mx-board-form__group">
            <label className="mx-board-form__label">Width</label>
            <input className="mx-board-form__input" type="number" id="width" />
          </div>
          <div className="mx-board-form__group">
            <label className="mx-board-form__label">Height</label>
            <input className="mx-board-form__input" type="number" id="height" />
          </div>
          <div className="mx-board-form__group">
            <label className="mx-board-form__label">Header URL</label>
            <input className="mx-board-form__input" type="text" id="header" />
          </div>
          <div className="mx-board-form__group">
            <input
              className="mx-board-form__sent"
              type="submit"
              value="Generate"
            />
          </div>
        </form>
      );
    }
  }
  