const MetaDataRoutes = require('./metaDataRoutes');


const CommonDao = require('../common/commonDao');
const CommonController = require('../common/commonController');

const MetaDao = require('../dao/metaDao')
const MetaController = require('../controller/metaController')






module.exports = function (app, config) {

    commonDao = new CommonDao(config.db);
    commonController = new CommonController();

    metaDao = new MetaDao(commonDao)
    MetaDataRoutes(app, new MetaController(metaDao, commonController));


};