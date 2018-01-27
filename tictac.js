// Get elements.
var grid = document.querySelectorAll(".grid");
var reset = document.querySelector("#reset");
var victory = document.querySelector(".victory");
var difficulty= document.querySelectorAll(".difficultyBtn");

// Set player and board vars - bitmask flags.
var EMPTY = 0; // 0000
var HUMAN = 1; // 0001
var CPU = 2; // 0010
var ANY_PLAYER = 3; // 0011
var DRAW = 4; // 0100
var ALL = 15; // 1111

var CPULevel = "potato";
var currentPlayer = HUMAN;

var depth = 0;
var board = [
    EMPTY, EMPTY, EMPTY, 
    EMPTY, EMPTY, EMPTY, 
    EMPTY, EMPTY, EMPTY
    ];
var gameOver = false;


// Init.
createListeners();

function createListeners(){
    // Create grid click listeners (humans move).
    for (var i = 0; i < grid.length; i++){
        grid[i].addEventListener("click", function(){
            humanTurn(this);
        })
    }

    // Reset button.
    reset.addEventListener("click", function(){
            resetGame();
    })

    // Difficulty.
    for (var i = 0; i < difficulty.length; i++){
        difficulty[i].addEventListener("click", function(){
            difficulty[0].classList.remove("selected");
            difficulty[1].classList.remove("selected");
            this.classList.add("selected");
            this.textContent === "Potato" ? CPULevel = "potato": CPULevel = "grandmaster";
        })
    }    
}

function resetGame(){
    // Reset vars.
    currentPlayer = HUMAN;
    depth = 0;
    board = [
        EMPTY, EMPTY, EMPTY, 
        EMPTY, EMPTY, EMPTY, 
        EMPTY, EMPTY, EMPTY
        ];
    gameOver = false;

    // Remove 'pieces' from board.
    for (var i = 0; i < grid.length; i++){
        grid[i].classList.remove("human");
        grid[i].classList.remove("cpu");
    }

    // Clear end game div.
    victory.innerHTML = ""
    victory.classList.remove("win");
    victory.classList.remove("loss");
    victory.classList.remove("draw");
}


function humanTurn(element){
    // Check for a winner.
    if (getWinner(board) === EMPTY) {
        // If empty piece is clicked.
        if (!element.classList.contains("cpu") && !element.classList.contains("human")) {
            // Make the move.
            element.classList.add("human");
            board[Number(element.id)] = currentPlayer;
            // Check for winner.
            if (getWinner(board) === HUMAN) {
                victory.innerHTML = "You Win!"
                victory.classList.add("win");
            } else if (getWinner(board) === DRAW) {
                victory.innerHTML = "You Draw!"
                victory.classList.add("draw");
            }
            // Switch players - make CPU move.
            currentPlayer = CPU
            cpuTurn();
       } 
    }
}

function cpuTurn(){
    // Check for a winner.
    if ( getWinner(board) === EMPTY ){
        // Make the move based on difficulty.
        var nextMove = getNextCPUMove ();
        board[nextMove] = currentPlayer
        grid[nextMove].classList.add("cpu");
        // Check for winner
        if (getWinner(board) === CPU) {
            victory.innerHTML = "CPU Wins!"
            victory.classList.add("loss");
        } else if (getWinner(board) === DRAW) {
            victory.innerHTML = "You Draw!"
            victory.classList.add("draw");
        }
        // Switch players.
        currentPlayer = HUMAN
    } 
}

function getNextCPUMove (){
    var nextCPUMove;
    if (CPULevel === "potato"){
        // Get random move from available moves.
        var availableMoves = getAvailableMoves(board);
        nextCPUMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    } else {
        // Calculate next move using minimax algorithm.
        var bestMove = getBestMove(board, depth, currentPlayer);
        nextCPUMove = bestMove["move"];
    }
    return nextCPUMove
}

function getBestMove(board, depth, currentPlayer)
{
    // Determine winner and increment depth.
    var winner = getWinner(board);
    depth += 1;

    // Create required variables.
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
    // then its a tie - return zero.
    var availableMoves = getAvailableMoves(board);
    if (availableMoves.length === 0) {
        bestMove["score"] = 0;
        return bestMove;
    }

    // Create variables for min and max moves.
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

        // Get next players move.
        // Bitwise toggle players flags to switch players.
        var nextMove = getBestMove(board, depth, currentPlayer ^ ANY_PLAYER)
        if (nextMove["score"] > max["score"]){
            max["score"] = nextMove["score"];
            max["move"] = move;
        }
        if (nextMove["score"] < min["score"]){
            min["score"] = nextMove["score"];
            min["move"] = move;
        }
        // Undo the move.
        board[move] = EMPTY;

    })

    // Return each players best move.
    if (currentPlayer === CPU) {
        return max;
    } else {
        return min;
    }
}

function getAvailableMoves(board) {
    // Get all available moves on
    // the current board.
    var possibleMoves = new Array();
    for (var i = 0; i < board.length; i++){
        if (board[i] === EMPTY){
            possibleMoves.push(i);
        }
    }
    return possibleMoves;
}

function getWinner(board){
    // Use bitwise AND to look for winners. 
    // Slightly more efficient.

    // Horizontal victory -
    for (var i = 0; i <= 6; i += 3) {
        //if entire row matches.
        if ((board[i] & HUMAN) 
            && (board[i + 1] & HUMAN) 
            && (board[i + 2] & HUMAN)){   
            // HUMAN wins.
            return HUMAN;
        }
        else if ((board[i] & CPU) 
            && (board[i + 1] & CPU) 
            && (board[i + 2] & CPU)){
            //CPU wins.
           return CPU; 
        }
    }
    // Vertical victory |
    for (var i = 0; i <= 2; i++) {
        // if entire coloumn matches
        if ((board[i] & HUMAN) 
            && (board[i + 3] & HUMAN) 
            && (board[i + 6] & HUMAN)){
                // HUMAN wins.
                return HUMAN;
            }
        else if ((board[i] & CPU) 
            && (board[i + 3] & CPU) 
            && (board[i + 6] & CPU)){
                //CPU wins.
                return CPU;
            }
        }
    // Diagonal victory \
    if ((board[0] & HUMAN) 
        && (board[4] & HUMAN) 
        && (board[8] & HUMAN)){
            // HUMAN wins.
            return HUMAN;
        }
    else if ((board[0] & CPU) 
        && (board[4] & CPU) 
        && (board[8] & CPU)){
        //CPU wins.
        return CPU;
    }
    // Diagonal victory /
    if ((board[2] & HUMAN) 
        && (board[4] & HUMAN) 
        && (board[6] & HUMAN)){
            // HUMAN wins.
            return HUMAN;
        }
    else if ((board[2] & CPU) 
        && (board[4] & CPU) 
        && (board[6] & CPU)){
        //CPU wins.
        return CPU;
    }

    // If game is ongoing return.
    for (var i = 0; i < board.length; i++) {
        if ((board[i] & ALL) === 0){
            return EMPTY;
        }
    }

    // Else draw.
    return DRAW;
}
