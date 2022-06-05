const makeMove = (fen) =>
  (async (copyFen) => {
    ({ Chess } = await import("chess.js")).Chess;

    // let fen = copyFen;

    const chess = new Chess();

    // console.log(chess.fen());
    return {
      pieceLocations(fen) {
        chess.load(fen);
        console.log(fen);
        return chess.board();
      },
    };
  })();

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

module.exports = { getPieceLocations, getSquareStatus };
