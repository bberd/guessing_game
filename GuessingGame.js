var Game = function() {
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();
	console.log(this.winningNumber);
}

function generateWinningNumber() {
	return 1 + Math.floor(Math.random() * 100);
}

function newGame() {
	$('#title').text("The Guessing Game");
	$('#subtitle').css({display: 'block'}).text("Once Again: Guess 0-100");
	$('#replay').css({display: 'none'});
	$('#players-input').animate({'font-size': '60px', 'color': 'rgb(51, 54, 118)', 'background-color': 'white'}, 'slow').val('');
	$('.guess').text("-").removeClass('guess').addClass('guessPreGuess');
	$('#hint, #players-input').prop('disabled', false);
	$('#submit, #hint, #reset').fadeIn('slow');

	return new Game();
}

function shuffle(arr) { //Fisher–Yates shuffle
  var temp, i,
  	  m = arr.length;
  
  while (m) { // While there remain elements to shuffle…
    i = Math.floor(Math.random() * m--); // Pick a remaining element…
    temp = arr[m]; // And swap it with the current element.
    arr[m] = arr[i];
    arr[i] = temp;
  }

  return arr;
}

Game.prototype.difference = function() {
	return Math.abs(this.winningNumber - this.playersGuess);
}

Game.prototype.isLower = function() {
	return (this.playersGuess < this.winningNumber) ? true : false;
}

Game.prototype.playersGuessSubmission = function(guess) {
	if (guess < 1 || guess > 100 || isNaN(guess)) {
		throw "That is an invalid guess." 
	} 
	
	this.playersGuess = guess;
	return this.checkGuess();
}

Game.prototype.checkGuess = function() {
	if (this.playersGuess === this.winningNumber) { 
		return "You Win!";
	} else if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
		return "You have already guessed that number.";
	} else {
		this.pastGuesses.push(this.playersGuess);
		if (this.pastGuesses.length === 5) return "You Lose.";
		else if (this.difference() < 10) return "You're burning up!";
		else if (this.difference() < 25) return "You're lukewarm.";
		else if (this.difference() < 50) return "You're a bit chilly.";
		else return "You're ice cold!";
	}
}

Game.prototype.provideHint = function() {
	return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
}


function submitGuess(game) {
	var guess = +$('#players-input').val();
	$('#players-input').val('');
	var result = game.playersGuessSubmission(guess);
	displayResultOfGuess(game, guess, result);

}

function displayResultOfGuess(game, guess, result) {
	$('#subtitle').text(result);
	if (result != "You have already guessed that number.") {
		var liToAffect = $( "ul li:nth-child(" + game.pastGuesses.length + ")" );
		liToAffect.text(guess)
		.removeClass('guessPreGuess')
		.addClass('guess');

		if (result === "You Lose." || result === "You Win!") {
			$('#title').text(result)
			endOfGameEvents(game);
		} else if (game.isLower()) {
			$('#subtitle').append(" Guess Higher!");
		} else $('#subtitle').append(" Guess Lower!");
	}
}

function endOfGameEvents(game) {
	$('#replay').css({display: 'block', margin: 'auto'});
	$('#subtitle').css({display: 'none'});
	$('#players-input').val(game.winningNumber);
	$('#players-input').animate({'font-size': '120px', 'color': 'rgb(118, 178, 149)', 'background-color': 'rgb(51, 54, 118)'}, 'slow');
	$('#players-input').prop('disabled', true);
	$('#submit, #hint, #reset').fadeOut('fast');
}


jQuery(document).ready(function() {
	game = new Game();

	$('#submit').on('click', function() {
		submitGuess(game);
	});

	$('#players-input').on('keypress', function(event) {
		if (event.which === 13 && game.pastGuesses.length < 5) {
			submitGuess(game);
		}
	});

	$('#hint').on('click', function() {
		var attemptsLeft = 5 - game.pastGuesses.length; 

		if (attemptsLeft > 2) {
			$('#subtitle').text("Too early for help! You still have " + attemptsLeft + " guesses!");
		} else {
			var hint = "The answer is either " +
				game.provideHint()[0] + ", " +
				game.provideHint()[1] + " or " +
				game.provideHint()[2]

			$('#subtitle').text(hint);

			$(this).prop('disabled', true);
		}
	});

	$('#reset').on('click', function() {
		game = newGame();
	});
	
	$('#replay').on('click', function() {
		 game = newGame();
		//location.reload();
	});

});