const { resourceUsage } = require("process");
const DB = require("./database.js");

module.exports = {
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
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
        gameId
      ).then(() => {
        callback(gameId);
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
