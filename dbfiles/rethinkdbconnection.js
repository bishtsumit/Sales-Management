//  ------------- Rethink DB Scpoe ----------///
const rethink = require("rethinkdb");
const { RethinkURI } = require("./../config/keys");

global.connection = null;
rethink
  .connect(RethinkURI)
  .then((conn) => {
    global.connection = conn;

    console.log("DB connection Created Successfully !!!");

    rethink
      .dbList()
      .contains(RethinkURI.db)
      .do(function (databaseExists) {
        return rethink.branch(
          databaseExists,
          { dbs_created: 0 },
          rethink.dbCreate()
        );
      })
      .run(connection, (err, result) => {
        if (err) console.log(err);
        else console.log("DB object Completed");
      });
  })
  .catch((err) => console.log(err));

//// Creating DB if not exists

//  ------------- Rethink DB Scpoe ----------///
