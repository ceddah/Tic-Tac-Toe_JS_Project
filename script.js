//Add option to change Names for P1 and P2 but let P1 and P2 be default if they are not changed.
//Link first and section page with click event
const gameSettings = (() => {
    const createPlayer = (name, mark, turn) => {
        return {name,
                mark,
                turn,
                changeTurns() {
                    this.turn = !this.turn
        }}
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

    const gameStart = () => {
        selections.forEach(button => {
            if(button.classList.contains('selected')) {
                document.body.classList.add('active');
            }
        })
    }

    const selections = document.querySelectorAll('.options button');
        selections.forEach(button => button.addEventListener('click', (e) => {
            selections.forEach(button => button.classList.remove('selected'));
            e.target.classList.add('selected');
        }))

    const startButton = document.querySelector('.game-start');
    startButton.addEventListener('click', gameStart);

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

    const markField = (e) => {
        const index = e.target.dataset.id;
        turnsLeft -= 1;
        e.currentTarget.classList.add('occupied');
        
        if(gameSettings.Player1.turn === true && gameSettings.Player2.turn === false) {
            // e.currentTarget.innerHTML = gameSettings.Player1.mark;
            e.currentTarget.innerHTML = `<span>${gameSettings.Player1.mark}</span>`;
            gameSettings.Player1.changeTurns()
            gameSettings.Player2.changeTurns();
            gameSettings.board[index] = gameSettings.Player1.mark;
            turnElement.innerHTML = "Player 2's turn:"
        } else {
            // e.currentTarget.innerHTML = gameSettings.Player2.mark;
            e.currentTarget.innerHTML = `<span>${gameSettings.Player2.mark}</span>`;
            gameSettings.Player1.changeTurns()
            gameSettings.Player2.changeTurns();
            gameSettings.board[index] = gameSettings.Player2.mark;
            turnElement.innerHTML = "Player 1's turn:"
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
            case 'Player1':
                finalMessage = 'Player 1 has won!';
                break;
            case 'Player2':
                finalMessage = 'Player 2 has won!';
                break;
            default:
                finalMessage = 'Game is Tied.'
                break; 
        }
    }

    const highLightCombo = (combination, fields, winner) => {
        if(winner === 'Player1') {
            combination.forEach(combo => fields[combo].classList.add('player1Won'));
        } else if (winner === 'Player2'){
            combination.forEach(combo => fields[combo].classList.add('player2Won'));
        } else { 
            return 
        }
    }

    //Checking if X or O are placed in any of the winning cominations
    const checkForWinner = () => {
        gameSettings.winningCombination.forEach(combo => {
            if(gameSettings.board[combo[0]] === gameSettings.Player1.mark && gameSettings.board[combo[1]] === gameSettings.Player1.mark && gameSettings.board[combo[2]] === gameSettings.Player1.mark) {
                winner = gameSettings.Player1;
                setFinalMessage(winner.name);
                declareWinner();
                highLightCombo(combo, fields, winner.name);
            } else if(gameSettings.board[combo[0]] === gameSettings.Player2.mark && gameSettings.board[combo[1]] === gameSettings.Player2.mark && gameSettings.board[combo[2]] === gameSettings.Player2.mark) {
                winner = gameSettings.Player2;
                setFinalMessage(winner.name);
                declareWinner();
                highLightCombo(combo, fields, winner.name);
            } else if(turnsLeft < 1){
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
        turnElement.innerHTML = "Player 1's turn:"
        turnElement.classList.remove('hidden');
        gameSettings.Player1.turn = true;
        gameSettings.Player2.turn = false;
    }

    const resetBtn = document.querySelector('.reset');
    resetBtn.addEventListener('click', () => {
        gameRestart();
        fields.forEach(field => {
            field.innerHTML = '';
            field.classList.remove('occupied');
            field.classList.add('anim');
            field.classList.remove('player1Won');
            field.classList.remove('player2Won');
            turnsLeft = 9;
            setTimeout(() => {
                field.classList.remove('anim');
            }, 1000)
        });
    });

})()