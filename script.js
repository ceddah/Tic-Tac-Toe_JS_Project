//Add return/choose mark again button in second screen that returns to first screen
const gameSettings = (() => {
    const createPlayer = (name, mark, turn) => {
        return {name,
                mark,
                turn,
                changeTurns() {
                    this.turn = !this.turn
                }, changeName(newName) {
                        this.name = newName;
                }
        }
    };
    const Player1 = createPlayer('Player1', 'X', true);
    const Player2 = createPlayer('Player2', 'O', false);

    let board = [];
    //9 Empty Spaces on the board
    const newBoard = () => {
        for(let i = 0; i < 9; i++) {
            board[i] = '';
        }
    }
    newBoard();
   
    const winningCombination = [
        [0,1,2],
        [0,3,6],
        [3,4,5],
        [6,7,8],
        [1,4,7],
        [2,4,6],
        [2,5,8],
        [0,4,8]
    ];

    const Player1Input = document.querySelector('#player1Name');
    const Player2Input = document.querySelector('#player2Name');

    //Choose who starts the game first and Change default names
    const startGame = () => {
        selections.forEach(button => {
            if(button.classList.contains('selected') && Player1Input.value !== '' && Player2Input.value !== '') {
                document.body.classList.add('active');
                Player1.changeName(Player1Input.value);
                Player2.changeName(Player2Input.value);
                document.querySelector('.turn').innerHTML = `${Player1.name}'s turn:`
                if(button.textContent === 'O') {
                    Player1.changeTurns();
                    Player2.changeTurns();
                    document.querySelector('.turn').innerHTML = `${Player2.name}'s turn:`
                }
            } 
        })
    }
    //Event Listener for Selecting your Mark
    const selections = document.querySelectorAll('.options button');
        selections.forEach(button => button.addEventListener('click', (e) => {
            selections.forEach(button => button.classList.remove('selected'));
            e.target.classList.add('selected');
        }))

    const startButton = document.querySelector('.game-start');
    startButton.addEventListener('click', startGame);

    return {board, Player1, Player2, winningCombination, newBoard}
})()

const gameController = (() => {
    let turnsLeft = 9;
    let winner = undefined;
    let finalMessage = undefined;

    const endGameEl = document.querySelector('.end-message');
    const boardElement = document.querySelector('.board');
    const fields = document.querySelectorAll('.board .field');
    const turnElement = document.querySelector('.turn');

    fields.forEach(field => field.addEventListener('click', (event) => {
        markField(event)
    }));

    //What happends when we click on the board
    const markField = (e) => {
        const index = e.target.dataset.id;
        turnsLeft -= 1;
        e.currentTarget.classList.add('occupied');
        
        if(gameSettings.Player1.turn === true && gameSettings.Player2.turn === false) {
            e.currentTarget.innerHTML = `<span>${gameSettings.Player1.mark}</span>`;
            gameSettings.Player1.changeTurns()
            gameSettings.Player2.changeTurns();
            gameSettings.board[index] = gameSettings.Player1.mark;
            turnElement.innerHTML = `${gameSettings.Player2.name}'s turn:`;
        } else {
            e.currentTarget.innerHTML = `<span>${gameSettings.Player2.mark}</span>`;
            gameSettings.Player1.changeTurns()
            gameSettings.Player2.changeTurns();
            gameSettings.board[index] = gameSettings.Player2.mark;
            turnElement.innerHTML = `${gameSettings.Player1.name}'s turn:`;
        }
        checkForWinner();

    }

    const declareWinner = () => {
        endGameEl.querySelector('.victor').innerHTML = finalMessage;
        endGameEl.classList.remove('hidden');
        turnElement.classList.add('hidden');
    }

    const setFinalMessage = (winner) => {
        switch(winner) {
            case `${gameSettings.Player1.name}`:
                finalMessage = `${gameSettings.Player1.name} has won!`;
                break;
            case `${gameSettings.Player2.name}`:
                finalMessage = `${gameSettings.Player2.name} has won!`;
                break;
            default:
                finalMessage = 'Game is Tied.'
                break; 
        }
    }

    const highLightCombo = (combination, fields, winner) => {
        if(winner === 'X') {
            combination.forEach(combo => fields[combo].classList.add('redSideWins'));
        } else if (winner === 'O'){
            combination.forEach(combo => fields[combo].classList.add('blueSideWins'));
        } else { 
            return 
        }
    }

    //Checking if X or O are placed in any of the winning cominations
    const checkForWinner = () => {
        gameSettings.winningCombination.forEach(combo => {
            if(gameSettings.board[combo[0]] === gameSettings.Player1.mark && gameSettings.board[combo[1]] === gameSettings.Player1.mark && gameSettings.board[combo[2]] === gameSettings.Player1.mark) {
                winner = gameSettings.Player1;
                setFinalMessage(gameSettings.Player1.name);
                declareWinner();
                highLightCombo(combo, fields, winner.mark);
            } else if(gameSettings.board[combo[0]] === gameSettings.Player2.mark && gameSettings.board[combo[1]] === gameSettings.Player2.mark && gameSettings.board[combo[2]] === gameSettings.Player2.mark) {
                winner = gameSettings.Player2;
                setFinalMessage(gameSettings.Player2.name);
                declareWinner();
                highLightCombo(combo, fields, winner.mark);
            } else if(turnsLeft < 1 && winner === undefined){
                winner = 'Tied'
                setFinalMessage(winner);
                declareWinner();
            }
        })
        if(winner !== undefined) {
            boardElement.classList.add('gameIsOver');
        }
    }


    const gameRestart = () => {
        gameSettings.newBoard();
        turnsLeft = 9;
        winner = undefined;
        finalMessage = undefined;
        boardElement.classList.remove('gameIsOver');
        endGameEl.classList.add('hidden');
        turnElement.innerHTML = `${gameSettings.Player1.turn === true ? gameSettings.Player1.name : gameSettings.Player2.name}'s turn:`;
        turnElement.classList.remove('hidden');
    }

    const playAgain = document.querySelector('.play-again-btn');
    playAgain.addEventListener('click', () => {
        gameRestart();
        fields.forEach(field => {
            field.innerHTML = '';
            field.classList.remove('occupied');
            field.classList.add('anim');
            field.classList.remove('redSideWins');
            field.classList.remove('blueSideWins');
            turnsLeft = 9;
            setTimeout(() => {
                field.classList.remove('anim');
            }, 1000)
        });
    });

})()