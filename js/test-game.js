import { GameState, Player, getOppositePlayer } from "./game.js";
function assert(condition, message) {
    if (!condition) {
        throw new Error(`Test failed: ${message}`);
    }
    console.log(`${message}`);
}
function testgetOppositePlayer() {
    console.log(`Testing getOppositePlayer function...`);
    // Test normal cases 
    assert(getOppositePlayer(Player.X) === Player.O, `Opponent of X -> O`);
    assert(getOppositePlayer(Player.O) === Player.X, `Opponent of O -> X`);
    try {
        getOppositePlayer(Player.EMPTY);
        assert(false, `getOppositePlayer should throw error for EMPTY player`);
    }
    catch (error) {
        assert(error instanceof Error, `getOppositePlayer should throw Error object`);
    }
}
function testGameStateCreation() {
    console.log(`Testing GameState creation....`);
    const newGame = new GameState();
    assert(newGame.getCurrentPlayer() === Player.X, `New game should start with X`);
    assert(newGame.getGameResult() === `ongoing`, `New game should be ongoing`);
    assert(newGame.getValidMoves().length === 9, `New game should have 9 valid moves`);
    // Test that all positions are empty at start 
    for (let i = 0; i < 9; i++) {
        const position = newGame.getPosition(i);
        // Only prints if theres an Error
        if (position !== Player.EMPTY) {
            console.log(`Unexpected value at position ${i}`);
            throw new Error();
        }
    }
}
function runAllTests() {
    console.log('Running game logic tests...\n');
    try {
        testgetOppositePlayer();
        console.log('');
        testGameStateCreation();
        console.log('');
        console.log('All tests passed!');
    }
    catch (error) {
        console.error(`Test failed:`, error);
    }
}
export { runAllTests };
