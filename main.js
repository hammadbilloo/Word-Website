document.addEventListener("DOMContentLoaded", () => {
  //when page loads it runs function
  createSquares()
  
  
  //array in array
  var guessedWords = [[]]
  //always one when initalized
  var availableSpace = 1


  // guessList = guessList.concat(wordList);

  let word = "audit";
  // word = wordList[Math.floor(Math.random()*wordList.length)].toUpperCase();
  // console.log(word);
  
  
  let guessWordCount = 0
  
  var keys = document.querySelectorAll(".keyboard-row button")

  function getTileColor(letter, index) {
    const corrLetter = word.includes(letter);

    if (!corrLetter) {
      return "rgb(58, 58, 60)";
    }

    const letterInPosition = word.charAt(index);
    const corrPosition = letter === letterInPosition;

    if (corrPosition) {
      return "rgb(83, 141, 78)";
    }

    return "rgb(181, 159, 59)";
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

  function handleSubmitWord() {
    var currWordArr = getCurrWordArr();

    //Id of first letter in word being typed - each individual square has id fro 1-30
    var firstLetterId = guessWordCount * 5 + 1

    var currentWord = currWordArr.join("")
    
    var interval = 200;
    currWordArr.forEach((letter, index) => {
      setTimeout(() => {
        var tileColor = getTileColor(letter, index)
        var letterId = firstLetterId + index
        var letterEl = document.getElementById(letterId)
        letterEl.classList.add("animate__flipInX")
        letterEl.style = `background-color:${tileColor};border-color:${tileColor}`
      }, interval * index)
    })

    guessWordCount +=1

    if(currentWord === word) {
      window.alert("congrats")
    }
    
    if (currWordArr.length !== 5) {
      window.alert("Word must be 5 letters");
    }

      if (guessedWords.length === 6) {
          window.alert(`Sorry, you have no more guesses! The word is ${word}.`);
        }
    
    guessedWords.push([])
  }

  function handleDeleteLetter() {
    const currentWordArr = getCurrWordArr();
    const removedLetter = currentWordArr.pop();

    guessedWords[guessedWords.length - 1] = currentWordArr;

    const lastLetterEl = document.getElementById(String(availableSpace - 1));

    lastLetterEl.textContent = "";
    availableSpace = availableSpace - 1;
  }

  for (let i = 0; i < keys.length; i++) {
    document.addEventListener('keyup', logKey);
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
    
  }
  function logKey(e) {
    let alpha = e.code
    console.log(alpha)

    if (alpha === 'Enter') {
      handleSubmitWord()
      return
    }
    if(alpha === 'Backspace') {
      handleDeleteLetter()
      return
    }
    else {
      let part = alpha.slice(3,)
      updateGuess(part)
    }
  }
})