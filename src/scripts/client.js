import { createGame, awardPoint, undoPoint, resetGame, resetAll, setPlayerName } from './gameState';

function init() {
  const state = createGame();

  const playersContainer = document.getElementById('playersContainer');
  const gameMessage = document.getElementById('gameMessage');
  const matchHistoryContainer = document.getElementById('matchHistoryContainer');

  function render() {
    const cards = playersContainer.querySelectorAll('.player-card');
    const inputs = playersContainer.querySelectorAll('.player-name');
    const scores = playersContainer.querySelectorAll('.score-number');
    const serves = playersContainer.querySelectorAll('.serve-indicator');
    const pointBtns = playersContainer.querySelectorAll('.btn-point');

    state.players.forEach((p, i) => {
      const card = cards[i];
      const nameInput = inputs[i];
      const scoreEl = scores[i];
      const serveEl = serves[i];
      const btn = pointBtns[i];

      card.dataset.active = i === state.currentPlayer && !state.gameOver;
      card.dataset.winner = state.gameOver && state.winner === i;

      nameInput.value = p.name;

      scoreEl.textContent = p.score;

      serveEl.dataset.active = i === state.currentPlayer && !state.gameOver;
      serveEl.textContent = state.gameOver
        ? (state.winner === i ? 'GANADOR' : '')
        : (i === state.currentPlayer ? 'SACA' : '');

      btn.disabled = state.gameOver;
    });

    if (state.gameOver) {
      const winnerName = state.players[state.winner].name;
      gameMessage.textContent = `${winnerName} ha ganado el juego!`;
      gameMessage.className = 'game-message visible winner';
    } else {
      const activeName = state.players[state.currentPlayer].name;
      gameMessage.textContent = `Turno de ${activeName}`;
      gameMessage.className = 'game-message visible';
    }

    renderMatchHistory();
  }

  function renderMatchHistory() {
    const p0 = state.players[0], p1 = state.players[1];
    matchHistoryContainer.innerHTML = `
      <div class="match-history">
        <span class="match-label">Sets</span>
        <div class="match-scores">
          <span class="match-name">${p0.name}</span>
          <span class="match-value" data-winner="${p0.sets > p1.sets}">${p0.sets}</span>
          <span class="match-separator">-</span>
          <span class="match-value" data-winner="${p1.sets > p0.sets}">${p1.sets}</span>
          <span class="match-name">${p1.name}</span>
        </div>
      </div>
    `;
  }

  playersContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-point');
    if (!btn) return;
    const playerIdx = parseInt(btn.dataset.player);
    awardPoint(state, playerIdx);
    render();
  });

  playersContainer.addEventListener('input', (e) => {
    const input = e.target.closest('.player-name');
    if (!input) return;
    const playerIdx = parseInt(input.dataset.player);
    setPlayerName(state, playerIdx, input.value);
    renderMatchHistory();
    if (!state.gameOver) {
      const activeName = state.players[state.currentPlayer].name;
      gameMessage.textContent = `Turno de ${activeName}`;
    } else {
      const winnerName = state.players[state.winner].name;
      gameMessage.textContent = `${winnerName} ha ganado el juego!`;
    }
  });

  document.getElementById('undoBtn').addEventListener('click', () => {
    undoPoint(state);
    render();
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    resetGame(state);
    render();
  });

  document.getElementById('resetAllBtn').addEventListener('click', () => {
    resetAll(state);
    render();
  });

  render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
