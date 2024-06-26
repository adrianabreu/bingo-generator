type BingoBoard = Set<number>;

export function isSafeGeneration(songs: number, boards: number, height: number, width: number): boolean {
  return combinations(songs, height * width) > boards;
}

function factorial(r) {
  let s = BigInt(1);
  var i = BigInt(r);
  while (i > 1) s *= i--;
  return s;
}

function combinations(n, r) {
  let s = BigInt(1);
  let i = BigInt(r);
  while (i < n) s *= ++i;
  return s / factorial(n - r);
}

export function generateCombinations(
  width: number,
  height: number,
  elementSize: number,
  amount: number
): BingoBoard[] {
  let boardsRows: Set<BingoBoard> = new Set<BingoBoard>();
  let boards: Set<BingoBoard> = new Set<BingoBoard>();
  while (boards.size < amount) {
    let board = new Set<number>();

    while (board.size < height * width) {
      let row = new Set<number>();
      while (row.size < width) {
        let random = Math.floor(Math.random() * elementSize);
        row.add(random);
      }
      let intersection = new Set([...row].filter((x) => board.has(x)));
      if (intersection.size == 0 && !boardsRows.has(row)) {
        board = new Set([...board, ...row]);
        boardsRows.add(row);
      }
    }
    boards.add(board);
  }
  return Array.from(boards);
}

export function transformToDrawableMatrix(
  combinations: BingoBoard[],
  width: number,
  height: number
): number[][][] {
  let boards = [];
  let board = [];
  for (let i = 0; i < combinations.length; i++) {
    for (let j = 0; j < height; j++) {
      board.push(Array.from(combinations[i]).slice(j * width, (j + 1) * width));
    }
    boards.push(board);
    board = [];
  }
  return boards;
}
