import { Player } from "./game.js";
export class MCTSNode {
    constructor(gameState, parent = null, currentPlayer = Player.O, currentMove = -1) {
        this.gameState = gameState;
        this.parent = parent;
        this.children = [];
        this.visits = 0;
        this.wins = 0;
        this.unvisitedMoves = gameState.getValidMoves();
        this.currentPlayer = currentPlayer;
        this.currentMove = currentMove;
    }
    // UCB1 formula to select next node to explore 
    calculateUCB1(explorationparameter = Math.sqrt(2)) {
        // Prioritise unexplored nodes, set to infinity to ensure it gets selected first
        if (this.visits === 0)
            return Number.POSITIVE_INFINITY;
        // winrate calculation
        const exploitation = this.wins / this.visits;
        // ! -> guarantee that this.parent is not null
        const exploration = explorationparameter * Math.sqrt(Math.log(this.parent.visits) / this.visits);
        return exploitation + exploration;
    }
    // Method used to select child with highest UCB1 
    selectBestChild(explorationparameter = Math.sqrt(2)) {
        return this.children.reduce((best, child) => {
            return child.calculateUCB1(explorationparameter) > best.calculateUCB1(explorationparameter) ? child : best;
        });
    }
    // Method used for adding a new child to expand unvisited moves 
    addChild(move) {
        const newGameState = this.gameState.makeMove(move);
        const newNode = new MCTSNode(newGameState, this, this.gameState.getCurrentPlayer(), move);
        // Remove the move from unvisited nodes 
        this.unvisitedMoves = this.unvisitedMoves.filter(m => m !== move);
        this.children.push(newNode);
        return newNode;
    }
    // Update node with results
    update(result) {
        this.visits++;
        // Award win based on the current player 
        if (result === this.currentPlayer) {
            this.wins++;
            // Award half a point for draws
        }
        else if (result === 'draw') {
            this.wins += 0.5;
        }
    }
    // Check if node can be expanded 
    canExpand() {
        return this.unvisitedMoves.length > 0 && this.gameState.getGameResult() === 'ongoing';
    }
    //  Check if its ending node (game over)
    gameIsOver() {
        return this.gameState.getGameResult() !== 'ongoing';
    }
}
