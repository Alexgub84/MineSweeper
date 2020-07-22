'use strict'


//    gBoard[i][j].minesAroundCount+=1;
//     gBoard[i][j].isShown = false;
//     gBoard[i][j].isMine =  true;
//     gBoard[i][j].isMarked =  false;


function buildBoard(mines) {
    buileEmptyBoard();

    for (let count = 0; count < mines.length; count++) {
        var mineI = mines[count].i;
        var mineJ = mines[count].j;
        gBoard[mineI][mineJ].isMine = true;
        setMineNegsCount({ i: mineI, j: mineJ });
    }
    console.log(gBoard);
}

function buileEmptyBoard() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j] = getCell();
        }
    }
}


function getCell() {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
    return cell;
}

function creatRandomMines(notMineCoord) {
    var mines = [];
    while (mines.length < gLevel.MINES) {
        var newMine = {};
        newMine.i = getIntNotInc(0, gLevel.SIZE);
        newMine.j = getIntNotInc(0, gLevel.SIZE);
        if ((notMineCoord.i !== newMine.i && notMineCoord.j !== newMine.j) && (checkIfMineLegit(mines, newMine))) mines.push(newMine);
    }

    return mines;
}

function checkIfMineLegit(mines, mineCoord) {
    for (let i = 0; i < mines.length; i++) {
        if (mines[i].i === mineCoord.i && mines[i].j === mineCoord.j)
            return false;
    }
    return true;
}


function setMineNegsCount(mineCoord) {
    for (let i = mineCoord.i - 1; i <= mineCoord.i + 1; i++) {
        for (let j = mineCoord.j - 1; j <= mineCoord.j + 1; j++) {
            if (i === mineCoord.i && j === mineCoord.j) continue;
            if (_checkIfOnBoard({ i: i, j: j })) {
                gBoard[i][j].minesAroundCount += 1;
            }
        }
    }
}

function _checkIfOnBoard(cellCoord) {
    return (cellCoord.i >= 0 && cellCoord.i < gBoard.length &&
        cellCoord.j >= 0 && cellCoord.j < gBoard[cellCoord.i].length);
}