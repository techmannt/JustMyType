$(document).ready(function () {
  $('#keyboard-upper-container').toggle();

  let sentences = ['ten ate neite ate nee enet ite ate inet ent eate', 'Too ato too nOt enot one totA not anot tOO aNot', 'oat itain oat tain nate eate tea anne inant nean', 'itant eate anot eat nato inate eat anot tain eat', 'nee ene ate ite tent tiet ent ine ene ete ene ate'];
  let currentSentence = 0;
  $('#sentence').append(sentences[currentSentence]);
  let letterIndex = 0;
  let numberKeysPressed = 0;
  let gameOver = false;
  const startPos = $('#yellow-block').offset().left;
  $('#target-letter').text(sentences[currentSentence].charAt(letterIndex));
  let numberOfMistakes = 0;
  let startMinutes;

  $(document).keypress(function (e) {

    if (gameOver === false) {

      if (numberKeysPressed === 0) {
        const dateStart = new Date();
        startMinutes = dateStart.getMinutes();
      }
      numberKeysPressed++;
      let letterToHighlight = "#" + e.which;  // Append # to the "key code" that was pressed so that we can make an ID out of it.
      $(letterToHighlight).css("background-color", "yellow");  // Highlight the letter being pressed.

      $(document).keyup(function (e) {
        if (e.which === 16) {  // If a SHIFT key is pressed, then toggle the keyboard.
          toggleKeyboards();
        } else {
          $(letterToHighlight).css("background-color", "white");  // Once the key has been let up, then de-highlight it!
        }
      })

      if (currentSentence <= sentences.length - 1) {  // Check to see if we are within the bounds of the sentences array.
        if (letterIndex < sentences[currentSentence].length - 1) {  // Check to see if the letterIndex is within bounds of the (sentence length - 1).
          if (sentences[currentSentence].charCodeAt(letterIndex) === e.which) {  // If the correct key was typed...

            letterIndex++;
            $('#target-letter').text(sentences[currentSentence].charAt(letterIndex));
            $('#feedback').append('<span class="glyphicon glyphicon-ok"></span>');
            let yellowBlockXPos = $('#yellow-block').offset().left;
            let nextChar = 18 + yellowBlockXPos;  // 18 looks to be the width of characters.
            $('#yellow-block').offset({ left: nextChar });
            yellowBlockXPos = $('#yellow-block').offset().left;

          } else {  // An incorrect character was entered.
            $('#feedback').append('<span class="glyphicon glyphicon-remove"></span>');
            numberOfMistakes++;
          }
        }
        else {  // Reset to beginning of next sentence since the letter highlight is at the end of the sentence.
          currentSentence++;
          moveToNextLine();
        }
      }
    } else {
      resetGame();
    }
  })

  $(document).keydown(function (e) {
    if (e.which === 16) {  // If a SHIFT key is pressed down, then toggle the keyboard.
      toggleKeyboards();
    }
  })

  function toggleKeyboards() {
    $('#keyboard-upper-container').toggle();
    $('#keyboard-lower-container').toggle();
  }

  function moveToNextLine() {
    if (currentSentence < sentences.length) {
      letterIndex = 0;
      $('#yellow-block').offset({ left: startPos });
      $('#sentence').text(sentences[currentSentence]);
      $('#feedback').text('');
      $('#target-letter').text(sentences[currentSentence].charAt(letterIndex));

    } else {
      computeWPM();
    }
  }

  function resetGame() {
    currentSentence = 0;
    letterIndex = 0;
    $('#yellow-block').offset({ left: startPos });
    $('#sentence').text(sentences[currentSentence]);
    $('#feedback').text('');
    gameOver = false;
  }

  function computeWPM() {
    const dateEnd = new Date();
    const endMinutes = dateEnd.getMinutes();
    let numberOfMinutes = endMinutes - startMinutes;
    let wpm = (54 / numberOfMinutes) - (2 * numberOfMistakes);
    $('#sentence').text('Ran out of sentences! Your words per minute is: ' + wpm);
    gameOver = true;
    setTimeout(function () {
      let playAgainPrompt = prompt("Play again?");
      if (playAgainPrompt === "Y" || playAgainPrompt === "y") {
        resetGame();
      }
    }, 5000);
  }

})
