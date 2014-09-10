// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview
 * Provides methods for the TicTacToe sample UI and interaction with the
 * TicTacToe API.
 *
 * @author danielholevoet@google.com (Dan Holevoet)
 */

/** google global namespace for Google projects. */
var google = google || {};

/** devrel namespace for Google Developer Relations projects. */
google.devrel = google.devrel || {};

/** samples namespace for DevRel sample code. */
google.devrel.samples = google.devrel.samples || {};

/** TicTacToe namespace for this sample. */
google.devrel.samples.ttt = google.devrel.samples.ttt || {};

/**
 * Status for an unfinished game.
 * @type {number}
 */
NOT_DONE = 0;

/**
 * Status for a victory.
 * @type {number}
 */
WON = 1;

/**
 * Status for a loss.
 * @type {number}
 */
LOST = 2;

/**
 * Status for a tie.
 * @type {number}
 */
TIE = 3;

/**
 * Strings for each numerical status.
 * @type {Array.number}
 */
STATUS_STRINGS = [
    'NOT_DONE',
    'WON',
    'LOST',
    'TIE'
];

/**
 * Whether or not the user is signed in.
 * @type {boolean}
 */
signedIn = false;

/**
 * Whether or not the game is waiting for a user's move.
 * @type {boolean}
 */
waitingForMove = true;

/**
 * Signs the user out.
 */
signout = function() {
  document.getElementById('signinButtonContainer').classList.add('visible');
  document.getElementById('signedInStatus').classList.remove('visible');
  enableBoard(false);
  signedIn = false;
}

/**
 * Handles a square click.
 * @param {MouseEvent} e Mouse click event.
 */
clickSquare = function(e) {
  if (waitingForMove) {
    var button = e.target;
    
		button.innerHTML = 'X';
    button.removeEventListener('click', clickSquare);
    
		waitingForMove = false;

    var boardString = getBoardString();
    var status = checkForVictory(boardString);
    
		if (status == NOT_DONE) {
      getComputerMove(boardString);
    } else {
      handleFinish(status);
    }
  }
};

/**
 * Resets the game board.
 */
resetGame = function() {
  var buttons = document.querySelectorAll('td');
  
	for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
  
		button.removeEventListener('click', clickSquare);
    button.addEventListener('click', clickSquare);
    button.innerHTML = '-';
  }
  
	document.getElementById('victory').innerHTML = '';
  waitingForMove = true;
};

/**
 * Gets the computer's move.
 * @param {string} boardString Current state of the board.
 */
getComputerMove = function(boardString) {
  gapi.client.tictactoe.board.getmove({'state': boardString}).execute(
      function(resp) {
    setBoardFilling(resp.state);
    var status = checkForVictory(resp.state);
    if (status != NOT_DONE) {
      handleFinish(status);
    } else {
      waitingForMove = true;
    }
  });
};

/**
 * Sends the result of the game to the server.
 * @param {number} status Result of the game.
 */
sendResultToServer = function(status) {
  gapi.client.tictactoe.scores.insert({'outcome':
      STATUS_STRINGS[status]}).execute(
      function(resp) {
    queryScores();
  });
};

/**
 * Queries for results of previous games.
 */
queryScores = function() {
  gapi.client.tictactoe.scores.list().execute(function(resp) {
    var history = document.getElementById('gameHistory');
    history.innerHTML = '';
    
		if (resp.items) {
      for (var i = 0; i < resp.items.length; i++) {
        var score = document.createElement('li');
        score.innerHTML = resp.items[i].outcome;
        history.appendChild(score);
      }
    }
  });
};

/**
 * Shows or hides the board and game elements.
 * @param {boolean} state Whether to show or hide the board elements.
 */
enableBoard = function(state) {
  if (!state) {
    document.getElementById('board').classList.add('hidden');
    document.getElementById('gameHistoryWrapper').classList.add('hidden');
    document.getElementById('warning').classList.remove('hidden');
  
	} else {
    document.getElementById('board').classList.remove('hidden');
    document.getElementById('gameHistoryWrapper').classList.remove('hidden');
    document.getElementById('warning').classList.add('hidden');
  }
};

/**
 * Sets the filling of the squares of the board.
 * @param {string} boardString Current state of the board.
 */
setBoardFilling = function(boardString) {
  var buttons = document.querySelectorAll('td');
	
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    button.innerHTML = boardString.charAt(i);
  }
};

/**
 * Checks for a victory condition.
 * @param {string} boardString Current state of the board.
 * @return {number} Status code for the victory state.
 */
checkForVictory = function(boardString) {
  var status = NOT_DONE;

  // Checks rows and columns.
  for (var i = 0; i < 3; i++) {
    var rowString = getStringsAtPositions(
        boardString, i*3, (i*3)+1, (i*3)+2);
    status |= checkSectionVictory(rowString);

    var colString = getStringsAtPositions(
      boardString, i, i+3, i+6);
    status |= checkSectionVictory(colString);
  }

  // Check top-left to bottom-right.
  var diagonal = getStringsAtPositions(boardString,
      0, 4, 8);
  status |= checkSectionVictory(diagonal);

  // Check top-right to bottom-left.
  diagonal = getStringsAtPositions(boardString, 2,
      4, 6);
  status |= checkSectionVictory(diagonal);

  if (status == NOT_DONE) {
    if (boardString.indexOf('-') == -1) {
      return TIE;
    }
  }

  return status;
};

/**
 * Checks whether a set of three squares are identical.
 * @param {string} section Set of three squares to check.
 * @return {number} Status code for the victory state.
 */
checkSectionVictory = function(section) {
  var a = section.charAt(0);
  var b = section.charAt(1);
  var c = section.charAt(2);
	
  if (a == b && a == c) {
    if (a == 'X') {
      return WON;
    } else if (a == 'O') {
      return LOST
    }
  }
  
	return NOT_DONE;
};

/**
 * Handles the end of the game.
 * @param {number} status Status code for the victory state.
 */
handleFinish = function(status) {
  var victory = document.getElementById('victory');
  
	if (status == WON) {
    victory.innerHTML = 'You win!';
  } else if (status == LOST) {
    victory.innerHTML = 'You lost!';
  } else {
    victory.innerHTML = 'You tied!';
  }
  
	sendResultToServer(status);
};

/**
 * Gets the current representation of the board.
 * @return {string} Current state of the board.
 */
getBoardString = function() {
  var boardStrings = [];
  var buttons = document.querySelectorAll('td');
  
	for (var i = 0; i < buttons.length; i++) {
    boardStrings.push(buttons[i].innerHTML);
  }
  
	return boardStrings.join('');
};

/**
 * Gets the values of the board at the given positions.
 * @param {string} boardString Current state of the board.
 * @param {number} first First element to retrieve.
 * @param {number} second Second element to retrieve.
 * @param {number} third Third element to retrieve.
 */
getStringsAtPositions = function(boardString, first, second, third) {
  return [boardString.charAt(first),
          boardString.charAt(second),
          boardString.charAt(third)].join('');
};

/**
 * Initializes the application.
 * @param {string} apiRoot Root of the API's path.
 * @param {string} tokenEmail The email parsed from the auth/ID token.
 */
init = function(apiRoot, tokenEmail) {
  // Loads the Tic Tac Toe API asynchronously, and triggers login
  // in the UI when loading has completed.
  var callback = function() {
    signedIn = true;
    document.getElementById('userLabel').innerHTML = tokenEmail;
    enableBoard(true);
    queryScores();
  }
	
  gapi.client.load('tictactoe', 'v1', callback, apiRoot);
  var buttons = document.querySelectorAll('td');
  
	for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    button.addEventListener('click', clickSquare);
  }

  var reset = document.querySelector('#restartButton');
  reset.addEventListener('click', resetGame);
};
