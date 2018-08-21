var direction = "right";
var width = 20;
var height = 20;
var death  = 0;
var SnakeArr = [];
var SegNumber = 2;
var FoodLoc;
var SBodyHtml = '<div style="background-color:lightgreen;height:100%;width:100%"></div>';
var SHeadHtml = '<div style="background-color:green;height:100%;width:100%"></div>';
var FoodHtml = '<div style="background-color:black;position:relative;width:50%;height:50%;left:25%"></div>';
var Timer;

//Creates the pixel board
function Board(containerId, rowsCount, colsCount) {
	
    var html = "<div class='ttt'><table>";
    for (var i = 0; i < rowsCount; i++) {
		html += "<tr id='row-" + i + "' class='row' >";
		for (var j = 0; j < colsCount; j++) {
			html += "<td id='" + cellId(i, j) + "' class='col' '></td>";
        }
        html += "</tr>"
	}
    html += "</table></div>";
    document.getElementById(containerId).innerHTML = html;
};
 
//Recieve the location of the inputted cell 
function cellId(row, col) {
	var loc = row + ":" + col
    return  loc;
}

//Randomly generates two number that the cell of the food should spawn on, and if there is already something on the cell, generate another one
function CreateFood (){
	var randomRow =  Math.floor((Math.random() * (width - 1)));
	var randomCol =  Math.floor((Math.random() * (height - 1)));
	
	
	while (document.getElementById(cellId(randomRow,randomCol)).innerHTML != ""){
		randomRow =  Math.floor((Math.random() * width));
		randomCol =  Math.floor((Math.random() * height));
	}
	
	FoodLoc = randomRow+":"+randomCol;
	document.getElementById(cellId(randomRow,randomCol)).innerHTML = FoodHtml;
	
}


//Create the snake head var and contains the location of the head
var SnakeHead = {
	row : 0,
	col : 2,
	prevLoc : "0:2",
	update: function() {
		document.getElementById(cellId(this.row,this.col)).innerHTML = SHeadHtml;

		if (this.prevLoc !=  (this.row+":"+this.col)){
			document.getElementById(this.prevLoc).innerHTML = '';
		}
	}
}

//Function for the creation of the BodySeg object for the snake body
function CreateSnakeBody(){
		
	var BodySeg = {
		prevLoc : null,
		currLoc : null,
		update: function(MoveLocation) {
			this.prevLoc = this.currLoc;
			this.currLoc = MoveLocation;
			document.getElementById(MoveLocation).innerHTML = SBodyHtml;
			if(MoveLocation != this.prevLoc){
				document.getElementById(this.prevLoc).innerHTML = '';
			}
		}
	}
	return BodySeg;
}


//Does the movement for the Head
function HeadMovement(){
	if (direction == "right"){
		SnakeHead.prevLoc=SnakeHead.row+":"+SnakeHead.col;
		SnakeHead.col += 1;
		SnakeHead.update();
	}
	
	else if (direction == "left"){
		SnakeHead.prevLoc=SnakeHead.row+":"+SnakeHead.col;
		SnakeHead.col -= 1;
		SnakeHead.update();
	}
	
	else if (direction == "up"){
		SnakeHead.prevLoc=SnakeHead.row+":"+SnakeHead.col;
		SnakeHead.row -= 1;
		SnakeHead.update();
	}
	
	else if (direction == "down"){
		SnakeHead.prevLoc=SnakeHead.row+":"+SnakeHead.col;
		SnakeHead.row += 1;
		SnakeHead.update();
	}
	
	else{
		console.log("The direction is wrong");
	}
}

//Move the body of the snake but making each body seg of the snake take the place of the segment before it
function BodyMove(){
	for (var i = 0; i < SnakeArr.length; i++){
		if (i == 0){
			SnakeArr[i].update(SnakeHead.prevLoc);
		}
		else{
			SnakeArr[i].update(SnakeArr[i-1].prevLoc);
		}
	}
}

//End the game
function EndGame (){
	document.getElementById('result').innerHTML = "You lose";
	clearInterval(this.timer);
	death = 1;
}



//Check if the SnakeHead is about to die.
function CheckDeath(){
	//Check if snake hits a wall
	if ((SnakeHead.col == (width - 1)) && (direction == "right")){
		EndGame();
	}
	else if ((SnakeHead.col == (0)) && (direction == "left")){
		EndGame();
	}
	else if ((SnakeHead.row == (height - 1)) && (direction == "down")){
		EndGame();
	}
	else if ((SnakeHead.row == (0)) && (direction == "up")){
		EndGame();
	}
	
	
	//Check if snake hits itself

	else if ((direction == "right") && (document.getElementById(SnakeHead.row+":"+(SnakeHead.col+1)).innerHTML == SBodyHtml)){
		EndGame();
	}
	else if ((direction == "left") && (document.getElementById(SnakeHead.row+":"+(SnakeHead.col-1)).innerHTML == SBodyHtml)){
		EndGame();
	}
	else if ((direction == "down") && (document.getElementById((SnakeHead.row+1)+":"+SnakeHead.col).innerHTML == SBodyHtml)){
		EndGame();
	}
	else if ((direction == "up") && (document.getElementById((SnakeHead.row-1)+":"+SnakeHead.col).innerHTML == SBodyHtml)){
		EndGame();
	}
}

//Moves to the next frame
function FrameMove(){
	CheckDeath();
	if (death != 1){
		HeadMovement();
		BodyMove();
		if (document.getElementById(FoodLoc).innerHTML != FoodHtml){
		
			SnakeArr[SegNumber] = CreateSnakeBody();
			SnakeArr[SegNumber].currLoc = SnakeArr[SegNumber-1].prevLoc;
			SnakeArr[SegNumber].update(SnakeArr[SegNumber-1].prevLoc);
			SegNumber ++; 
			
			CreateFood();
		}
	}
}

//Listens for the arrow keys to change the directions
window.addEventListener('keydown', function (e) {
	var dir = e.keyCode;
	if ((dir == 40) && (direction != "down") && (direction != "up")){
		direction = "down";
		clearInterval(this.timer);
		FrameMove();
		timer = setInterval( function(){FrameMove();}, 200);
		
	}
	else if ((dir == 39)  && (direction != "right") && (direction != "left")){
		direction = "right";
		clearInterval(this.timer);
		FrameMove();
		timer = setInterval( function(){FrameMove();}, 200);
	}
	else if ((dir == 38)  && (direction != "up") && (direction != "down")){
		direction = "up";
		clearInterval(this.timer);
		FrameMove();
		timer = setInterval( function(){FrameMove();}, 200);

	}
	else if ((dir == 37)  && (direction != "left") && (direction != "right")){
		direction = "left";
		clearInterval(this.timer);
		FrameMove();
		timer = setInterval( function(){FrameMove();}, 200);
	}
	else {
		console.log("The direction does not make sense");
	}
	
})


Board('container', height , width);
//Create the head
SnakeHead.update();

FoodLoc = "0:5";
document.getElementById(FoodLoc).innerHTML = FoodHtml;

//Create Snake segment 1
SnakeBody1 = CreateSnakeBody();
SnakeBody1.currLoc = '0:1';
SnakeBody1.update('0:1');
//Create snake segment 2
SnakeBody2 = CreateSnakeBody();
SnakeBody2.currLoc = '0:0';
SnakeBody2.update('0:0');
SnakeArr.push(SnakeBody1);
SnakeArr.push(SnakeBody2);

var timer = setInterval( function(){FrameMove();}, 200);
