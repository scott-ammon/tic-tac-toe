// Global Variables
var gameOver = false; // boolean to stop game
var aiTest = false;   // lets checkForWin know whether this is a computer move
var moveValue = 0;    // evaluates how good a potential move is for the computer
var moveCount = 1;    // which move the game is on
var gameBoard = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // id's of the game board elements
var currentPlayer = 'X'; // used to place text in clicked square

var resetGame = function() {
  gameOver = false;
  moveCount = 1;

  var gameSquares = document.getElementById('game-board').children;
  
  // clear all the squares, data-id's, and winning background color
  for(let i = 0; i < gameSquares.length; i++) {
    gameSquares[i].textContent = '';
    gameSquares[i].setAttribute('data-id','not-played');
    gameSquares[i].style.backgroundColor = 'transparent';
    gameSquares[i].style.color = 'white';
  }
  initGame();
};

var checkForWin = function(squareInPlay) {
  moveValue = 0;
  // get classes associated with square that was clicked
  var classesInPlay = squareInPlay.classList;

  for (let i = 0; i < classesInPlay.length; i++) {
    var winVar = 0;
    var aiVar = 0;
    // get all board elements that have the i'th class of the clicked square
    var classesOnBoard = document.getElementsByClassName(classesInPlay[i]);

    // iterate over board elements to see if they have the matching letter in them
    for(let i = 0; i < classesOnBoard.length; i++) {
      if(aiTest) {
        if(classesOnBoard[i].textContent === 'X') {
          winVar++;
        }
        if(classesOnBoard[i].textContent === 'O') {
          aiVar++;
        }
      } else {
        if(classesOnBoard[i].textContent === currentPlayer) {
          winVar++;
        }
      }
    }
    console.log(aiVar);
    // if this square has more 'O's adjacent, save it
    if(winVar > moveValue) {
      moveValue = winVar;
    }
  
    // if all three boxes of a given class have same letter in them, it's a win
    if(winVar === 3 || aiVar === 3) {
      gameOver = true;
      // highlight the squares that won the game
      for(let i = 0; i < classesOnBoard.length; i++) {
        classesOnBoard[i].style.color = 'red';
      }
    }

    if(gameOver) {
      // make all squares 'played' so that users cannot continue to click after a win
      var allSquares = document.getElementById('game-board').children;

      for(let i = 0; i < allSquares.length; i++) {
        allSquares[i].setAttribute('data-id', 'played');
      }

      // Display which player is the winner
      if(currentPlayer === 'X') {
        document.getElementById('tag-line').textContent = "GAME OVER. You beat the computer!";
      } else {
        document.getElementById('tag-line').textContent = "GAME OVER. The computer beat you :(";
      }
    }
  }
};

var aiMove  = function() {
  var gameSquares = document.getElementById('game-board').children;
  var unplayedIndices = []; // store indices of the unplayed squares on the board
  var aiSquare; // represents square that the computer will select to place 'O'
  var moveValueArray = []; // array storing the potential value of each move

  for(let i = 0; i < gameSquares.length; i++) {
    // if the square is unplayed
    if(gameSquares[i].getAttribute('data-id') === 'not-played') {
      unplayedIndices.push(i);
      aiTest = true;
    }
  }

  if(moveCount >= 4) {
    for(let itr = 0; itr < unplayedIndices.length; itr++) {
      checkForWin(gameSquares[unplayedIndices[itr]]);
      moveValueArray[itr] = moveValue;
    }   
  }
  
  // store index of the square that represents the best move for the computer
  var bestIndex = moveValueArray.indexOf(Math.max(...moveValueArray));
  aiSquare = gameSquares[unplayedIndices[bestIndex]];
  aiTest = false;

   // select random square for first two rounds
  if(!aiSquare) {
    // pick random from unplayed squares and change data-id to played, and fill square
    aiSquare = gameSquares[unplayedIndices[Math.floor(Math.random() * unplayedIndices.length)]];
  }

  aiSquare.setAttribute('data-id','played');
  aiSquare.textContent = currentPlayer;

  moveCount++;
  currentPlayer = 'X';
  document.getElementById('player-status').textContent = "Your turn!"
  
};

var clickSquare = function() {
  // execute if the square hasn't been played yet
  if(this.getAttribute('data-id') !== 'played') {
    // mark the clicked square as played
    this.setAttribute('data-id','played');
    this.textContent = currentPlayer;

    if(moveCount >= 5) {
      checkForWin(this);
    }

    moveCount++;

    if (moveCount === 10 && gameOver === false) {
      gameOver = true;
      document.getElementById('tag-line').textContent = "GAME OVER. Nobody won...";
    } 
    
    if(!gameOver) {
      // make the computer take its turn
      currentPlayer = 'O';

      document.getElementById('player-status').textContent = "AI's turn"
      setTimeout(aiMove, 1000);

      document.getElementById('move-count').textContent = "Move: " + moveCount;
    }
  }
};

var initGame = function() {
  document.getElementById('tag-line').textContent = "PLAY FOR WORLD DOMINATION";
  document.getElementById('move-count').textContent = "Move: " + moveCount;
  currentPlayer = 'X';
  document.getElementById('player-status').textContent = "Ready Player X..."

  var gameSquares = document.getElementById('game-board').children;

  for(let i = 0; i < gameSquares.length; i++) {
    gameSquares[i].setAttribute('data-id','not-played');
  }
};

document.addEventListener("DOMContentLoaded", function() {
  // add Event Listeners and initialize the game
  for(let square in gameBoard) {
    document.getElementById(gameBoard[square]).addEventListener('click', clickSquare);
  }

  document.getElementById('reset').addEventListener('click', resetGame);
  initGame();
});

