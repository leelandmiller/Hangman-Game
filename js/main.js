var wordElem = document.getElementById("word");
var guessedLettersElem = document.getElementById('letters-guessed');
var guessesLeftElem = document.getElementById('guesses-left');
var winLoseMsg = document.getElementById('win-or-lose-message');
var categoryUI = document.getElementById('category');

var game = {
    newWord: '',
    secretWord: [],
    guessesLeft: 10,
    guessedLetters: [],

    categories: {
        fruits: [
            'apple', 'orange', 'pineapple', 'grape', 'watermelon', 'raspberry', 'blackberry', 'strawberry', 'banana', 'peach', 'pear', 'cherry', 'grapefruit', 'kiwi', 'mango', 'lemon', 'avocado', 'cantaloupe', 'apricot', 'papaya', 'fig', 'tangerine', 'pomegranate', 'coconut', 'cranberry', 'passionfruit', 'lychee', 'loquat', 'pitaya', 'jujube', 'boysenberry', 'tangelo', 'guava'
        ],
        gotChars: [
            'daenerystargaryen', 'jonsnow', 'aryastark', 'sansastark', 'themountain', 'cerseilannister', 'tyrionlannister', 'khaldrogo', 'joffreybaratheon', 'margaerytyrell', 'melisandre', 'thehound', 'ramsaybolton', 'eddardstark', 'hodor', 'brienne', 'lordbaelish', 'branstark', 'robbstark', 'daarionaharis', 'bronn', 'lordvarys', 'theongreyjoy', 'stannisbaratheon', 'jaimelannister', 'jorahmormont', 'tormundgiantsbane', 'highsparrow', 'rickonstark', 'davosseaworth'
        ],
        superheros: [
            'spiderman', 'hulk', 'thor', 'ironman', 'lukecage', 'blackwidow', 'daredevil', 'captainamerica', 'wolverine', 'doctorstrange', 'deadpool', 'captainamerica', 'batman', 'superman', 'wonderwoman', 'aquaman', 'flash', 'greenarrow', 'ironfist', 'captainatom', 'antman', 'greenlantern'
        ],
    },
    // new game method - called onclick
    newGame: function (category) {
        this.resetGame();
        var category = this.categories[category];
        this.newWord = category[Math.floor(Math.random() * (category.length + 1))];

        this.generateSecretWord(this.newWord);
        this.updateSecretWordUI(this.secretWord);
        this.updateCategoryUI(category);
    },
    // fills secretWord arr with '_' using newWord
    generateSecretWord: function (newWord) {
        for (var letter of newWord) {
            this.secretWord.push('_');
        }
    },
    // resets guessedLetters and guessesLeft
    resetGame: function () {
        // reset guessedLetters to empty arr
        this.guessedLetters = [];
        // reset guessesLeft to 10
        this.guessesLeft = 10;
        // reset secretWrod to empty arr
        this.secretWord = [];
        // reset innerHTML of wordElem
        wordElem.innerHTML = '';
        winLoseMsg.innerHTML = '';
        // reset guesses innerHTML
        this.showGuessInfo();
        this.hideButtons();
    },

    guessLetter: function (guess, secret, word) {
        // if a word has been chosen and user has guesses left
        var tempSecretWord = secret;
        if (this.newWord !== '' && this.guessesLeft > 0) {
            var checkIndex = 0;
            // this will set checkIndex to -1 if guess is not in word
            checkIndex = word.indexOf(guess);
            if (checkIndex === -1 && this.guessedLetters.indexOf(guess) === -1) {
                this.guessesLeft--;
                this.guessedLetters.push(guess);
                this.updateGuessesUI();
            }
            secret = secret.join('');
            while (checkIndex >= 0) {
                secret = this.updateSecretWord(checkIndex, guess, secret);
                checkIndex = word.indexOf(guess, checkIndex + 1);
            }
            // empty secretWord arr to push updated arr (secret) into it afterwards
            this.secretWord = [];
            for (var char of secret) {
                this.secretWord.push(char);
            }
            // updates secret word in ui
            this.updateSecretWordUI(this.secretWord);
        }
        // check if they won 
        this.checkIfWon();
        //TODO
        this.checkIfLost();
    },
    // if a correct letter is guessed, updates the secret word (changes corresponding dashes to letters)
    updateSecretWord: function (pos, char, originWord) {
        return originWord.substring(0, pos) + char + originWord.substring(pos + 1, originWord.length);
    },
    updateSecretWordUI: function (secretWord) {
        wordElem.innerHTML = '';
        for (var char of secretWord) {
            wordElem.innerHTML += char + ' ';
        }
    },
    updateCategoryUI: function (category) {
        if (category === this.categories.fruits) {
            categoryUI.innerHTML = "Fruits";
        } else if (category === this.categories.gotChars) {
            categoryUI.innerHTML = "Game of Thrones Characters";
        } else if (category === this.categories.superheros) {
            categoryUI.innerHTML = "Superheros";
        }
    },
    // compare secretWord to word to check if they won
    checkIfWon: function () {
        var secretString = this.secretWord.join('');
        if (secretString === this.newWord && this.newWord !== '') {
            winLoseMsg.innerHTML = 'YOU WON!';
            this.hideGuessInfo();
            this.showButtons();
        }
    },
    checkIfLost: function () {
        // DO STUFF HERE
        if (this.guessesLeft === 0) {
            winLoseMsg.innerHTML = 'YOU LOSE. GAME OVER';
            this.showButtons();
        }
    },
    hideButtons: function () {
        // hides newGame buttons after 1 is clicked
        $('.newGame-btn').css({
            'display': 'none'
        });
    },
    showButtons: function () {
        // hides newGame buttons after 1 is clicked
        $('.newGame-btn').css({
            'display': 'block'
        });
    },
    hideGuessInfo: function () {
        guessesLeftElem.innerHTML = '';
        // reset guessedLetters innerHTML
        guessedLettersElem.innerHTML = '';
    },
    showGuessInfo: function () {
        this.updateGuessesUI();
        // reset guessedLetters innerHTML
        guessedLettersElem.innerHTML = 'Guessed Letters: ';
    },
    updateGuessesUI: function () {
        guessesLeftElem.innerHTML = 'Guesses Left: ' + this.guessesLeft;
        guessedLettersElem.innerHTML = 'Guessed Letters: ';
        this.guessedLetters.map(function (letter) {
            guessedLettersElem.innerHTML += letter + ' ';
        });
    }
}

document.onkeyup = function (event) {
    var key = event.key.toLowerCase();
    game.guessLetter(key, game.secretWord, game.newWord);
}
