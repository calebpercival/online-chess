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

module.exports = { getPieceLocations, getSquareStatus, makeMove };
