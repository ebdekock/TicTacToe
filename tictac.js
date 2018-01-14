var grid = document.querySelectorAll(".grid");

var player = "x";
var gameOver = false;

for (var i = 0; i < grid.length; i++){
	grid[i].addEventListener("click", function(){
		if (!gameOver){
			if (player === "x" && !this.classList.contains("playerO")){
				this.classList.add("playerX")
				player = "o";
			} else if (!this.classList.contains("playerX")){
				this.classList.add("playerO")
				player = "x";
			}
		}
	})
}

