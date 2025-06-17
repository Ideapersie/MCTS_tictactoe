import { GameState, Player } from "./game.js";
import { MCTSAgent } from "./mcts-agent.js";
// Global GameState -> current state of user interface 
let currentGame = new GameState();
let mctsAgent = new MCTSAgent(750); // 750 Iterations to start 
let gameMode = 'Player vs AI';
let isAIThinking = false;
function initializeUI() {
    createGameBoard();
    createGameModeSelector();
    updateDisplay();
}
function createGameBoard() {
    const boardElement = document.getElementById('gameBoard');
    if (!boardElement)
        return; //Early return
    boardElement.innerHTML = ''; // Clear the existing content 
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('button');
        cell.className = 'cell';
        cell.id = `cell-${i}`;
        cell.onclick = () => handleCellClick(i);
        boardElement.appendChild(cell);
    }
}
function createGameModeSelector() {
    const controlsElement = document.querySelector('.controls');
    if (!controlsElement)
        return;
    // Create mode selector
    const modeSelector = document.createElement('div');
    modeSelector.className = 'mode-selector';
    modeSelector.innerHTML = `
        <label>
            <input type="radio" name="gameMode" value="Player VS AI" checked>
            Player VS AI
        </label>
        <label>
            <input type="radio" name="gameMode" value="PVP
            Player VS Player
        </label>
    `;
    modeSelector.addEventListener('change', (e) => {
        const target = e.target;
        gameMode = target.value;
        resetGame();
    });
    // Insert it before existing controls 
    controlsElement.insertBefore(modeSelector, controlsElement.firstChild);
}
// Function to handle user clicks board squares
async function handleCellClick(position) {
    // Prevents clicking while AI is thinking 
    if (isAIThinking)
        return;
    // In AI mode, only allow human moves (X)
    if (gameMode === 'PVP' && currentGame.getCurrentPlayer() === Player.O) {
        return;
    }
    try {
        currentGame = currentGame.makeMove(position);
        updateDisplay();
        //check if game has ended 
        const result = currentGame.getGameResult();
        if (result !== 'ongoing') {
            handleGameEnd();
            return;
        }
        if (gameMode === 'Player vs AI' && currentGame.getCurrentPlayer() === Player.O) {
            await makeAIMove();
        }
    }
    catch (error) {
        // Display error-specific messages
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        if (errorMessage.includes('occupied')) {
            alert('Position already occupied, please choose an empty cell.');
        }
        else if (errorMessage.includes('ended')) {
            alert('The game has ended!, Please start a new game.');
        }
        else {
            alert(`Invalid move: ${errorMessage}`);
        }
    }
}
async function makeAIMove() {
    isAIThinking = true;
    updateDisplay(); // Show AI message
    try {
        const aiMove = mctsAgent.selectMove(currentGame);
        currentGame = currentGame.makeMove(aiMove);
        isAIThinking = false;
        updateDisplay();
        if (currentGame.getGameResult() !== 'ongoing') {
            handleGameEnd();
        }
    }
    catch (error) {
        isAIThinking = false;
        console.error('AI move failed:', error);
        alert('AI encountered an error. Please restart the game.');
    }
}
// Update visual display to match the game state 
function updateDisplay() {
    // Update each cell 
    for (let i = 0; i < 9; i++) {
        const cell = document.getElementById(`cell-${i}`);
        if (cell) {
            const cellValue = currentGame.getPosition(i);
            cell.textContent = cellValue === Player.EMPTY ? '' : cellValue;
            cell.disabled = cellValue !== Player.EMPTY || currentGame.getGameResult() !== 'ongoing';
            // Add visual styling for X vs O 
            if (cellValue === Player.X) {
                cell.style.color = '#1eb88d'; // Turquiose for Player X
            }
            else if (cellValue === Player.O) {
                cell.style.color = '#f39738'; // Orange for Player O
            }
        }
    }
    // Update game information
    const infoElement = document.getElementById('gameInfo');
    if (infoElement) {
        const currentPlayer = currentGame.getCurrentPlayer();
        const gameStatus = currentGame.getGameResult();
        if (gameStatus === 'ongoing') {
            infoElement.textContent = `Current Player: ${currentPlayer}`;
            infoElement.style.color = currentPlayer === Player.X ? '#1eb88d' : '#f39738';
        }
        else {
            infoElement.textContent = `Game Over - ${gameStatus === 'draw' ? 'Draw!' : `${gameStatus} Wins!`}`;
            infoElement.style.color = gameStatus === 'X' ? '#1eb88d' : '#f39738';
            infoElement.style.fontSize = '1.2em'; // making it more visible to the user
            infoElement.style.fontWeight = 'bold';
        }
    }
}
function handleGameEnd() {
    const result = currentGame.getGameResult();
    setTimeout(() => {
        let message = '';
        if (result === 'draw') {
            message = "It's a draw";
        }
        else if (gameMode === 'Player vs AI') {
            message = result === 'X' ? 'Well done! You beat the AI' : 'AI won this time, Try again?';
        }
        else {
            message = `Player ${result} wins! 🎉`;
        }
        if (confirm(`${message}\n\n Would you like to play again?`)) {
            resetGame();
        }
    }, 100);
}
// Reset the game to initial state 
function resetGame() {
    currentGame = new GameState();
    updateDisplay();
}
// Can functions availiable globally 
window.resetGame = resetGame;
// Initialize the UI when page loads 
document.addEventListener('DOMContentLoaded', initializeUI);
