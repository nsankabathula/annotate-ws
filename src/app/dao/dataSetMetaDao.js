const util = require('util');
const DataSetDao = require("./dataSetDao")
const DS_META_TABLE_NAME = "dataset_meta"

class DataSetMetaDao {

    constructor(commonDao) {
        console.debug("DataSet constructor");
        this.commonDao = commonDao;
        this.dataSetDao = new DataSetDao(commonDao)
    }

    get(id) {
        const QUERY = util.format("select * from %s where id = $id", DS_META_TABLE_NAME);
        return this.commonDao.findOne(
            QUERY, { $id, id }
        ).then(
            row => {
                return row;
            }
        )
    }

    getMap() {
        let that = this;
        return that.getAll().then((res) => {
            var idMap = {}
            res.forEach(row => {
                idMap[row.id] = row
            });
            return idMap
        })
    }

    getAll() {
        const QUERY = util.format("SELECT * FROM %s ORDER BY id asc", DS_META_TABLE_NAME);
        return this.commonDao.findAll(
            QUERY
        ).then(
            rows => {
                return rows;
            }
        )
    }

    create(name, type, purpose) {
        var that = this;
        return that.insert(name, type, purpose)
            .then((insRes) => {
                console.log("insert res", insRes)
                const data = insRes.data;
                const dataSetName = util.format("DS.%s.%s.%s.%s", data.$purpose, data.$type, data.$name, data.$id)
                return that.update(data.$id, dataSetName)
                    .then((updRes) => {
                        console.log("update res", updRes)
                        return that.dataSetDao.recreate(dataSetName).then((creRes) => {
                            console.log("create res", creRes)
                            return creRes
                        })
                    })
            })
    }



    //findBy(params) { }
    insert(name, type, purpose) {
        const INSERT_SCRIPT = util.format("INSERT INTO %s (name, type, purpose) VALUES ($name, $type, $purpose)", DS_META_TABLE_NAME);
        const insParams = { $name: String(name).toUpperCase(), $type: String(type).toUpperCase(), $purpose: String(purpose).toUpperCase() };
        return this.commonDao.insert(INSERT_SCRIPT, insParams)

    }


    delete(id) {
        const DELETE_SCRIPT = util.format(`DELETE %s WHERE id = $id `, DS_META_TABLE_NAME);
        const delParams = { $id: id };
        return this.commonDao.delete(DELETE_SCRIPT, delParams)

    }
    update(id, dataSetName) {

        const UPDATE_SCRIPT = util.format(`UPDATE %s SET tableName = $dataSetName WHERE id = $id`, DS_META_TABLE_NAME)
        const updParams = { $id: id, $dataSetName: dataSetName };
        return this.commonDao.update(UPDATE_SCRIPT, updParams)

    }


}

module.exports = DataSetMetaDao;