var HUMAN = true
var CPU = false
var EMPTY = null
var currentPlayer = CPU;
var depth = 0;

function getBestMove(board, depth, currentPlayer)
{
    // Determine winner and increment depth
    var winner = getWinner(board);
    depth += 1;

    // Create required variables
    var bestMove = {}
    var scores = [];
    var moves = [];

    // Break out of recursion if games over.
    // If human or CPU has won return
    // score. Return arbitrary score, it must
    // just be higher or lower than
    // a tie. Using depth to determine
    // a better score so that CPU
    // carries on playing instead of 
    // an instant death when 
    // it realises its lost.
    if (winner === CPU) {
        bestMove["score"] = 100 - depth;
        return bestMove
    } else if (winner === HUMAN) {
        bestMove["score"] = depth - 100;
        return bestMove;
    } 
    
    // Get array of moves available
    // if theres no more moves left
    // then its a tie - return zero
    var availableMoves = getAvailableMoves(board);
    if (availableMoves.length === 0) {
        bestMove["score"] = 0;
        return bestMove;
    }

    // Create variables for min and max moves
    var max = {
        score: -100,
        move: 0,
    };
    var min = {
        score: 100,
        move: 0,
    };

    // Recursively iterate through all moves 
    // until end of each path. CPU is maximising 
    // score looking for next best move. 
    // Assume HUMAN is playing his best and 
    // that he will take the best possible move, 
    // which will minimise CPU's score.
    availableMoves.forEach(function(move){
        // Move one step forward and change players.
        board[move] = currentPlayer;

        // Get next players move
        var nextMove = getBestMove(board, depth, !currentPlayer)
        if (nextMove["score"] > max["score"]){
            max["score"] = nextMove["score"];
            max["move"] = move;
        }
        if (nextMove["score"] < min["score"]){
            min["score"] = nextMove["score"];
            min["move"] = move;
        }

        // Undo the move and change player back.
        board[move] = EMPTY;

    })

    // Return each players best move.
    if (currentPlayer === CPU) {
        return max;
    } else {
        return min;
    }

}

function getAvailableMoves(game) {
    // get all available moves on
    // the current board
    var possibleMoves = new Array();
    for (var i = 0; i < game.length; i++){
        if (game[i] === EMPTY){
            possibleMoves.push(i);
        }
    }
    return possibleMoves;
}

function getWinner(board)
{
    //horizontal victory -
    for (var i = 0; i <= 6; i += 3) {
        //if entire row matches
        if ((board[i] === board[i + 1]) && (board[i] === board[i + 2])) {   
            //human wins
            if (board[i] === HUMAN) {
                return HUMAN;
            }
           //CPU wins
            else if (board[i] === CPU) {
               return CPU; 
            }
        }
    }
    //vertical victory |
    for (var i = 0; i <= 2; i++) {
        // if entire coloumn matches
        if (board[i] === board[i + 3] && board[i] === board[i + 6]) {
            //human wins
            if (board[i] === HUMAN) {
                return HUMAN;
            }
            //CPU wins
            else if (board[i] === CPU) {
                return CPU;
            }
        }
    }
    //diagonal victory \
    if (board[0] === board[4] && board[0] === board[8])
    {
        //human wins
        if (board[0] === HUMAN) {
            return HUMAN;
        }
        //CPU wins
        else if (board[0] === CPU) {
            return CPU;
        }
    }
    //diagonal victory /
    if (board[2] === board[4] && board[2] === board[6])
    {
        //human wins
        if (board[2] === HUMAN) {
            return HUMAN;
        }
        //CPU wins
        else if (board[2] === HUMAN) {
            return CPU;
        }
    }
    // if game is ongoing or tie, return null
    return null;
}

//===============================================================//


testMini();

function testMini(){
    // test a bunch of moves...
    var board = [
        null, null, null, 
        null, true, null, 
        null, null, null
        ];

    nextMove = getBestMove(board, 0, currentPlayer);

    if (nextMove["move"] === 0) {
        console.log("Move 1 - success")
    } else {
        console.log("Move 1 - fail")
    }

    board = [
        false, null, null, 
        null, true, true, 
        null, null, null
        ];

    nextMove = getBestMove(board, 0, currentPlayer);

    if (nextMove["move"] === 3) {
        console.log("Move 2 - success")
    } else {
        console.log("Move 2 - fail")
    }

    board = [
        false, null, null, 
        false, true, true, 
        null, null, true
        ];

    nextMove = getBestMove(board, 0, currentPlayer);

    if (nextMove["move"] === 6) {
        console.log("Move 3 - success")
    }else {
        console.log("Move 3 - fail")
    }

    board = [
        null, null, null, 
        null, null, true, 
        null, null, null
        ];

    nextMove = getBestMove(board, 0, currentPlayer);

    if (nextMove["move"] === 2) {
        console.log("Move 4 - success")
    }else {
        console.log("Move 4 - fail")
    }

    board = [
        null, null, false, 
        null, true, true, 
        null, null, null
        ];

    nextMove = getBestMove(board, 0, currentPlayer);

    if (nextMove["move"] === 3) {

        console.log("Move 5 - success")
    }else {
        console.log("Move 5 - fail")
    }

    board = [
        true, null, false, 
        false, true, true, 
        null, null, null
        ];

    nextMove = getBestMove(board, 0, currentPlayer);

    if (nextMove["move"] === 8) {
        console.log("Move 6 - success")
    }else {
        console.log("Move 6 - fail")
    }

    board = [
        true, true, false, 
        false, true, true, 
        null, null, false
        ];

    nextMove = getBestMove(board, 0, currentPlayer);

    if (nextMove["move"] === 7) {
        console.log("Move 7 - success")
    }else {
        console.log("Move 7 - fail")
    }

    board = [
        null, null, null, 
        null, null, null, 
        true, null, null
        ];

    nextMove = getBestMove(board, 0, currentPlayer);

    if (nextMove["move"] === 4) {
        console.log("Move 8 - success")
    }else {
        console.log("Move 8 - fail")
    }

    board = [
        null, null, null, 
        true, false, null, 
        true, null, null
        ];

    nextMove = getBestMove(board, 0, currentPlayer);

    if (nextMove["move"] === 0) {
        console.log("Move 9 - success")
    }else {
        console.log("Move 9 - fail")
    }

    board = [
        false, null, null, 
        true, false, null, 
        true, true, null
        ];

    nextMove = getBestMove(board, 0, currentPlayer);

    if (nextMove["move"] === 8) {
        console.log("Move 10 - success")
    }else {
        console.log("Move 10 - fail")
    }

}