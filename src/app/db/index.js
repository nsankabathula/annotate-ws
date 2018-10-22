const sqlite3 = require('sqlite3').verbose();

const env = require("../../environments/environment");
/*
 * Database configuration
 */


function insert_meta_data(db, label, type, file) {
    id = -1;
    dbName = null;
    db
        .run('INSERT INTO training_meta (label, type, path) VALUES (?, ?, ?)', [label, type, env.db.uri], function (err) {
            if (err) {
                throw err
            }
            console.log(`Inserted with rowid ${this.lastID}`);
            id = this.lastID
            dbName = `${id}.${label}.${type}.db`
            console.log(dbName)
        })
        .run(`UPDATE training_meta SET db = ? \
        WHERE id = ?`, [dbName, id], function (err) {
                if (err) {
                    throw err
                }
                console.log(`Updated rowid ${id} ${dbName}`);
            })
    console.log("insert_meta_data: ", id)
    return id, db
}

function import_csv_data(appDb, type, label, file) {
    id = insert_meta_data(appDb, label, type)

}


meta_db = (env, db) => {
    //console.log(env, db)
    config = env[db];
    console.log(config)
    const sqldb = new sqlite3.Database(config.uri, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            console.error(err);
            throw err
            // create new db

        }


        console.log('Connected to the SQlite database.', config.uri);
    })
    if (sqldb) {
        sqldb.serialize(() => {
            sqldb
                .run('CREATE TABLE IF NOT EXISTS "training_meta" (`db` TEXT, `path` TEXT,  `label` TEXT, `type` TEXT, `file` BLOB, `id` INTEGER PRIMARY KEY AUTOINCREMENT )')
                .run('CREATE TABLE IF NOT EXISTS "training_metrics" ( `metaId` INTEGER, `status` TEXT, `id` INTEGER PRIMARY KEY AUTOINCREMENT, FOREIGN KEY(`metaId`) REFERENCES `training_meta`(`id`) )')
        })
    }
    return sqldb
}

module.exports = {

    db: meta_db,
    import_data: (appDb, name, label, file, fileType = "csv") => {
        import_csv_data(appDb, "NER", "PERSON")
    }

};