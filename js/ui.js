import { GameState, Player } from "./game.js";
import { MCTSAgent } from "./mcts-agent.js";
// Global GameState -> current state of user interface 
let currentGame = new GameState();
let mctsAgent = new MCTSAgent(30); // 30 Iterations to start 
let gameMode = 'Player vs AI';
let isAIThinking = false;
function initializeUI() {
    createGameBoard();
    setupGameModeSelector();
    setupDifficultySelector();
    toggleDifficultySelector();
    updateDisplay();
}
function createGameBoard() {
    const boardElement = document.getElementById('gameBoard');
    if (!boardElement)
        return; // Early return
    boardElement.innerHTML = ''; // Clear the existing content 
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('button');
        cell.className = 'cell';
        cell.id = `cell-${i}`;
        cell.onclick = () => handleCellClick(i);
        boardElement.appendChild(cell);
    }
}
// Updated function to work with existing HTML mode selector
function setupGameModeSelector() {
    const modeInputs = document.querySelectorAll('input[name="gameMode"]');
    modeInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const target = e.target;
            gameMode = target.value;
            // Debug optins 
            console.log('Game mode changed to:', gameMode);
            // Show/hide difficulty selector based on game mode 
            toggleDifficultySelector();
            // Start a fresh game
            resetGame();
        });
    });
}
// Function to step diffilculty selector
function setupDifficultySelector() {
    const difficultyInputs = document.querySelectorAll('input[name="difficulty"]');
    // for changes of difficulty 
    difficultyInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            // obtain the chosen difficulty level
            const target = e.target;
            const difficulty = target.value;
            // set the difficulty 
            mctsAgent.setDifficulty(difficulty);
            // console log for debugging
            console.log('Difficulty changed to:', difficulty);
            // reset the game when difficulty changes 
            resetGame();
        });
    });
    // Initial difficulty -> medium 
    mctsAgent.setDifficulty('medium');
}
// function to hide the difficulty selector based on game mode 
function toggleDifficultySelector() {
    // Find difficulty selector element 
    const difficultySelector = document.getElementById('difficultySelector');
    // Exit if element doesnt exist 
    if (!difficultySelector)
        return;
    // Show difficulty if in AI mode 
    if (gameMode === 'Player vs AI') {
        difficultySelector.style.display = 'block';
        difficultySelector.style.opacity = '1';
        difficultySelector.classList.remove('hidden');
    }
    else {
        difficultySelector.style.display = 'none'; // Hide it 
        difficultySelector.style.opacity = '0';
        difficultySelector.classList.add('hidden');
    }
}
// Function to handle user clicks board squares
async function handleCellClick(position) {
    // Prevents clicking while AI is thinking 
    if (isAIThinking)
        return;
    // In AI mode, only allow human moves (X)
    if (gameMode === 'Player vs AI' && currentGame.getCurrentPlayer() === Player.O) {
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
            showSimpleMessage('Position already occupied, please choose an empty cell.');
        }
        else if (errorMessage.includes('ended')) {
            showSimpleMessage('The game has ended!, Please start a new game.');
        }
        else {
            showSimpleMessage(`Invalid move: ${errorMessage}`);
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
        showSimpleMessage('AI encountered an error. Please restart the game.');
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
            cell.disabled = cellValue !== Player.EMPTY ||
                currentGame.getGameResult() !== 'ongoing' ||
                isAIThinking ||
                (gameMode === 'Player vs AI' && currentGame.getCurrentPlayer() === Player.O);
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
        if (isAIThinking) {
            infoElement.textContent = 'AI is thinkin...';
            infoElement.style.color = '#f39c12';
        }
        else if (gameStatus === 'ongoing') {
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
    const notification = document.getElementById('gameNotification');
    const message = document.getElementById('notificationMessage');
    if (!notification || !message)
        return;
    let messageText = '';
    let notificationText = '';
    if (result === 'draw') {
        messageText = "It's a draw";
        notificationText = 'draw';
    }
    else if (gameMode === 'Player vs AI') {
        if (result === 'X') {
            messageText = 'Well done! You beat the AI';
            notificationText = 'winnner-x';
        }
        else {
            messageText = 'AI won this time, Try again?';
            notificationText = 'winnner-o';
        }
        // PVP mode
    }
    else {
        messageText = `Player ${result} wins! 🎉`;
        notificationText = result === 'X' ? 'winner-x' : 'winner-o';
    }
    message.textContent = messageText;
    notification.className = `notification ${notificationText}`;
    notification.style.display = 'block';
}
;
function showSimpleMessage(text) {
    const notification = document.getElementById('gameNotification');
    const message = document.getElementById('notificationMesage');
    const playAgainButton = document.getElementById('playAgainButton');
    if (!notification || !message)
        return;
    message.textContent = text;
    notification.className = 'notifcation';
    playAgainButton.style.display = 'none';
    notification.style.display = 'block';
    // Auto-hide notifications after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
        playAgainButton.style.display = 'block';
    }, 3000);
}
// Reset the game to initial state 
function resetGame() {
    currentGame = new GameState();
    isAIThinking = false;
    // Hide notifications 
    const notification = document.getElementById('gameNotification');
    if (notification) {
        notification.style.display = 'none';
    }
    updateDisplay();
}
// Can functions availiable globally 
window.resetGame = resetGame;
// Initialize the UI when page loads 
document.addEventListener('DOMContentLoaded', initializeUI);
