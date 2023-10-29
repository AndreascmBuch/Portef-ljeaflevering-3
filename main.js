document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let width = 10
    let cookieAmount = 20
    let flags = 0
    let squares = [];
    let isGameOver = false;

    function createBoard() {
        const cookiesAmount = Array(cookieAmount).fill('cookie')
        const emptyArray = Array(width * width - cookieAmount).fill('valid')
        const gameArray = emptyArray.concat(cookiesAmount)
        const shuffledGameArray = gameArray.sort(() => Math.random() - 0.5)

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(shuffledGameArray[i])
            grid.appendChild(square)
            squares.push(square)

            // normal click
            square.addEventListener('click', function (e) {
                click(square)
            })
            //cntrl and left click
            square.oncontextmenu = function (e) {
                e.preventDefault()
                addFlag(square)
            }
        }


        // add numbers
        for (let i = 0; i < squares.length; i++) {
            let total = 0;
            const isLeftEdge = (i % width === 0)
            const isRightEdge = (i % width === width - 1)

            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('cookie')) total++
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('cookie')) total++
                if (i > 10 && squares[i - width].classList.contains('cookie')) total++
                if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('cookie')) total++
                if (i < 98 && !isRightEdge && squares[i + 1].classList.contains("cookie")) total++
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains("cookie")) total++
                if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains("cookie")) total++
                if (i < 89 && squares[i + width].classList.contains('cookie')) total++
                squares[i].setAttribute('data', total)
            }


        }
    }

    createBoard()

/// ad flag in the game
    function addFlag(square) {
        if (isGameOver) return
        if ((!square.classList.contains('checked')) && (flags <= cookieAmount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag')
                square.innerHTML = '🚩'
                flags++;
                checkForWin()
            } else {
                square.classList.remove('flag')
                square.innerHTML = '';
                flags--;
            }

        }
    }

    // click on square actions
    function click(square) {
        let currentId = square.id;
        if (isGameOver) return
        if (square.classList.contains('checked') || square.classList.contains('flag')) return
        if (square.classList.contains('cookie')) {
            gameOver(square)
        } else {
            let total = square.getAttribute('data')
            if (total != 0) {
                square.innerHTML = total
                return
            }
            checkSquare(square, currentId)
        }
        square.classList.add('checked')
    }

    // recursive clicks, so one click checks squares=0
    function checkSquare(square, currentId) {
        if (isGameOver) return;

        const isLeftEdge = (currentId % width === 0);
        const isRightEdge = (currentId % width === width - 1);

        if (currentId > 0 && !isLeftEdge) {
            const newId = currentId - 1;
            const newSquare = squares[newId];
            click(newSquare);
        }

        if (currentId < 0 || isLeftEdge || isRightEdge) {
        }
    }

    function gameOver() {
        console.log('Game over!')
        isGameOver = true
        window.alert('Game Over!');
        // show where the cookies are!
        squares.forEach(square => {
            if (square.classList.contains('cookie')) {
                square.innerHTML = '🍪'
            }
        })
    }

// Winning conditions for the game
    function checkForWin() {
        let matches = 0;
        squares.forEach(square => {
            if (square.classList.contains('flag') && square.classList.contains('cookie')) {
                matches++;
            }
        });

        if (matches === cookieAmount) {
            console.log('You win!');
            window.alert('You win!');
            isGameOver = true;
        }
    }

    // restart button in the game
    function restartGame() {
        isGameOver = false;
        flags = 0;
        const grid = document.querySelector('.grid')
        grid.innerHTML = '';
        createBoard();
    }

    const restartButton = document.getElementById('restart-button')
    restartButton.addEventListener('click', restartGame)

    // Define the initial time limit (in seconds)
    let timeLimit = 600; // 5 minutes

// Display the initial time limit
    const timerDisplay = document.querySelector('#time-left');
    timerDisplay.textContent = formatTime(timeLimit);

// Start the timer
    const timerInterval = setInterval(() => {
        timeLimit--;
        timerDisplay.textContent = formatTime(timeLimit);

        if (timeLimit <= 0) {
            clearInterval(timerInterval);
            gameOver(); // Call a function to end the game (player loses)
        }
    }, 1000); // Update every second

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }


})