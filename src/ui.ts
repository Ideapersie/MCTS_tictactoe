import { GameState, Player } from "./game.js";

// Global GameState -> current state of user interface 
let currentGame = new GameState();

function initializeUI(): void{
        createGameBoard();
        updateDisplay();
}

function createGameBoard(): void{
    const boardElement = document.getElementById('gameBoard');
    if(!boardElement) return ; //Early return

    boardElement.innerHTML = ''; // Clear the existing content 

    for (let i=0; i<9;i++){
        const cell = document.createElement('button');

        cell.className ='cell';
        cell.id = `cell-${i}`;
        cell.onclick = () => handleCellClick(i);
        boardElement.appendChild(cell);
    }
}

// Function to handle user clicks board squares
function handleCellClick(position: number): void{
    try{
        currentGame = currentGame.makeMove(position);
        updateDisplay();

        //check if game has ended 
        const result = currentGame.getGameResult();

        if (result !== 'ongoing'){
            setTimeout(() => {
                let message = '';
                if (result === 'draw') {
                    message = "It's a draw"
                } else {
                    message = `Player ${result} wins! 🎉`;
                }

                if (confirm(`${message}\n\n Would you like to play again?`)) {
                    resetGame();
                }
            }, 100);
        }
    } catch (error) {
        // Display error-specific messages
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        if (errorMessage.includes('occupied')) {
            alert('Position already occupied, please choose an empty cell.');
        } else if (errorMessage.includes('ended')) {
            alert('The game has ended!, Please start a new game.');
        } else {
            alert(`Invalid move: ${errorMessage}`);
        }
    }
}

// Update visual display to match the game state 
function updateDisplay(): void{
    // Update each cell 
    for (let i = 0; i < 9; i++){
        const cell = document.getElementById(`cell-${i}`) as HTMLButtonElement;
        if (cell) {
            const cellValue = currentGame.getPosition(i);
            cell.textContent = cellValue === Player.EMPTY ? '' : cellValue;
            cell.disabled = cellValue !== Player.EMPTY || currentGame.getGameResult() !== 'ongoing';

            // Add visual styling for X vs O 
            if (cellValue === Player.X) {
                cell.style.color = '#1eb88d'; // Turquiose for Player X
            } else if (cellValue === Player.O) {
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
        } else {
            infoElement.textContent = `Game Over - ${gameStatus === 'draw' ? 'Draw!' : `${gameStatus} Wins!`}`;
            infoElement.style.color = gameStatus === 'X' ? '#1eb88d' : '#f39738';
            infoElement.style.fontSize = '1.2em' // making it more visible to the user
            infoElement.style.fontWeight = 'bold'
        }
    }
}

// Reset the game to initial state 
function resetGame(): void {
    currentGame = new GameState();
    updateDisplay();
}

// Can functions availiable globally 
(window as any).resetGame = resetGame;

// Initialize the UI when page loads 
document.addEventListener('DOMContentLoaded', initializeUI);