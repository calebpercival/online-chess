const getPieceLocations = async (fen) => {
  ({ Chess } = await import("chess.js")).Chess;

  const chess = new Chess();
  chess.load(fen);

  let board = chess.board();

  return board;
};

const getSquareStatus = async (fen, coordinate) => {
  ({ Chess } = await import("chess.js")).Chess;

  const chess = new Chess();
  chess.load(fen);

  let piece = chess.get(coordinate);

  return piece;
};

const makeMove = async (fen, from, to) => {
  ({ Chess } = await import("chess.js")).Chess;

  const chess = new Chess();
  chess.load(fen);

  let move = chess.move({ from: from, to: to });

  if (move != null) {
    let newFen = chess.fen();
    return newFen;
  } else {
    return "invalid";
  }
};

const gameStatus = async (fen) => {
  ({ Chess } = await import("chess.js")).Chess;

  const chess = new Chess();
  chess.load(fen);

  if (chess.in_checkmate()) {
    return { status: "Checkmate" };
  } else if (chess.in_check()) {
    return { status: "Check" };
  } else if (
    chess.in_draw() ||
    chess.insufficient_material() ||
    chess.in_threefold_repetition() ||
    chess.in_stalemate()
  ) {
    return { status: "Draw" };
  } else {
    return {};
  }
};

const currentTurn = async (fen) => {
  ({ Chess } = await import("chess.js")).Chess;

  const chess = new Chess();
  chess.load(fen);

  let turn = chess.turn();

  return turn;
};

module.exports = {
  getPieceLocations,
  getSquareStatus,
  makeMove,
  gameStatus,
  currentTurn,
};
