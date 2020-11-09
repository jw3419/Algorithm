class Board {
    constructor(n) {
        this.board = this.makeChessBoard(n);
        this.n = n;

    }

    makeChessBoard(n) {
        let b = []
        for(let i=0; i<n; i++){
            let tmp = []
            for(let j=0; j<n; j++){
                tmp.push(0);
            }
            b.push(tmp);
        }
        return b;
    }

    rows() {
        return this.board.map(row => row)
    }

    togglePiece(rowIndex, colIndex) {
        if (this.board[rowIndex][colIndex]) {
            this.board[rowIndex][colIndex] = 0
        }
        else {
            this.board[rowIndex][colIndex] = 1
        }
    }

    getFirstRowColumnIndexForSlashOn(rowIndex, colIndex) {
        return colIndex + rowIndex;
    }

    // 특정 좌표가 주어졌을 때, 해당 좌표를 지나는 역 슬래시 대각선(backslash, \)의 첫 번째 행 컬럼을 반환합니다.
    // ex) rowIndex: 1, colIndex: 0이 주어졌을 때 -1 반환
    //          -1 0 1 2 3 4
    // ----------------------
    //       0   1[0,0,0,0]
    //       1    [1,0,0,0]
    //       2    [0,1,0,0]
    //       3    [0,0,1,0]
    getFirstRowColumnIndexForBackSlashOn(rowIndex, colIndex) {
        return colIndex - rowIndex;
    }

    // 체스 판 위에 서로 공격할 수 있는 룩이 한 쌍이라도 있는지 검사합니다.
    hasAnyRooksConflicts() {
        return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    }

    // 체스 판 위 특정 좌표를 기준으로, 서로 공격할 수 있는 룩이 한 쌍이라도 있는지 검사합니다. (가로, 세로)
    hasAnyRooksConflictsOn(rowIndex, colIndex) {
        return this.hasRowConflictAt(rowIndex) || this.hasColConflictAt(colIndex);
    }

    // 체스 판 위에 서로 공격할 수 있는 퀸이 한 쌍이라도 있는지 검사합니다.
    hasAnyQueensConflicts() {
        return (this.hasAnyRooksConflicts() || this.hasAnySlashConflicts() || this.hasAnyBackSlashConflicts());
    }

    // 체스 판 위 특정 좌표를 기준으로, 서로 공격할 수 있는 퀸이 한 쌍이라도 있는지 검사합니다. (가로, 세로, 슬래시(/), 역 슬래시(\))
    // 이 함수는 BorderView.js 파일에서 브라우저에 체스판을 그려주기 위해 사용합니다.
    hasAnyQueenConflictsOn(rowIndex, colIndex) {
        return (
            this.hasRowConflictAt(rowIndex) ||
            this.hasColConflictAt(colIndex) ||
            this.hasSlashConflictAt(this.getFirstRowColumnIndexForSlashOn(rowIndex, colIndex)) ||
            this.hasBackSlashConflictAt(this.getFirstRowColumnIndexForBackSlashOn(rowIndex, colIndex))
        );
    }

    // 주어진 좌표가 체스 판에 포함되는 좌표인지 확인합니다.
    isInBounds(rowIndex, colIndex) {
        return (
            rowIndex >= 0 &&
            rowIndex < this.n &&
            colIndex >= 0 &&
            colIndex < this.n
        );
    }

    // 주어진 행(rowIndex)에 충돌하는 말이 있는지 확인합니다.
    hasRowConflictAt(rowIndex) {
        let rows = this.rows();
        let isConflict = false;

        if (rows[rowIndex].indexOf(1) !== rows[rowIndex].lastIndexOf(1)) {
            isConflict = true;
        }

        return isConflict;
    }

    // 체스 판 위에 행 충돌이 하나라도 있는지 검사합니다.
    hasAnyRowConflicts() {
        let idxArr = []
        for (let i = 0; i < this.n; i++) {
            idxArr.push(i);
        }
        let areComplicts = idxArr.map(rowIdx => this.hasRowConflictAt(rowIdx))

        return areComplicts.some(isComplict => isComplict);
    }

    // 주어진 열(colIndex)에 충돌하는 말이 있는지 확인합니다.
    hasColConflictAt(colIndex) {
        let col = [];
        let isConflict = false;

        for (let i = 0; i < this.rows().length; i++) {
            col.push(this.rows()[i][colIndex]);
        }

        if (col.indexOf(1) !== col.lastIndexOf(1)) {
            isConflict = true;
        }

        return isConflict;
    }

    // 체스 판 위에 열 충돌이 하나라도 있는지 검사합니다.
    hasAnyColConflicts() {
        let idxArr = []
        for (let i = 0; i < this.n; i++) {
            idxArr.push(i);
        }
        let areComplicts = idxArr.map(colIdx => this.hasColConflictAt(colIdx))

        return areComplicts.some(isComplict => isComplict);
    }

    // 주어진 슬래시 대각선(/)에 충돌하는 말이 있는지 확인합니다.
    hasSlashConflictAt(SlashColumnIndexAtFirstRow) {
        let rows = this.rows();
        let slashArr = [];
        let isConflict = false;

        for (let i = 0; i < rows.length; i++) {
            if (this.isInBounds(i, SlashColumnIndexAtFirstRow)) {
                slashArr.push(rows[i][SlashColumnIndexAtFirstRow]);
            }
            SlashColumnIndexAtFirstRow--;
        }

        if (slashArr.indexOf(1) !== slashArr.lastIndexOf(1)) {
            isConflict = true;
        }
        return isConflict;
    }

    // 체스 판 위에 슬래시 대각선(/)에 충돌이 하나라도 있는지 검사합니다.
    hasAnySlashConflicts() {
        let slashCount = this.rows().length * 2 - 1;
        let idxArr = []
        for (let i = 0; i < slashCount; i++) {
            idxArr.push(i);
        }
        let areComplicts = idxArr.map(idx => {
            return this.hasSlashConflictAt(idx)
        })

        return areComplicts.some(isComplict => isComplict);
    }

    // 주어진 역 슬래시 대각선(\)에 충돌하는 말이 있는지 확인합니다.
    hasBackSlashConflictAt(BackSlashColumnIndexAtFirstRow) {
        let rows = this.rows();
        let bSlashArr = [];
        let isConflict = false

        for (let i = 0; i < rows.length; i++) {
            if (this.isInBounds(i, BackSlashColumnIndexAtFirstRow)) {
                bSlashArr.push(rows[i][BackSlashColumnIndexAtFirstRow])
            }
            BackSlashColumnIndexAtFirstRow++;
        }

        if (bSlashArr.indexOf(1) !== bSlashArr.lastIndexOf(1)) {
            isConflict = true;
        }
        return isConflict;
    }

    // 체스 판 위에 역 슬래시 대각선(\) 충돌이 하나라도 있는지 검사합니다.
    hasAnyBackSlashConflicts() {
        let range = [];
        let sp = -(this.rows().length - 1);
        for (let i = 0; i < this.rows().length * 2 - 1; i++) {
            range.push(sp++)
        }
        let areComplicts = range.map(idx => {
            return this.hasBackSlashConflictAt(idx)
        })

        return areComplicts.some(isComplict => isComplict);
    }
}

function findNRooksSolution(n) {
    function sum2DArr(arr) {
        return arr.reduce(function (acc, row) {
            return (acc + row.reduce(function (acc, col) {
                return acc + col;
            }, 0))
        }, 0)
    }

    function recursion(row, col) {
        if (row === n) {                                   // 행을 벗어나면, 체스판을 벗어나면 return
            return;
        }
        solution.togglePiece(row, col);

        if (!solution.hasAnyRooksConflicts()) {         // 충돌 안났으면 다음행 이동
            for (let i = 0; i < n; i++) {
                recursion(row + 1, i);
                if (n === sum2DArr(solution.rows())) {
                    return;
                }
            }
            solution.togglePiece(row, col);                // 한 행이 전부 충돌나면 말 제거
        }
        else {
            solution.togglePiece(row, col);                  // 말 한개를 놓았을 때 충돌나면 제거.
        }
        return;
    }

    let solution = new Board(n)
    for (let i = 0; i < n; i++) {
        recursion(0, i);
        if (n === sum2DArr(solution.rows())) {
            break;
        }
    }
    console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution.rows()));
    return solution.rows();
}

// n이 주어졌을 때 n rooks 문제의 전체 해답 개수를 반환합니다.
// 반환 값은 정수입니다.
function countNRooksSolutions(n) {
    let solutionCount = 0; // fixme
    let flag = false;

    function recursion(row, col) {
        if (row === n) {                                   // 행을 벗어나면, 체스판을 벗어나면 return
            solutionCount++;
            flag = true;
            return;
        }
        solution.togglePiece(row, col);

        if (!solution.hasAnyRooksConflicts()) {         // 충돌 안났으면 다음행 이동
            for (let i = 0; i < n; i++) {
                recursion(row + 1, i);
                if (row + 1 < n) {
                    solution.togglePiece(row + 1, i)
                }
                if (flag) {
                    flag = false;
                    return;
                }
            }
        }
        return;
    }

    if (n === 0 || n === 1) {
        return 1;
    }

    let solution = new Board(n)
    for (let i = 0; i < n; i++) {
        recursion(0, i);
        solution.togglePiece(0, i);
    }

    console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
    return solutionCount;
}

// n이 주어졌을 때 n queens 문제의 해답 한 개를 반환합니다.
// 반환 값은 체스 판을 나타내는 2차원 배열입니다.
function findNQueensSolution(n) {
    // 1. 체스 말을 놓는다.
    // 2. 충돌 검사한다.
    // 3. 충돌나면 말 빼고, 이전에 말을 놓았던 위치로 복귀.
    // 4. 충돌 안나면 다음 행 이동.
    // 5. 첫번째 열에서 마지막 열까지 이동하며 충돌나는지 검사.
    // 6. 충돌나면 말 빼고, 이전에 말을 놓았던 위치로 복귀.
    function sum2DArr(arr) {
        return arr.reduce(function (acc, row) {
            return (acc + row.reduce(function (acc, col) {
                return acc + col;
            }, 0))
        }, 0)
    }

    function recursion(row, col) {
        if (row === n) {                                   // 행을 벗어나면, 체스판을 벗어나면 return
            return;
        }
        solution.togglePiece(row, col);

        if (!solution.hasAnyQueensConflicts()) {         // 충돌 안났으면 다음행 이동
            for (let i = 0; i < n; i++) {
                recursion(row + 1, i);
                if (n === sum2DArr(solution.rows())) {
                    return;
                }
            }
            solution.togglePiece(row, col);                // 한 행이 전부 충돌나면 말 제거
        }
        else {
            solution.togglePiece(row, col);                  // 말 한개를 놓았을 때 충돌나면 제거.
        }
        return;
    }

    if (n === 0) {
        return [];
    }
    else if (n === 1) {
        return [[1]];
    }

    let solution = new Board(n)
    for (let i = 0; i < n; i++) {
        recursion(0, i);
        if (n === sum2DArr(solution.rows())) {
            break;
        }
    }

    console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution.rows()));
    return solution.rows();
}

// n이 주어졌을 때 n queens 문제의 전체 해답 개수를 반환합니다.
// 반환 값은 정수입니다.
function countNQueensSolutions(n) {
    function recursion(row, col) {
        if (row === n) {
            solutionCount++;
            flag = true;
            return;
        }
        solution.togglePiece(row, col);

        if (!solution.hasAnyQueensConflicts()) {
            for (let i = 0; i < n; i++) {
                recursion(row + 1, i);
                if (row + 1 < n) {
                    solution.togglePiece(row + 1, i)
                }
                if (flag) {
                    flag = false;
                    return;
                }
            }
        }
        return;
    }

    if (n === 0 || n === 1) {
        return 1;
    }
    
    let solutionCount = 0; // fixme
    let flag = false;

    let solution = new Board(n)
    for (let i = 0; i < n; i++) {
        recursion(0, i);
        solution.togglePiece(0, i);
    }
    
    console.log('Number of solutions for ' + n + ' queens:', solutionCount);
    return solutionCount;
}

findNRooksSolution(4);
countNRooksSolutions(4);
findNQueensSolution(4);
countNQueensSolutions(4);