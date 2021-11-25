import { Component } from 'react';
import './numerical-game-setting.css'

export default class NumericalGameSetting extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='numerical-game-setting'>
        <p>{this.props.displayName}</p>
        <input type='number'></input>
      </div>
    );
  }
};

