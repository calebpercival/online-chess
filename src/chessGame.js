// (async function () {
//   ({ Chess } = await import("chess.js")).Chess;

//   const chess = new Chess();

//   // console.log(chess.board());
//   while (!chess.game_over()) {
//     const moves = chess.moves();
//     const move = moves[Math.floor(Math.random() * moves.length)];
//     chess.move(move);
//   }

//   //   console.log(chess.pgn());
// })();

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

// const getPieceLocations = () =>
//   (async () => {
//     ({ Chess } = await import("chess.js")).Chess;

//     // let fen = copyFen;

//     const chess = new Chess();

//     let fen1 = chess.fen();
//     return {
//       fen1,
//     };
//   })();

const getPieceLocations = async (fen) => {
  ({ Chess } = await import("chess.js")).Chess;

  const chess = new Chess();
  chess.load(fen);

  let board = chess.board();

  return board;
};

module.exports = { getPieceLocations };
