const DB = require("./database.js");
// const Chess = require("chess.js").Chess;
// // await import { Chess } from "chess.js";

module.exports = {
  // loadChess() {
  //   const chess = new Chess();

  //   while (!chess.game_over()) {
  //     const moves = chess.moves();
  //     const move = moves[Math.floor(Math.random() * moves.length)];
  //     chess.move(move);
  //   }
  //   console.log(chess.pgn());
  // },
  getGame(game_id, callback) {
    DB.connect().then((db) => {
      db.get("SELECT * FROM games Where id = ?", game_id).then((result) => {
        callback(result);
      });
    });
  },

  newGame(gameId, callback) {
    DB.connect().then((db) => {
      db.run(
        "INSERT INTO games (current_positions, id) values (?, ?)",
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        gameId
      ).then(() => {
        callback(gameId);
      });
    });
  },

  updateGame(gameId, fen, callback) {
    DB.connect().then((db) => {
      db.run(
        "UPDATE games SET current_positions = ? WHERE id = ?",
        fen,
        gameId
      ).then(() => {
        callback({});
      });
    });
  },

  getById(id, callback) {
    DB.connect().then((db) => {
      db.get("SELECT * FROM games Where id = ?", id).then((result) => {
        callback(result);
      });
    });
  },

  setPassword(newPassword, player, gameId) {
    DB.connect().then((db) => {
      db.run(
        `UPDATE games SET ${player}_password = ? WHERE id = ?`,
        newPassword,
        gameId
      );
    });
  },

  checkPassword(password, player, gameId, callback) {
    DB.connect().then((db) => {
      db.get(`SELECT ${player}_password FROM games Where id = ?`, gameId).then(
        (result) => {
          if (player == "white") {
            if (result.white_password == password) {
              callback({ password_match: true });
            } else {
              callback({ password_match: false });
            }
          } else if (player == "black") {
            if (result.black_password == password) {
              callback({ password_match: true });
            } else {
              callback({ password_match: false });
            }
          }
        }
      );
    });
  },
};
