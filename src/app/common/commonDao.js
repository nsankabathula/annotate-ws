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
            const stmt = that.db.prepare(sqlRequest);
            //console.log(stmt, sqlParams)
            stmt.run(sqlParams, function (err) {
                if (err) {
                    console.log(err);
                    reject(
                        new DaoError(11, "Invalid arguments", sqlRequest, sqlParams)
                    )
                }
                console.debug("result", this);
                if (this.changes > 0) {
                    resolve(Object.assign({}, this, sqlParams));
                } else if (this.changes === 0) {
                    reject(
                        Object.assign({}, this,
                            new DaoError(21, "Entity not found", sqlRequest, sqlParams)
                        )
                    )
                }
            })
        });
    }

    insert(sqlRequest, sqlParams) {

        let that = this;
        return that.run(sqlRequest, sqlParams)
            .then((res) => {
                return Object.assign({ sqlParams }, { $id: res.lastID, $op: 'INSERT', $changes: res.changes })
            })
    }

    delete(sqlRequest, sqlParams) {

        let that = this;
        return that.run(sqlRequest, sqlParams)
            .then((res) => {
                return Object.assign({ sqlParams }, { $id: res.lastID, $op: 'DELETE', $changes: res.changes })
            })
    }

    update(sqlRequest, sqlParams) {

        let that = this;
        return that.run(sqlRequest, sqlParams)
            .then((res) => {
                return Object.assign({ sqlParams }, { $id: res.lastID, $op: 'UPDATE', $changes: res.changes })
            })
    }

    create(sqlRequest, sqlParams) {

        let that = this;
        return that.run(sqlRequest, sqlParams)
            .then((res) => {
                return Object.assign(res, { $op: 'CREATE' })
            })
            .catch((err) => {
                if (err.errorCode === 21) {
                    return Object.assign(err, { $op: 'CREATE' })
                }
                else
                    throw err
            })
    }
    begin() {
        let that = this;
        return that.run("begin transaction", {})
            .then((res) => {
                console.debug(res)
                return res;
            })
            .catch((err) => {
                if (err.errorCode === 21) {
                    return Object.assign(err, { $op: 'BEGIN_TRANSACTION' })
                }
                else
                    throw err
            })
    }

    commit() {
        let that = this;
        return that.run("commit", {})
            .then((res) => {
                console.debug(res)
                return res
            })
            .catch((err) => {
                if (err.errorCode === 21) {
                    return Object.assign(err, { $op: 'COMMIT' })
                }
                else
                    throw err
            })
    }

    rollback() {
        return that.run("rollback", {})
            .then((res) => {
                console.debug(res)
                return res
            })
            .catch((err) => {
                if (err.errorCode === 21) {
                    return Object.assign(err, { $op: 'ROLLBACK' })
                }
                else
                    throw err
            })

    }

    drop(sqlRequest, sqlParams) {

        let that = this;
        return that.run(sqlRequest, sqlParams)
            .then((res) => {
                return Object.assign(res, { $op: 'DROP' })
            })
            .catch((err) => {
                if (err.errorCode === 21) {
                    return Object.assign(err, { $op: 'DROP' })
                }
                else
                    throw err
            })
    }





    bulk(sqlRequest, sqlParams) {
        let that = this;

        var promises = []
        for (var id in sqlParams) {
            promises.push(that.run(sqlRequest, sqlParams[id]))
        }

        return Promise.all(promises).then(
            (data) => {
                console.log(data)
                return data
            }
        )

    }



}

module.exports = CommonDao;