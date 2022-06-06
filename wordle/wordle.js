// getNewWord()
document.addEventListener("DOMContentLoaded", () => {
  
  //array that contains all the words and each word is an array that contains all the letters
  var guessedWords = [[]]
  //always one when initalized
  var availableSpace = 1


  let word;
  let currentWordIndex = 0;
  let guessWordCount = 0
  
  var keys = document.querySelectorAll(".keyboard-row button")
  
  //when page loads it runs function
  initLocalStorage()
  initHelpModal()
  initStatsModal()
  createSquares()
  //getNewWord()
  addKeyboardClicks()
  loadLocalStorage()
  //creating the squares
  function createSquares() {
    var gameBoard = document.getElementById("board")

    //for loop runs 30 times for a 5x6 board
    for (let i = 0; i < 30; i++) {
      let square = document.createElement("div")
      square.classList.add("square")
      square.classList.add("animate__animated")
      //id is number of square using i + 1
      square.setAttribute("id", i + 1)
      gameBoard.appendChild(square)
    }
  }
  
  //key pad
  function addKeyboardClicks() {
    for (let i = 0; i < keys.length; i++) {
      
      keys[i].onclick = ({target}) => {
        //getting letter from target
  
        var letter = target.getAttribute("data-key")
  
        if (letter === "enter") {
          handleSubmitWord();
          return;
        }
        if (letter === "delete") {
          handleDeleteLetter();
          return;
        }
        updateGuess(letter)
        
      }
      document.addEventListener('keyup', logKey);
    }
  }
  //type with keyboard
  function logKey(e) {
    console.log(e.key)
    if (e.key === 'Enter') {
      handleSubmitWord()
      return
    }
    if(e.key === 'Backspace') {
      handleDeleteLetter()
      return
    }
    else {
      updateGuess(e.key)
    }
  }


  //fetches new word from api with unique key
  function getNewWord() {
    fetch(
      `https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
          "x-rapidapi-key": "bd32c8dcaemshb6f31c38cd6129cp103738jsn81158984c1a4",
        },
      }
    )
      //gets response and converts it to json
      .then((response) => {
        return response.json();
      })
      //get result and assign it to word variable
      .then((res) => {
        word = res.word;
        window.localStorage.setItem("word", word)
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //changes tile color based on position and if it is correct letter

  function getTileClass(letter, index, currWordArr) {
    const isCorrectLetter = word
    .toUpperCase()
    .includes(letter.toUpperCase());

    if(!isCorrectLetter) {
      return "incorrect-letter"
    }
    const letterInThatPosition = word.charAt(index);
    const isCorrectPosition = 
      letter.toLowerCase() === letterInThatPosition.toLowerCase();

    if(isCorrectPosition) {
      return "correct-letter-in-place";
    }

    const isGuessedMoreThanOnce =
      currWordArr.filter((l) => l === letter).length > 1;

    if (!isGuessedMoreThanOnce) {
      return "correct-letter";
    }

    const existsMoreThanOnce =
      word.split("").filter((l) => l === letter).length > 1;

    // is guessed more than once and exists more than once
    if (existsMoreThanOnce) {
      return "correct-letter";
    }

    const hasBeenGuessedAlready = currWordArr.indexOf(letter) < index;

    const indices = getIndicesOfLetter(letter, word.split(""));
    const otherIndices = indices.filter((i) => i !== index);
    const isGuessedCorrectlyLater = otherIndices.some(
      (i) => i > index && currWordArr[i] === letter
    );

    if (!hasBeenGuessedAlready && !isGuessedCorrectlyLater) {
      return "correct-letter";
    }

    return "incorrect-letter";
  }
    
   function getIndicesOfLetter(letter, arr) {
    var indices = [];
    let idx = arr.indexOf(letter);
    while (idx != -1) {
      indices.push(idx);
      idx = arr.indexOf(letter, idx + 1);
    }
    return indices;
  }
  
  //initializes local storage
   function initLocalStorage() {
    const storedCurrentWordIndex = window.localStorage.getItem("currentWordIndex");
    if (!storedCurrentWordIndex) {
    window.localStorage.setItem("currentWordIndex", currentWordIndex);
    } else {
      currentWordIndex = Number(storedCurrentWordIndex);
    }
  }

  //fetching everything from local storage
  function loadLocalStorage() {
    currentWordIndex = Number(window.localStorage.getItem("currentWordIndex")) ||
      currentWordIndex;
    guessWordCount = Number(window.localStorage.getItem("guessWordCount")) ||
      guessWordCount;
    availableSpace = Number(window.localStorage.getItem("availableSpace")) || availableSpace;
    guessedWords = JSON.parse(window.localStorage.getItem("guessedWords")) || guessedWords;

    word = window.localStorage.getItem("word") || word
    
    var storedBoardContainer = window.localStorage.getItem("boardContainer");
    if (storedBoardContainer) {
      document.getElementById("board-container").innerHTML = storedBoardContainer
    }

    
    var storedKeyboardContainer = window.localStorage.getItem("keyboardContainer")
    if(storedKeyboardContainer) {
      document.getElementById("keyboard-container").innerHTML = storedKeyboardContainer
    }
    addKeyboardClicks()
    // getNewWord()
  }

  
   function updateWordIndex() {
    console.log({ currentWordIndex });
    window.localStorage.setItem("currentWordIndex", currentWordIndex + 1);
  }

  function updateTotalGames() {
    var totalGames = window.localStorage.getItem("totalGames") || 0;
    window.localStorage.setItem("totalGames", Number(totalGames) + 1);
  }

   function showResult() {
     // if no wins assigns it to zero
    var totalWins = window.localStorage.getItem("totalWins") || 0;
     //converts to number incase there is stored value which would be a string
    window.localStorage.setItem("totalWins", Number(totalWins) + 1);

    var currentStreak = window.localStorage.getItem("currentStreak") || 0;
    window.localStorage.setItem("currentStreak", Number(currentStreak) + 1);
  }

  function showLosingResult() {
    //sets current streak back to zero if loss
    window.localStorage.setItem("currentStreak", 0);
  }

  function saveGame() {
    //converts array to strin to save words
    window.localStorage.setItem("guessedWords", JSON.stringify(guessedWords));

    var boardContainer = document.getElementById("board-container");
    window.localStorage.setItem("boardContainer", boardContainer.innerHTML)
    
    var keyboardContainer = document.getElementById("keyboard-container")
    window.localStorage.setItem("keyboardContainer", keyboardContainer.innerHTML)
  }

  function resetGame() {
    window.localStorage.removeItem("guessWordCount")
    window.localStorage.removeItem("guessedWords")
    window.localStorage.removeItem("keyboardContainer")
    window.localStorage.removeItem("boardContainer")
    window.localStorage.removeItem("availableSpace")
  }

  
//tells number of guessed words
function getCurrWordArr() {
  var numOfGuessedWords = guessedWords.length
  //returns updated array
  return guessedWords[numOfGuessedWords - 1]
}
  
  function updateGuess(letter) {
    var currWordArr = getCurrWordArr()
    //checking to make sure 5 letters isn't filled in
    if(currWordArr && currWordArr.length < 5) {
      currWordArr.push(letter)
    //getting element that matches ID
      var availableSpaceEL = document.getElementById(String(availableSpace))
      availableSpace = availableSpace + 1

      availableSpaceEL.textContent = letter;
    }
  }
  

  function handleSubmitWord() {
    var currWordArr = getCurrWordArr();

    //Id of first letter in word being typed - each individual square has id fro 1-30
    var firstLetterId = guessWordCount * 5 + 1
    
    localStorage.setItem("availableSpace", availableSpace)
    
    var currentWord = currWordArr.join("")
    
    fetch(`https://wordsapiv1.p.rapidapi.com/words/${currentWord}`, {
        method: "GET",
        headers: {
          "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
          "x-rapidapi-key": "bd32c8dcaemshb6f31c38cd6129cp103738jsn81158984c1a4",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw Error();
          }

      var interval = 200;
      currWordArr.forEach((letter, index) => {
        setTimeout(() => {
          var tileClass = getTileClass(letter, index, currWordArr)
          if (tileClass) {
            var letterId = firstLetterId + index
            var letterEl = document.getElementById(letterId)
            letterEl.classList.add("animate__flipInX")
            letterEl.classList.add(tileClass)
            var keyboardEl = document.querySelector(`[data-key=${letter}]`)
            keyboardEl.classList.add(tileClass)
          }
          if (index === 4) {
            saveGame()
          }
        }, index * interval)
      })
          
        guessWordCount +=1
        window.localStorage.setItem("guessWordCount", guessWordCount)

         if (currentWord === word) {
        setTimeout(() => {
          var okSelected = window.confirm("Well done!");
          if (okSelected) {
            showResult()
            updateWordIndex()
            updateTotalGames()
            resetGame()
            getNewWord()
          }
          return;
        }, 1200);
      }
          
        if (currWordArr.length !== 5) {
          window.alert("Word must be 5 letters");
        }
    
         if (guessedWords.length === 6 && currentWord !== word) {
        setTimeout(() => {
          var okSelected = window.confirm(
            `Sorry, you have no more guesses! The word is 
 "${word.toUpperCase()}".`
          );
          if (okSelected) {
            showLosingResult()
            updateWordIndex()
            updateTotalGames()
            resetGame()
            getNewWord()
          }
          return;
        }, 1200);
      }
        
        guessedWords.push([])
    })
    .catch(() => {
        window.alert("Word is not recognised!");
      });
  }

  
  function handleDeleteLetter() {
    var currentWordArr = getCurrWordArr();
    var removedLetter = currentWordArr.pop();

    guessedWords[guessedWords.length - 1] = currentWordArr;

    var lastLetterEl = document.getElementById(String(availableSpace - 1));

    lastLetterEl.textContent = "";
    availableSpace = availableSpace - 1;
  }

  function initHelpModal() {
    var modal = document.getElementById("help-modal");

    // Get the button that opens the modal
    var btn = document.getElementById("help");

    // Get the <span> element that closes the modal
    var span = document.getElementById("close-help");

     // When the user clicks on the button, open the modal
    btn.addEventListener("click", function () {
      modal.style.display = "block";
    });

    // When the user clicks on <span> (x), close the modal
    span.addEventListener("click", function () {
      modal.style.display = "none";
    });

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener("click", function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    });
  }

   function initStatsModal() {
    var modal = document.getElementById("stats-modal");

    // Get the button that opens the modal
    var btn = document.getElementById("stats");

    // Get the <span> element that closes the modal
    var span = document.getElementById("close-stats");

    // When the user clicks on the button, open the modal
    btn.addEventListener("click", function () {
      updateStatsModal();
      modal.style.display = "block";
    });

    // When the user clicks on <span> (x), close the modal
    span.addEventListener("click", function () {
      modal.style.display = "none";
    });

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener("click", function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    });
   }

  function updateStatsModal() {
    var currentStreak = window.localStorage.getItem("currentStreak");
    var totalWins = window.localStorage.getItem("totalWins");
    var totalGames = window.localStorage.getItem("totalGames");

    document.getElementById("total-played").textContent = totalGames;
    document.getElementById("total-wins").textContent = totalWins;
    document.getElementById("current-streak").textContent = currentStreak;

    var winPct = Math.round((totalWins / totalGames) * 100) || 0;
    document.getElementById("win-pct").textContent = winPct;
  }
  
})
