const csv = require('fast-csv');
const fs = require('fs');

class MetaController {

    constructor(dao, contoller) {
        this.dao = dao;
        this.controller = contoller
    }

    findAll(req, res) {
        let that = this;
        that.dao.getAll()
            .then(that.controller.findSuccess(res))
            .catch(that.controller.findError(res));

    }

    findOne(req, res) {
        let that = this;
        that.dao.get(req.params.id)
            .then(that.controller.findSuccess(res))
            .catch(that.controller.findError(res));

    }



    create(req, res) {
        let that = this;
        console.log(req.body)
        params = req.body
        that.dao.create(params.name, params.type, params.purpose)
            .then(that.controller.findSuccess(res))
            .catch(that.controller.findError(res));

    }


}

module.exports = MetaController;