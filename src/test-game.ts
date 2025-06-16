import { GameState, Player, getOppositePlayer } from "./game";

function assert(condition: boolean, message: string): void {
    if (!condition) {
        throw new Error(`Test failed: ${message}`)
    }
    console.log(`${message}`)
}

function testgetOppositePlayer(): void {
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

function runAllTests(): void{
    console.log('Running game logic tests...\n');

    try {
        testgetOppositePlayer();
        console.log('');
    } catch(error){
        console.error(`Test failed:`, error);
    }
}

export {runAllTests};