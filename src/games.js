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
};
