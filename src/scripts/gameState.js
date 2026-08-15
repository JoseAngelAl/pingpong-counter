export function createGame() {
  return {
    players: [
      { name: 'Jugador 1', score: 0, sets: 0 },
      { name: 'Jugador 2', score: 0, sets: 0 },
    ],
    currentPlayer: 0,
    history: [],
    gameOver: false,
    winner: null,
  };
}

export function awardPoint(state, playerIndex) {
  if (state.gameOver) return null;

  const prev = {
    playerIndex,
    prevScore: state.players[playerIndex].score,
    prevTurn: state.currentPlayer,
  };

  state.players[playerIndex].score++;
  state.history.push(prev);

  if (checkWin(state, playerIndex)) {
    state.gameOver = true;
    state.winner = playerIndex;
    state.players[playerIndex].sets++;
  } else {
    // Cambiar turno de saque cada 2 puntos acumulados
    const totalPoints = state.players[0].score + state.players[1].score;
    if (totalPoints % 2 === 0) {
      state.currentPlayer = state.currentPlayer === 0 ? 1 : 0;
    }
  }

  return state;
}

export function undoPoint(state) {
  if (state.history.length === 0) return null;

  state.gameOver = false;
  state.winner = null;

  const last = state.history.pop();
  state.players[last.playerIndex].score = last.prevScore;
  state.currentPlayer = last.prevTurn;

  return state;
}

export function resetGame(state) {
  state.players.forEach(p => { p.score = 0; });
  state.currentPlayer = 0;
  state.history = [];
  state.gameOver = false;
  state.winner = null;
  return state;
}

export function resetAll(state) {
  state.players.forEach(p => { p.score = 0; p.sets = 0; });
  state.currentPlayer = 0;
  state.history = [];
  state.gameOver = false;
  state.winner = null;
  return state;
}

export function setPlayerName(state, playerIndex, name) {
  state.players[playerIndex].name = name.trim() || `Jugador ${playerIndex + 1}`;
}

function checkWin(state, playerIndex) {
  const score = state.players[playerIndex].score;
  const otherScore = state.players[playerIndex === 0 ? 1 : 0].score;
  return score >= 11 && (score - otherScore) >= 2;
}
