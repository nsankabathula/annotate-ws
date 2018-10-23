const csv = require('fast-csv');
const fs = require('fs');

class DataSetController {

    constructor(dao, contoller) {
        this.dao = dao;
        this.controller = contoller
    }

    findMap(req, res) {
        let that = this;
        that.dao.getMap()
            .then(that.controller.findSuccess(res))
            .catch(that.controller.findError(res));
    }

    findStats(req, res) {
        let that = this;
        that.dao.getStats(req.params.name)
            .then(that.controller.findSuccess(res))
            .catch(that.controller.findError(res));
    }



    findAll(req, res) {
        let that = this;
        that.dao.getAll(req.params.name)
            .then(that.controller.findSuccess(res))
            .catch(that.controller.findError(res));
    }

    findOne(req, res) {
        let that = this;
        that.dao.get(req.params.name, req.params.id)
            .then(that.controller.findSuccess(res))
            .catch(that.controller.findError(res));
    }

    accept(req, res) {
        let that = this;
        that.dao.update(req.params.name, req.params.id, 'accept')
            .then(that.controller.findSuccess(res))
            .catch(that.controller.findError(res));
    }

    reject(req, res) {
        let that = this;
        that.dao.update(req.params.name, req.params.id, 'reject')
            .then(that.controller.findSuccess(res))
            .catch(that.controller.findError(res));
    }

    ignore(req, res) {
        let that = this;
        that.dao.update(req.params.name, req.params.id, 'ignore')
            .then(that.controller.findSuccess(res))
            .catch(that.controller.findError(res));
    }

    undo(req, res) {
        let that = this;
        that.dao.update(req.params.name, req.params.id, null)
            .then(that.controller.findSuccess(res))
            .catch(that.controller.findError(res));
    }

    upload(req, res) {
        let that = this;
        console.log("files", req.files)
        if (req.files && req.files.length > 0) {
            var fileRows = [], fileHeader;
            const filePath = req.files[0].path
            console.log("file path", filePath)
            csv.fromPath(filePath, { headers: true })
                .on("data", function (data) {
                    fileRows.push(data); // push each row
                })
                .on("end", function () {
                    fs.unlinkSync(filePath);   // remove temp file
                    //process "fileRows"
                    const params = Object.assign({ id: null, type: null }, req.params, { data: fileRows })
                    that.dao.upload(req.params.name, fileRows)
                        .then(that.controller.findSuccess(res))
                        .catch(that.controller.findError(res));

                });
        }

    }
}

module.exports = DataSetController;