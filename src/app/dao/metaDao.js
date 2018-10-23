//const CommonDao = require('../core/common');
const util = require('util');

class MetaDao {

    constructor(commonDao) {
        console.debug("MetaDao constructor");
        this.commonDao = commonDao;
    }

    findAll() {
        const QUERY = "select * from DS_NER_EVAL_TEST_6";
        return this.commonDao.findAll(
            QUERY
        ).then(
            rows => {
                return rows;
            }
        )
    }

    create_table(sqlReuest, sqlParams) {
        return this.commonDao.run(sqlReuest, sqlParams)
            .then(
                (creatRes) => {
                    return Object.assign({ res: creatRes }, sqlParams)
                }
            )
    }

    create(params) {//label, type

        const INSERT_SCRIPT = `INSERT INTO dataset_meta (name, type, purpose) VALUES ($name, $type, $purpose)`;
        const UPDATE_SCRIPT = `UPDATE dataset_meta SET tableName = $tableName WHERE id = $id`
        const CREATE_TABLE = "CREATE TABLE %s (text TEXT, label TEXT,  answer TEXT, id INTEGER PRIMARY KEY AUTOINCREMENT) "
        const insertParams = { $name: String(params.name).toUpperCase(), $type: String(params.type).toUpperCase(), $purpose: String(params.purpose).toUpperCase() };
        return this.commonDao.run(INSERT_SCRIPT, insertParams)
            .then(
                (res) => {
                    console.log("Result", res);
                    const tableName = util.format("DS_%s_%s_%s_%s", insertParams.$purpose, insertParams.$type, insertParams.$name, res.lastID)
                    const updateParams = { $tableName: tableName, $id: res.lastID };
                    return this.commonDao.run(UPDATE_SCRIPT, updateParams)
                        .then(
                            (upRes) => {
                                console.log(upRes)
                                const sqlParams = { name: tableName, id: updateParams.$id };
                                return create_table(util.format(CREATE_TABLE, tableName), sqlParams)
                            }
                        )
                }

            );


    }

    upload(params) { //id, file
        //console.log(params)
        const DELETE_STMT = util.format("DELETE FROM %s", params.id);
        const INSERT_STMT = util.format("INSERT INTO %s (text) VALUES ($text)", params.id);
        var promises = [this.commonDao.run(DELETE_STMT, {})];


        params.data.forEach((row) => {
            promises.push(this.commonDao.run(INSERT_STMT, { $text: row.text }))
        })

        return Promise.all(promises).then((res) => {
            console.log("upload all", res)
            return res;
        })

    }

    delete(params) { //id

    }

}

module.exports = MetaDao;