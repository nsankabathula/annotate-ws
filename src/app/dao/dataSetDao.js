const util = require('util');
const DaoResult = require('../common/daoResult');
const DS_META_TABLE_NAME = "dataset_meta"
class DataSetDao {
    constructor(commonDao) {
        console.debug("DataSet constructor");
        this.commonDao = commonDao;
    }

    get(dataSetName, id) {
        const QUERY = util.format("select * from %s where id = $id", dataSetName);
        return this.commonDao.findOne(
            QUERY, { $id: id }
        ).then(
            row => {
                return row;
            }
        )
    }

    getMap() {
        let that = this;
        const QUERY = util.format("SELECT * FROM %s ORDER BY id asc", DS_META_TABLE_NAME)
        return that.commonDao.findAll(QUERY).then((res) => {
            var idMap = {}
            res.forEach(row => {
                idMap[row.id] = row
            });
            return idMap
        })
    }

    getAll(dataSetName) {
        const QUERY = util.format("SELECT * FROM %s ORDER BY id asc", dataSetName);
        return this.commonDao.findAll(
            QUERY
        ).then(
            rows => {
                return rows;
            }
        )
    }

    getStats(dataSetName) {
        const QUERY = util.format("SELECT IFNULL(answer, 'pending') answer, count(1) as count FROM %s    GROUP BY answer", dataSetName);
        return this.commonDao.findAll(
            QUERY
        ).then(
            rows => {
                return rows;
            }
        )
    }

    countAll(dataSetName) {
        let sqlRequest = util.format("SELECT COUNT(*) AS count FROM %s", dataSetName);
        return this.commonDao.findOne(sqlRequest);
    };

    exists(dataSetName, id) {
        let sqlRequest = util.format("SELECT (count(*) > 0) as found FROM %s WHERE id=$id", dataSetName);
        let sqlParams = { $id: id };
        return this.commonDao.run(sqlRequest, sqlParams);
    };

    create(dataSetName) {
        const CREATE_SCRIPT = util.format("CREATE TABLE %s (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, answer TEXT)", dataSetName);
        return this.commonDao.create(CREATE_SCRIPT, {})


    }

    recreate(dataSetName) {
        var that = this
        return that.drop(dataSetName).then((res) => {
            return that.create(dataSetName)
        })
    }

    drop(dataSetName) {
        const DROP_SCRIPT = util.format("DROP TABLE IF EXISTS %s", dataSetName)
        return this.commonDao.drop(DROP_SCRIPT, {})
    }

    //findBy(params) { }
    insert(dataSetName, text) {
        const INSERT_SCRIPT = util.format("INSERT INTO %s (text) VALUES ($text)", dataSetName);
        const insParams = { $text: text };
        return this.commonDao.insert(INSERT_SCRIPT, insParams)
    }


    delete(dataSetName, id) {
        const DELETE_SCRIPT = util.format(`DELETE %s WHERE id = $id `, dataSetName);
        const delParams = { $id: id };
        return this.commonDao.delete(DELETE_SCRIPT, delParams)
    }
    update(dataSetName, id, answer) {

        const UPDATE_SCRIPT = util.format(`UPDATE %s SET answer = $answer WHERE id = $id`, dataSetName)
        const updParams = { $id: id, $answer: answer };
        return this.commonDao.update(UPDATE_SCRIPT, updParams)
    }

    bulk(dataSetName, textArray, op = "INS") {
        var that = this;
        var bulk = []

        textArray.forEach((data) => {
            bulk.push(that.insert(dataSetName, data.text))
        })

        return Promise.all(bulk).then(
            (res) => {
                console.log("bulk", res)
                return res;
            }
        )
    }

    upload(dataSetName, data) {
        var that = this;
        return that.commonDao.begin()
            .then((beginRes) => {
                return that.recreate(dataSetName)
                    .then((recreateRes) => {
                        return that.bulk(dataSetName, data).then((bulkRes) => {
                            return that.commonDao.commit().then((commitRes) => {
                                console.log(commitRes)
                                return bulkRes
                            })
                        })
                    })
            })
            .catch((err) => {
                return that.commonDao.rollback().then((res) => {
                    return err
                })
            })



    }

}

module.exports = DataSetDao;