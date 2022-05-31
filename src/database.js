const Sqlite = require("sqlite");
const Sqlite3 = require("sqlite3");

const dbFilename = "./database.db";

Sqlite3.verbose(); //Enable debug output

module.exports = {
  connect() {
    return Sqlite.open({
      filename: dbFilename,
      driver: Sqlite3.Database,
    }).catch((err) => {
      console.log("DB.comnect failed with error: " + err);
    });
  },
};
