class MetaController {

    constructor(dao, contoller) {
        this.dao = dao;
        this.controller = contoller
    }

    findAll(req, res) {
        let that = this;
        that.dao.findAll()
            .then(that.controller.findSuccess(res))
            .catch(that.controller.findError(res));

    }
}

module.exports = MetaController;