// Get elements
var grid = document.querySelectorAll(".grid");
var reset = document.querySelector("#reset");
var victory = document.querySelector(".victory");
var difficulty= document.querySelectorAll(".difficultyBtn");

// Set player and board vars
var HUMAN = true;
var CPU = false;
var CPULevel = "potato";
var EMPTY = null;
var DRAW = -1;
var currentPlayer = HUMAN;
var depth = 0;
var board = [
    null, null, null, 
    null, null, null, 
    null, null, null
    ];
var gameOver = false;

// Init
createListeners();

function createListeners(){
    // Create grid click listeners (humans move)
    for (var i = 0; i < grid.length; i++){
        grid[i].addEventListener("click", function(){
            humanTurn(this);
        })
    }

    // Reset button
    reset.addEventListener("click", function(){
            resetGame();
    })

    // Difficulty
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
    // Reset vars
    currentPlayer = HUMAN;
    depth = 0;
    board = [
        null, null, null, 
        null, null, null, 
        null, null, null
        ];
    gameOver = false;

    // Remove 'pieces' from board
    for (var i = 0; i < grid.length; i++){
        grid[i].classList.remove("human");
        grid[i].classList.remove("cpu");
    }

    // Clear end game div
    victory.innerHTML = ""
    victory.classList.remove("win");
    victory.classList.remove("loss");
    victory.classList.remove("draw");
}


function humanTurn(element){
    // Check for a winner
    if (getWinner(board) === null) {
        // If empty piece is clicked
        if (!element.classList.contains("cpu") && !element.classList.contains("human")) {
            // Make the move
            element.classList.add("human");
            board[Number(element.id)] = currentPlayer;
            // Check for winner
            if (getWinner(board) === HUMAN) {
                victory.innerHTML = "You Win!"
                victory.classList.add("win");
            } else if (getWinner(board) === DRAW) {
                victory.innerHTML = "You Draw!"
                victory.classList.add("draw");
            }
            // Switch players - make CPU move
            currentPlayer = CPU
            cpuTurn();
       } 
    }
}

function cpuTurn(){
    // Check for a winner
    if ( getWinner(board) === null ){
        // Make the move based on difficulty
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
        // Switch players
        currentPlayer = HUMAN
    } 
}

function getNextCPUMove (){
    var nextCPUMove;
    if (CPULevel === "potato"){
        // Get random move from available moves
        var availableMoves = getAvailableMoves(board);
        nextCPUMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    } else {
        // Calculate next move using minimax algorithm
        var bestMove = getBestMove(board, depth, currentPlayer);
        nextCPUMove = bestMove["move"];
    }

    return nextCPUMove
}

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
    if (board[0] === board[4] && board[0] === board[8]) {
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
    if (board[2] === board[4] && board[2] === board[6]) {
        //human wins
        if (board[2] === HUMAN) {
            return HUMAN;
        }
        //CPU wins
        else if (board[2] === CPU) {
            return CPU;
        }
    }

    // if game is ongoing return null
    for (var i = 0; i < board.length; i++) {
        if (board[i] === EMPTY)
            return null;
    }

    // else draw
    return DRAW;
}
