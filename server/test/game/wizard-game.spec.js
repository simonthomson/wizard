import WizardGame from '../../src/game/wizard-game';

describe('WizardGame', () => {

  it('creates a new game', () => {
    let players = ['player-id-1', 'player-id-2'];

    let game = new WizardGame(players);

    expect(game).toBeTruthy();
  });
});
