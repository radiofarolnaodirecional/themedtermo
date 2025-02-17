document.addEventListener('DOMContentLoaded', async () => {

    function printl(t) {
        console.log(t)
    }

    var inputLetter = document.querySelectorAll('.input-letter')
    var letter = document.querySelectorAll('.letter')
    var letter2 = document.querySelectorAll('.letter2')
    var letter3 = document.querySelectorAll('.letter3')

    var ctrlPressed = false

    const wl_req = await fetch(`/api/word-list/theme_${theme}`).then(r => r.json())

    const word_list = wl_req.word_list

    const word_list_theme = wl_req.word_list_theme

    const word_correct1 = word_list_theme[wl_req.word4]
    const word_correct2 = word_list_theme[wl_req.word5]
    const word_correct3 = word_list_theme[wl_req.word6]

    const dateR = await fetch(`/date-time`).then(r => r.json())

    var attempts = 0

    var column1CorrectFreeze = false
    var wonCol1 = false
    var column2CorrectFreeze = false
    var wonCol2 = false
    var column3CorrectFreeze = false
    var wonCol3 = false

    var word_place_right = []
    var word_place_right2 = []
    var word_place_right3 = []

    function inputLetterFunc() {
        inputLetter.forEach((el, i) => {
            el.addEventListener('keydown', (e)=>{
                //printl(e)
                e.preventDefault()

                if (/^[a-zA-ZçÇ]$/.test(e.key)) {
                    el.value = e.key
                    if (!column1CorrectFreeze) {
                        letter[i].textContent = e.key
                    }
                    if (!column2CorrectFreeze) {
                        letter2[i].textContent = e.key
                    }
                    if (!column3CorrectFreeze) {
                        letter3[i].textContent = e.key
                    }

                    if (inputLetter[i+1]) {
                        inputLetter[i+1].focus()
                    }
                }
                
                if (e.key == 'Backspace') {
                    // delete all if ctrl is pressed
                    if (ctrlPressed) {
                        inputLetter.forEach((el) => {el.value = ''})
                        letter.forEach((el) => {el.textContent = ''})
                        letter2.forEach((el) => {el.textContent = ''})
                        letter3.forEach((el) => {el.textContent = ''})
                        inputLetter[0].focus()
                    } else {
                        el.value = ''
                        letter[i].textContent = ''
                        letter2[i].textContent = ''
                        letter3[i].textContent = ''
                        if (inputLetter[i-1]) {
                            inputLetter[i-1].focus()
                        }
                    }
                }

                if (e.key == ' ') {
                    if (inputLetter[i+1]) {
                        inputLetter[i+1].focus()
                    }
                }
                
                if (e.key == 'ArrowLeft') {
                    if (inputLetter[i-1]) {
                        inputLetter[i-1].focus()
                    }
                }
                if (e.key == 'ArrowRight') {
                    if (inputLetter[i+1]) {
                        inputLetter[i+1].focus()
                    }
                }

                if (e.key == 'Control') {
                    ctrlPressed = true
                }

            })

            el.addEventListener('keyup', (e) => {
                if (e.key == 'Control') {
                    ctrlPressed = false
                }
            })

            // add focus style to the divs
            el.addEventListener('focus', () => {
                if (!column1CorrectFreeze) {
                    letter[i].classList.add('foc')
                }
                if (!column2CorrectFreeze) {
                    letter2[i].classList.add('foc')
                }
                if (!column3CorrectFreeze) {
                    letter3[i].classList.add('foc')
                }
            })
            el.addEventListener('blur', () => {
                letter[i].classList.remove('foc')
                letter2[i].classList.remove('foc')
                letter3[i].classList.remove('foc')
            })

        })
    }
    inputLetterFunc()

    // focus input on letter click
    function letterFocusInput() {
        letter.forEach((el, i) => {
            el.addEventListener('click', letterFocusListener =  () => {
                if (i < 5) {
                    inputLetter[i].focus()
                // if click on second column
                } else if (i >= 5 && i < 11) {
                    var val = i - 5
                    inputLetter[val].focus()
                } else if (i > 9) {
                    var val = i - 10
                    printl(val)
                    inputLetter[val].focus()
                }
            })
        })
    }
    letterFocusInput()

    // lose game
    function lose() {
        document.querySelector('.container-win-modal').classList.add('win-modal-container-appear')
        document.querySelector('.win-modal').classList.add('win-modal-appear')
        document.querySelector('.win-result-txt').textContent = ':('
        document.querySelector('.win-word-1').textContent = word_correct1
        document.querySelector('.win-word-2').textContent = word_correct2
        document.querySelector('.win-word-3').textContent = word_correct3
        document.querySelector('.span-attempts').textContent = ''

        localStorage.setItem(`${dateR.date}_${theme}_3`, [false, word_correct1, word_correct2, word_correct3])
    }

    function getWordFromInputs() {

        var word_player = ''

        inputLetter.forEach((char) => {
            word_player += char.value.toLowerCase()
        })

        return word_player
    }

    function getCurrentRow() {
        letter = document.querySelectorAll('.letter')
        var rowClass = [...letter[0].classList].find(cls => cls.startsWith('row-'))
        return rowClass ? rowClass.split('-')[1] : null
    }

    function checkLetters(wordInput, correctWord, elements, column, word_place_rightv) {
        var correctLetterCount = {}
        for (let char of correctWord) {
            correctLetterCount[char] = (correctLetterCount[char] || 0) + 1
        }
    
        var markedLetters = {}
        var correctPositions = {}
    
        elements.forEach((el, idx) => {
            el.classList.remove('foc', 'letter', 'letter2', 'letter3')
            el.classList.add('letter-guess2')
    
            var char = wordInput[idx]
    
            if (char === correctWord[idx]) {
                el.classList.add('letter-correct-letter-and-place')
                correctPositions[char] = (correctPositions[char] || 0) + 1
            }
        })
    
        elements.forEach((el, idx) => {
            var char = wordInput[idx]
    
            if (char !== correctWord[idx] && correctWord.includes(char)) {
                markedLetters[char] = (markedLetters[char] || 0) + 1
    
                if ((correctPositions[char] || 0) + markedLetters[char] <= correctLetterCount[char]) {
                    el.classList.add('letter-correct-letter')
                }
            }
    
            // colors to virtual keyboard
            var word_input =  getWordFromInputs()
            document.querySelectorAll(`.keyb-key-${column}`).forEach((elm) => {
                var keybKey = [...elm.classList].find(cls => cls.startsWith('keyboard-'))
                if (word_input[idx] == keybKey.split('-')[1]) {
                    if (correctWord.includes(keybKey.split('-')[1])) {
                        if (!word_place_rightv.includes(word_input[idx])) {
                            elm.style.color = 'orange'
                        }
                    } else {
                        elm.style.color = 'grey'
                    }
                    if (keybKey.split('-')[1] == correctWord[idx]) {
                        elm.style.color = 'green'
                        word_place_rightv.push(correctWord[idx])
                    }
                }
            })
    

        })
    
    }
    
    function goToNextRow() {
        if (attempts >= 7) {
            lose()
            return
        }
    
        var currentRow = getCurrentRow()
        var nextRow = parseInt(currentRow) + 1
        var wordInput = getWordFromInputs()
    
        var lettersCurrentRow1 = document.querySelectorAll(`.row-${currentRow}.col1`)
        var lettersCurrentRow2 = document.querySelectorAll(`.row-${currentRow}.col2`)
        var lettersCurrentRow3 = document.querySelectorAll(`.row-${currentRow}.col3`)
        
        if (!column1CorrectFreeze) {
            checkLetters(wordInput, word_correct1, lettersCurrentRow1, 1, word_place_right)
        }

        if (!column2CorrectFreeze) {
            checkLetters(wordInput, word_correct2, lettersCurrentRow2, 2, word_place_right2)
        }

        if (!column3CorrectFreeze) {
            checkLetters(wordInput, word_correct3, lettersCurrentRow3, 3, word_place_right3)
        }
    
        if (!column1CorrectFreeze) {
            document.querySelectorAll(`.row-${nextRow}.col1`).forEach((el) => {
                el.classList.remove('letter-unactive')
                el.classList.add('letter')
            })
        } else {
            if (wonCol1 == false) {
                document.querySelectorAll(`.row-${currentRow}.col1`).forEach((el) => {
                    el.classList.remove('letter', 'foc')
                    el.classList.add('letter-unactive', 'letter-correct-letter-and-place')
                    const newEl = el.cloneNode(true)
                    el.parentNode.replaceChild(newEl, el)
                })
            }
            wonCol1 = true
        }

        if (!column2CorrectFreeze) {
            document.querySelectorAll(`.row-${nextRow}.col2`).forEach((el) => {
                el.classList.remove('letter-unactive')
                el.classList.add('letter', 'letter2')
            })
        } else {
            if (wonCol2 == false) {
                document.querySelectorAll(`.row-${currentRow}.col2`).forEach((el) => {
                    el.classList.remove('letter', 'letter2', 'foc')
                    el.classList.add('letter-unactive', 'letter-correct-letter-and-place')
                    const newEl = el.cloneNode(true)
                    el.parentNode.replaceChild(newEl, el)
                })
            }
            wonCol2 = true
        }

        if (!column3CorrectFreeze) {
            document.querySelectorAll(`.row-${nextRow}.col3`).forEach((el) => {
                el.classList.remove('letter-unactive')
                el.classList.add('letter', 'letter3')
            })
        } else {
            if (wonCol3 == false) {
                document.querySelectorAll(`.row-${currentRow}.col3`).forEach((el) => {
                    el.classList.remove('letter', 'letter3', 'foc')
                    el.classList.add('letter-unactive', 'letter-correct-letter-and-place')
                    const newEl = el.cloneNode(true)
                    el.parentNode.replaceChild(newEl, el)
                })
            }
            wonCol3 = true
        }

        inputLetter = document.querySelectorAll(`.input-letter`)
        letter = document.querySelectorAll('.letter')
        letter2 = document.querySelectorAll('.letter2')
        letter3 = document.querySelectorAll('.letter3')
    
        inputLetterFunc()
        letterFocusInput()
    
        if (inputLetter[0]) {
            inputLetter[0].focus()
        }
    
        inputLetter.forEach((el) => {
            el.value = ''
        })
    
        attempts++
    }

    function stringNormal(word) {
        /*
        á=a, í=i ...
        */
        return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    }

    function validateWord() {

        const word_input = getWordFromInputs()

        if (word_input.length < 5 || !word_list.map(stringNormal).includes(word_input) && !word_list_theme.map(stringNormal).includes(word_input)) {
            flashMsg("palavra inválida")
            return false
        }

        if (word_input == stringNormal(word_correct2)) {
            column2CorrectFreeze = true
        }
        if (word_input == stringNormal(word_correct1)) {
            column1CorrectFreeze = true
        }
        if (word_input == stringNormal(word_correct3)) {
            column3CorrectFreeze = true
        }

        if (column1CorrectFreeze == true && column2CorrectFreeze == true && column3CorrectFreeze == true) {
            document.querySelector('.container-win-modal').classList.add('win-modal-container-appear')
            document.querySelector('.win-modal').classList.add('win-modal-appear')
            document.querySelector('.win-result-txt').textContent = 'Correto!'
            document.querySelector('.win-word-1').textContent = word_correct1
            document.querySelector('.win-word-2').textContent = word_correct2
            document.querySelector('.win-word-3').textContent = word_correct3
            document.querySelector('.span-attempts').textContent = `${attempts + 1} tentativas.`
            localStorage.setItem(`${dateR.date}_${theme}_3`, [true, word_correct1, word_correct2, word_correct3])
            return false
        }
        return true

    }

    function flashMsg(txt) {
        const flashEl = document.querySelector('.js-flash')
        flashEl.textContent = txt
        flashEl.classList.add('js-flash-appear')
        setTimeout(() => {flashEl.classList.remove('js-flash-appear')}, 2000)
    }

    // Enter key
    document.addEventListener('keydown', (e) => {
        if (e.key == 'Enter') {
            // validate here
            if (validateWord() == true) {
                goToNextRow()
            }
        }
    })

    // switch keyboard
    const keyboard_1 = document.querySelector('.keyboard-1')
    const keyboard_2 = document.querySelector('.keyboard-2')
    const keyboard_3 = document.querySelector('.keyboard-3')
    var keyboardState = 0
    document.querySelector('.btn-change-keyboard').addEventListener('click', tglKeyboard)
    document.querySelector('.btn-change-keyboard2').addEventListener('click', tglKeyboard)
    document.querySelector('.btn-change-keyboard3').addEventListener('click', tglKeyboard)

    function tglKeyboard() {

        keyboardState ++

        if (keyboardState > 2) {
            keyboardState = 0
        }

        if (keyboardState === 0) {
            keyboard_1.style.display = 'flex'
            keyboard_2.style.display = 'none'
            keyboard_3.style.display = 'none'
        } else if (keyboardState === 1) {
            keyboard_1.style.display = 'none'
            keyboard_2.style.display = 'flex'
            keyboard_3.style.display = 'none'
        } else if (keyboardState === 2) {
            keyboard_1.style.display = 'none'
            keyboard_2.style.display = 'none'
            keyboard_3.style.display = 'flex'
        }
    }
})
