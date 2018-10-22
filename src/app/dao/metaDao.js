//const CommonDao = require('../core/common');

class MetaDao {

    constructor(commonDao) {
        console.debug("MetaDao constructor");
        this.commonDao = commonDao;
    }

    findAll() {
        const QUERY = "select * from sqlite_master";
        return this.commonDao.findAll(
            QUERY
        ).then(
            rows => {
                return rows;
            }
        )
    }
}

module.exports = MetaDao;