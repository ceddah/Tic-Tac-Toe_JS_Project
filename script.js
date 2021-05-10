//Highlight Winning Combo when game is over
//Add option to change Names for P1 and P2 but let P1 and P2 be default if they are not changed.
//Make animation for when we click on a board, animate mark.
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
    
    let turnsLeft = 9;
    let winner = undefined;
    let finalMessage = undefined;
    let gameOver = false;

    let board = [];
    //9 Empty Spaces on the board
    const resetBoard = () => {
        for(let i = 0; i < turnsLeft; i++) {
            board[i] = '';
        }
    }
    resetBoard();

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

    const declareWinner = () => {
        const endGameEl = document.querySelector('.end-message');
        endGameEl.querySelector('.victor').innerHTML = finalMessage;
        endGameEl.classList.remove('hidden');
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

    //Checking if X or O are placed in any of the winning cominations
    const checkForWinner = () => {
        winningCombination.forEach(combo => {
            if(board[combo[0]] === Player1.mark && board[combo[1]] === Player1.mark && board[combo[2]] === Player1.mark) {
                winner = Player1;
                setFinalMessage(winner.name);
                declareWinner();
            } else if(board[combo[0]] === Player2.mark && board[combo[1]] === Player2.mark && board[combo[2]] === Player2.mark) {
                winner = Player2;
                setFinalMessage(winner.name);
                declareWinner();
            } else if(gameSettings.turnsLeft < 1){
                winner = 'Tied'
                setFinalMessage(winner);
                declareWinner();
            }
        })
    }

    return {board, Player1, Player2, turnsLeft, checkForWinner, winner}
})()

const gameController = (() => {
    const fields = document.querySelectorAll('.board .field');
    fields.forEach(field => field.addEventListener('click', (event) => {
        markField(event)
    }));


    const markField = (e) => {
        const index = e.target.dataset.id;
        gameSettings.turnsLeft -= 1;
        e.currentTarget.classList.add('occupied');
        console.log(gameSettings.winner)
        if(gameSettings.winner === undefined) {
            if(gameSettings.Player1.turn === true && gameSettings.Player2.turn === false) {
                e.currentTarget.innerHTML = gameSettings.Player1.mark;
                gameSettings.Player1.changeTurns()
                gameSettings.Player2.changeTurns();
                gameSettings.board[index] = gameSettings.Player1.mark;
            } else {
                e.currentTarget.innerHTML = gameSettings.Player2.mark;
                gameSettings.Player1.changeTurns()
                gameSettings.Player2.changeTurns();
                gameSettings.board[index] = gameSettings.Player2.mark;
            }
            gameSettings.checkForWinner();
        }
    } 
    return {fields}
})()