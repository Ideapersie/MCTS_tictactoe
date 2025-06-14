// define 3 possible states per position 
export enum Player{
    X = 'X', 
    O = 'O',
    EMPTY = ' '
}

// Helper function to switch players 
export function getOppositePlayer(player: Player): Player {
    if (player === Player.X) return Player.O;
    if (player === Player.O) return Player.X;

    // Error handling for empty move 
    throw new Error('Cannot get opposite player ${player} - only X and O are valid players');
}

export class GameState{
    // Private fiels for controlled access 
    private board: Player[]; // 9 elements representing board state
    private currentPlayer: Player;
    private gameResult: 'X' | 'O' | 'draw' | 'ongoing'; // Cached game result 
    

    // Allows the creation of new game and copy existing games
    constructor(board?: Player[], currentPlayer: Player = Player.X) {
        if(board){
            // Create defensive copy of board state 
            this.board = [...board];
        } else {
            this.board = new Array(9).fill(Player.EMPTY)
        }

        this.currentPlayer = currentPlayer;
        this.gameResult = this.calculateGameResult()

    }

    // getter methods
    getBoard(): Player[] { 
        return[...this.board];
    }

    getCurrentPlayer(): Player {
        return this.currentPlayer;
    }
    // Positions are numbered from 0 -> 8, left to right and top to bottom 
    // 0 | 1 | 2
    // 3 | 4 | 5
    // 6 | 7 | 8 
    getPosition(index: number): Player {
        if (index < 0 || index > 8){
            throw new Error('Invalid position, please input a between 0 & 8')
        }
        return this.board[index];
    }

    // Check if inputted move is valid (inbound and empty)
    isValidMove(position: number): boolean {
        return position >= 0 && position <= 8 && this.board[position] === Player.EMPTY;
    }

    // Get all positions allowed to play -> used later in MCTS expansion phase
    getValidMoves(): number[] {
        const validMoves: number[] = []

        // return only if game is still ongoing 
        if(this.gameResult==='ongoing'){
            for(let i = 0; i <9; i++){
                if(this.board[i]===Player.EMPTY){
                    validMoves.push(i);
                }
            }
        }
        return validMoves;
    }

    
}
