import { GameState, Player, getOppositePlayer } from "./game.js";

function assert(condition: boolean, message: string): void {
    if (!condition) {
        throw new Error(`Test failed: ${message}`)
    }
    console.log(`${message}`)
}

function testgetOppositePlayer(): void {
    console.log(`Testing getOppositePlayer function...`)

    // Test normal cases 
    assert(getOppositePlayer(Player.X) === Player.O, `Opponent of X -> O`)
    assert(getOppositePlayer(Player.O) === Player.X, `Opponent of O -> X`)

    try {
        getOppositePlayer(Player.EMPTY);
        assert(false, `getOppositePlayer should throw error for EMPTY player`);
    } catch (error) {
        assert(error instanceof Error, `getOppositePlayer should throw Error object`)
    }

}

function testGameStateCreation(): void{
    console.log(`Testing GameState creation....`);

    const newGame = new GameState();
    assert(newGame.getCurrentPlayer() === Player.X, `New game should start with X`);
    assert(newGame.getGameResult() === `ongoing`, `New game should be ongoing`);
    assert(newGame.getValidMoves().length === 9, `New game should have 9 valid moves`);

    // Test that all positions are empty at start 
    for (let i =0; i < 9 ; i++) {
        const position = newGame.getPosition(i);
        // Only prints if theres an Error
        if (position !== Player.EMPTY){
            console.log(`Unexpected value at position ${i}`);
            throw new Error();
        }
    }
}

function testMakeMove(): void{
    console.log(`Testing gameplay moves...\n`);

    const game = new GameState();

    assert(game.getPosition(4) === Player.EMPTY, `New board should be empty`)
    assert(game.getCurrentPlayer() === Player.X, `The first move is made by Player X`)

    // Apply move to the new game state 
    const new_move = game.makeMove(4);

    assert(new_move.getPosition(4) === Player.X, `The position is now occupied by Player X`)
    assert(new_move.getCurrentPlayer() === Player.O, `The next move is made by Player O`);

    try {
        new_move.makeMove(4);
        assert(false, `Move is occupied, should not be placed`);
    } catch (error) {
        console.log(`Prevented occupied move from playing`);
    }

    try {
        new_move.makeMove(9);
        assert(false, `Move is outside the board, should not be allowed`);
    } catch(error) {
        console.log(`Prevented out of bounds move`)
    }
}

function testGameResultCalculation(): void{
    console.log(`Testing Game Result calculation...\n`);

    const horizontalWin = new GameState([
        Player.X, Player.X, Player.X,
        Player.O, Player.O, Player.X,
        Player.X, Player.O, Player.O
    ]);
    assert(horizontalWin.getGameResult() === Player.X, `Player X wins due to horizontal connect`);

    const VerticalWinO= new GameState([
        Player.O, Player.EMPTY, Player.X,
        Player.O, Player.X, Player.EMPTY,
        Player.O, Player.X, Player.X
    ]);
    assert(VerticalWinO.getGameResult() === Player.O, `Player O wins due to vertical connect`);

    const ongoingGame = new GameState([
        Player.X, Player.EMPTY, Player.X,
        Player.O, Player.O, Player.X,
        Player.X, Player.EMPTY, Player.O
    ]);
    assert(ongoingGame.getGameResult() === 'ongoing', `The game is ongoing, no wins and there is still empty spaces`);

    const drawGame = new GameState([
        Player.X, Player.O, Player.X,
        Player.O, Player.O, Player.X,
        Player.X, Player.X, Player.O
    ]);
    assert(drawGame.getGameResult() === 'draw', `The game ends in a draw since there is no winners`);
}

// Function to run all these test cases
function runAllTests(): void{
    console.log('Running game logic tests...\n');

    try {
        testgetOppositePlayer();
        console.log('');

        testGameStateCreation();
        console.log('');

        console.log('All tests passed!')
    } catch(error){
        console.error(`Test failed:`, error);
    }
}

export {runAllTests};