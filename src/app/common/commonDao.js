const DaoError = require('./daoError');

class CommonDao {

    constructor(db) {
        console.debug("Common constructor");
        this.db = db
    }

    findAll(sqlRequest) {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.db.all(sqlRequest, function (err, rows) {
                if (err) {
                    console.error(err);
                    reject(
                        new DaoError(20, "Internal server error", sqlRequest)
                    );
                } else if (rows === null || rows.length === 0) {
                    reject(
                        new DaoError(21, "Entity not found ", sqlRequest)
                    );
                } else {
                    resolve(rows);
                }
            })
        });
    }

    findAllWithParams(sqlRequest, sqlParams) {
        //console.log(sqlRequest, sqlParams);
        let that = this;
        return new Promise(function (resolve, reject) {
            let stmt = that.db.prepare(sqlRequest);
            stmt.all(sqlParams, function (err, rows) {
                if (err) {
                    console.log(err)
                    reject(
                        new DaoError(11, "Invalid arguments", sqlRequest, sqlParams)
                    );
                } else if (rows === null || rows.length === 0) {
                    console.log("Entity not found");
                    reject(
                        new DaoError(21, "Entity not found ", sqlRequest, sqlParams)
                    );
                } else {
                    resolve(rows);
                }
            })
        });
    }

    findOne(sqlRequest, sqlParams) {
        let that = this;
        return new Promise(function (resolve, reject) {
            let stmt = that.db.prepare(sqlRequest);
            stmt.all(sqlParams, function (err, rows) {
                //console.debug(err, rows)
                if (err) {
                    reject(
                        new DaoError(11, "Invalid arguments", sqlRequest, sqlParams)
                    );
                } else if (rows === null || rows.length === 0) {
                    reject(
                        new DaoError(21, "Entity not found ", sqlRequest, sqlParams)
                    );
                } else {
                    //console.debug(rows)
                    let row = rows[0];
                    resolve(row);
                }
            })
        });
    }

    existsOne(sqlRequest, sqlParams) {
        let that = this;
        return new Promise(function (resolve, reject) {
            let stmt = that.db.prepare(sqlRequest);
            stmt.each(sqlParams, function (err, row) {
                if (err) {
                    reject(
                        new DaoError(20, "Internal server error", sqlRequest, sqlParams)
                    );
                } else if (row && row.found === 1) {
                    resolve(true);
                } else {
                    reject(
                        new DaoError(21, "Entity not found", sqlRequest, sqlParams)
                    );
                }
            })
        });
    }

    run(sqlRequest, sqlParams) {
        let that = this;
        return new Promise(function (resolve, reject) {
            let stmt = that.db.prepare(sqlRequest);
            stmt.run(sqlParams, function (err) {
                //console.log(this);
                if (this.changes > 0) {
                    resolve(sqlParams);
                } else if (this.changes === 0) {
                    reject(
                        new DaoError(21, "Entity not found", sqlRequest, sqlParams)
                    )
                } else {
                    console.log(err);
                    reject(
                        new DaoError(11, "Invalid arguments", sqlRequest, sqlParams)
                    )
                }
            })
        });
    }

    delete(sqlRequest, sqlParams) {
        let that = this;
        return new Promise(function (resolve, reject) {
            let stmt = that.db.prepare(sqlRequest);
            stmt.run(sqlParams, function (err) {
                if (this.changes > 0) {
                    resolve({ operation: 'delete', rowCount: this.changes });
                } else if (this.changes === 0) {
                    reject(
                        new DaoError(21, "Entity not found", sqlRequest, sqlParams)
                    )
                } else {
                    console.log(err);
                    reject(
                        new DaoError(11, "Invalid arguments", sqlRequest, sqlParams)
                    )
                }
            })
        });
    }



}

module.exports = CommonDao;