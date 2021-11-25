import {Component} from 'react';
import { Route } from 'react-router';

export default class CreateGameDialog extends Component {
  constructor(props) {
    super(props);

    this.onClickCreateGame = this.onClickCreateGame.bind(this);
  }

  onClickCreateGame() {
    createNewGame().then(gameId => {
      Route(`/${gameId}`);
    });
  }

  render() {
    return (
      <div className='create-game-dialog'>
        <h3>Create New Game</h3>
        <div>
          <p>Name</p>
          <input type='text' />
        </div>
        <button onClick={this.onClickCreateGame}>Create Game</button>
      </div>
    );
  }
};
