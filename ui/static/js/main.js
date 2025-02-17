document.addEventListener('DOMContentLoaded', async () => {

    function printl(t) {
        console.log(t)
    }

    var inputLetter = document.querySelectorAll('.input-letter')
    var letter = document.querySelectorAll('.letter')

    var ctrlPressed = false

    const wl_req = await fetch(`/api/word-list/theme_${theme}`).then(r => r.json())

    const word_list = wl_req.word_list
    const word_list_theme = wl_req.word_list_theme

    const word_correct = word_list_theme[wl_req.word1]

    const dateR = await fetch(`/date-time`).then(r => r.json())

    var attempts = 0

    var word_place_right = []

    function inputLetterFunc() {
        inputLetter.forEach((el, i) => {
            el.addEventListener('keydown', (e)=>{
                //printl(e)
                e.preventDefault()

                if (/^[a-zA-ZçÇ]$/.test(e.key)) {
                    el.value = e.key
                    letter[i].textContent = e.key

                    if (inputLetter[i+1]) {
                        inputLetter[i+1].focus()
                    }
                }
                
                if (e.key == 'Backspace') {
                    // delete all if ctrl is pressed
                    if (ctrlPressed) {
                        inputLetter.forEach((el) => {
                            el.value = ''
                        })
                        letter.forEach((el) => {
                            el.textContent = ''
                        })
                        inputLetter[0].focus()
                    } else {
                        el.value = ''
                        letter[i].textContent = ''
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
                letter[i].classList.add('foc')
            })
            el.addEventListener('blur', () => {
                letter[i].classList.remove('foc')
            })

        })
    }
    inputLetterFunc()

    // focus input on letter click
    function letterFocusInput() {
        letter.forEach((el, i) => {
            el.addEventListener('click', letterFocusListener =  () => {
                inputLetter[i].focus()
            })
        })
    }
    letterFocusInput()

    // lose game
    function lose() {
        document.querySelector('.container-win-modal').classList.add('win-modal-container-appear')
        document.querySelector('.win-modal').classList.add('win-modal-appear')
        document.querySelector('.win-result-txt').textContent = ':('
        document.querySelector('.win-word-1').textContent = word_correct
        document.querySelector('.span-attempts').textContent = ''

        localStorage.setItem(`${dateR.date}_${theme}_1`, [false, word_correct])
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

    function goToNextRow() {

        if (attempts >= 5) {
            lose()
            return
        }

        var currentRow = getCurrentRow()
        var nextRow = parseInt(currentRow) + 1
        var word_input = getWordFromInputs()

        // Contar quantas vezes cada letra aparece na palavra correta
        var correctLetterCount = {}
        for (let char of word_correct) {
            correctLetterCount[char] = (correctLetterCount[char] || 0) + 1
        }

        // Controlar quantas vezes já marcamos a letra
        var markedLetters = {}
        var correctPositions = {}

        document.querySelectorAll(`.row-${currentRow}`).forEach((el, idx) => {
            el.classList.remove('foc', 'letter')
            el.classList.add('letter-guess')

            var char = word_input[idx];

            if (char === word_correct[idx]) {
                el.classList.add('letter-correct-letter-and-place');
                correctPositions[char] = (correctPositions[char] || 0) + 1;
            }
        })

        document.querySelectorAll(`.row-${currentRow}`).forEach((el, idx) => {

            let char = word_input[idx]

            if (char !== word_correct[idx] && word_correct.includes(char)) {
                markedLetters[char] = (markedLetters[char] || 0) + 1
    
                // Só marcamos como amarelo se a quantidade de acertos na posição correta + marcados amarelos
                // for menor ou igual à quantidade de vezes que a letra aparece na palavra correta
                if ((correctPositions[char] || 0) + markedLetters[char] <= correctLetterCount[char]) {
                    el.classList.add('letter-correct-letter')
                }
            }

            // colors to virtual keyboard
            document.querySelectorAll('.keyb-key').forEach((elm) => {
                var keybKey = [...elm.classList].find(cls => cls.startsWith('keyboard-'))
                if (word_input[idx] == keybKey.split('-')[1]) {
                    if (word_correct.includes(keybKey.split('-')[1])) {
                        if (!word_place_right.includes(word_input[idx])) {
                            elm.style.color = 'orange'
                        }
                    } else {
                        elm.style.color = 'grey'
                    }
                    if (keybKey.split('-')[1] == word_correct[idx]) {
                        elm.style.color = 'green'
                        word_place_right.push(word_correct[idx])
                    }
                }
            })
            
            const newEl = el.cloneNode(true)
            el.parentNode.replaceChild(newEl, el)

        })

        // add classes to new row
        document.querySelectorAll(`.row-${nextRow}`).forEach((el) => {
            el.classList.remove('letter-unactive')
            el.classList.add('letter')
        })

        inputLetter = document.querySelectorAll('.input-letter')
        letter = document.querySelectorAll('.letter')

        inputLetterFunc()
        letterFocusInput()

        // focus first input in row
        if (inputLetter[0]) {
            inputLetter[0].focus()
        }

        // empty inputs
        inputLetter.forEach((el) => {
            el.value = ''
        })

        attempts ++

    }

    // correct word guess
    function correctGuess() {
        var currentRow = getCurrentRow()

        document.querySelectorAll(`.row-${currentRow}`).forEach((el) => {
            el.classList.remove('letter', 'foc')
            el.classList.add('letter-unactive', 'letter-correct-letter-and-place')
            const newEl = el.cloneNode(true)
            el.parentNode.replaceChild(newEl, el)
            const winModalcta = document.querySelector('.container-win-modal')
            winModalcta.classList.add('win-modal-container-appear')
            const winModal = document.querySelector('.win-modal')
            winModal.classList.add('win-modal-appear')
            document.querySelector('.win-word-1').textContent = word_correct
            document.querySelector('.span-attempts').textContent = `${attempts + 1} tentativas`
        })
        localStorage.setItem(`${dateR.date}_${theme}_1`, [true, word_correct])
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
            return 'invalid'
        }

        if (word_input == stringNormal(word_correct)) {
            return true
        } else {
            return false
        }
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
                correctGuess()
            } else if (validateWord() == 'invalid') {
                flashMsg("palávra inválida")
            } else {
                goToNextRow()
            }
        }
    })
})
