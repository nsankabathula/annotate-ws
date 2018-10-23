const MetaRoute = require('./metaRoute');
const DataSetRoute = require('./dataSetRoutes')


const CommonDao = require('../common/commonDao');
const CommonController = require('../common/commonController');

const DataSetMetaDao = require('../dao/dataSetMetaDao')
const MetaController = require('../controller/metaController')

const DataSetDao = require("../dao/dataSetDao")
const DataSetController = require("../controller/dataSetController")






module.exports = function (app, config) {

    const commonDao = new CommonDao(config.db);
    const commonController = new CommonController();


    MetaRoute(app, new MetaController(new DataSetMetaDao(commonDao), commonController));

    DataSetRoute(app, new DataSetController(new DataSetDao(commonDao), commonController));


};