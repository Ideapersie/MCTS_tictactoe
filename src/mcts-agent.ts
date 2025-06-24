import { GameState, Player, getOppositePlayer } from "./game.js";
import { MCTSNode } from "./mcts-node.js";

export class MCTSAgent {
    private iterationsPerMove: number;
    private explorationParameter: number; 

    constructor(iterationsPerGame: number = 500, explorationParameter: number = Math.sqrt(2)) {
        this.iterationsPerMove = iterationsPerGame;
        this.explorationParameter = explorationParameter;
    }

    // Main method -> returns the best move for current player 
    selectMove(gameState: GameState): number {
        // Create root node for current game state 
        const rootNode = new MCTSNode(gameState, null, getOppositePlayer(gameState.getCurrentPlayer()));

        // Run MCTS iterations 
        for (let i=0; i < this.iterationsPerMove; i++){
            this.runSingleIteration(rootNode);
        }

        // Select the move with most visits 
        return this.selectMostVisited(rootNode);
    }

    // Single MCTS Iteration = 4 steps 
    private runSingleIteration(rootNode: MCTSNode): void {{
        const path: MCTSNode[] =[];
        let currentNode = rootNode;

        // Step 1: Selection step
        while (!currentNode.gameIsOver() && !currentNode.canExpand()) {
            currentNode = currentNode.selectBestChild(this.explorationParameter);
            path.push(currentNode);
        }

        // Step 2: Expansion step 
        if (currentNode.canExpand()) {
            const randomMove = this.selectRandomMove(currentNode.unvisitedMoves);
            // Adds the random move to node
            currentNode = currentNode.addChild(randomMove);
            path.push(currentNode);
        }

        // Step 3: Simulation step 
        const result = this.simulateRandomGame(currentNode.gameState);

        // Step 4: Backpropagation step 
        path.forEach(node => node.update(result));
        rootNode.update(result);
    }}

    // Simulate a random game -> for the simulation step
    private simulateRandomGame(gameState: GameState): 'X' | 'O' | 'draw' {
        let currentState = gameState;

        // Play random game until it ends 
        while (currentState.getGameResult() === 'ongoing') {
            const validMoves = currentState.getValidMoves();

            if (validMoves.length === 0) break; // incase no valid moves 

            const randomMove = this.selectRandomMove(validMoves);
            currentState = currentState.makeMove(randomMove);
        }

        return currentState.getGameResult() as 'X' | 'O' | 'draw';
    }
    // Select random move from the valid moves 
    private selectRandomMove(moves: number[]): number {
        // Math.random produces between 0 & 1 but never 1
        return moves[Math.floor(Math.random() * moves.length)];
    }

    // Select move with the highest confidence 
    private selectMostVisited(rootNode: MCTSNode): number {
        let bestMove = -1; 
        let mostVisits = -1; 

        for (const child of rootNode.children) {
            if (child.visits > mostVisits) {
                mostVisits = child.visits;
                bestMove = child.currentMove;
            }
        }
        return bestMove;
    }

    // Method to adjust the AI's difficulty 
    setDifficulty(difficulty: "easy" | "medium" | "hard"): void {
        switch(difficulty) {
            case "easy":
                this.iterationsPerMove = 10; // Faster but weaker AI
                break;
            case "medium":
                this.iterationsPerMove = 30; // Still Fast but possible to beat 
                break;
            case "hard":
                this.iterationsPerMove = 200; // Slighter slower and impossible to beat 
                break;
        }
        // Debugging log
        console.log(`AI difficulty set to ${difficulty} (${this.iterationsPerMove} iterations)`);
    }
}

