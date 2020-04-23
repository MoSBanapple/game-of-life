
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }
	
    return arr;
}

function randInt(upperBound){
	return Math.floor(Math.random()*upperBound);
}

function coinFlip(percentage){
	return (Math.random() < percentage);
}

function generateGrid(n, randPercent){
	var state = createArray(n,n);
	for (let i = 0; i < n; i++){
		for (let j = 0; j < n; j++){
			if (coinFlip(randPercent)){
				state[i][j] = 1;
			} else {
				state[i][j] = 0;
			}
		}
	}
	return state;
}

function runIteration(state){
	let n = state.length;
	var newState = createArray(n, n);
	for (let i = 0; i < n; i++){
		for (let j = 0; j < n; j++){
			neighbors = 0;
			for (let x = -1; x < 2; x++){
				for (let y = -1; y < 2; y++){
					if (i+x < 0 || i+x >= n || y+j < 0 || y+j >= n || (y == 0 && x == 0)){
						continue;
					}
					if (state[i+x][j+y] > 0){
						neighbors++;
					}
				}
			}
			if (state[i][j] == 1 && (neighbors == 2 || neighbors == 3)){
				newState[i][j] = 1;
			} else if (state[i][j] == 0 && neighbors == 3){
				newState[i][j] = 1;
			} else {
				newState[i][j] = 0;
			}
			//console.log("Neighbors: " + neighbors + " oldState: " + state[i][j] + " newstate: " + newState[i][j]);
		}
	}
	return newState;
}


function drawGrid(state){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	let dimension = state.length;
	let width = ctx.canvas.clientWidth;
	let blockSize = Math.floor(width/dimension);
	ctx.beginPath();
	ctx.lineWidth = "1";
	let liveCount = 0
	for (let i = 0; i < dimension; i++){
		for (let j = 0; j < dimension; j++){
			ctx.strokeStyle = "black";
			if (state[i][j] == 0){
				ctx.rect(blockSize*i, blockSize*j, blockSize, blockSize);
			} else {
				liveCount++;
				ctx.rect(blockSize*i, blockSize*j, blockSize, blockSize);
				ctx.strokeStyle = "gray";
				ctx.fillRect(blockSize*i + 1, blockSize*j + 1, blockSize - 2, blockSize - 2);
			}
		}
	}
	document.getElementById("liveCount").innerHTML = liveCount;
	document.getElementById("iterCount").innerHTML = numIterations;
	ctx.stroke();
}


function startIterations(iterations){
	
	
	if (iterations == 0 || pause){
		return;
	}
	state = runIteration(state);
	numIterations++;
	document.getElementById("iterCount").innerHTML = numIterations;
	drawGrid(state);
	
	setTimeout(startIterations, speed*1000, ctx, state, iterations - 1);
}

function startPause(){
	let startButton = document.getElementById("startButton");
	if (pause){
		pause = false;
		startIterations(-1);
		startButton.innerHTML = "Stop";
	} else {
		pause = true;
		startButton.innerHTML = "Start";
	}
}

function resetButton(){
	let startButton = document.getElementById("startButton");
	startButton.innerHTML = "Start";
	let newDimension = document.getElementById("dimensionInput").value;
	if (!isNaN(newDimension) && newDimension >= 1){
		n = Math.floor(newDimension);
	}
	let newPop = document.getElementById("popInput").value;
	if (!isNaN(newPop) && newPop >= 0){
		pop = newPop;
	}
	let newSpeed = document.getElementById("speedInput").value;
	if (!isNaN(newPop) && newPop > 0){
		speed = newSpeed;
	}
	numIterations = 0;
	pause = true;
	state = generateGrid(n, pop);
	drawGrid(state);
}

function getSquare(x, y){
	let dimension = state.length;
	let width = ctx.canvas.clientWidth;
	let blockSize = Math.floor(width/dimension);
	let xBlock = Math.floor(x/blockSize);
	let yBlock = Math.floor(y/blockSize);
	return [xBlock, yBlock];
}

var pause = true;
var n = 35;
var pop = 0.5;
var speed = 1.0
var numIterations = 0;
var canvas = document.getElementById("lifeCanvas");
var ctx = canvas.getContext("2d");
var state = generateGrid(n, pop);
drawGrid(state);
canvas.addEventListener('click', (e) => {
	let coordinates = getSquare(e.offsetX, e.offsetY);
	squareX = coordinates[0];
	squareY = coordinates[1];
	state[squareX][squareY] = (state[squareX][squareY]+1)%2;
	drawGrid(state);
});

