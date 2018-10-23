const Error = require("../common/error");
const multer = require('multer')
var upload = multer({ dest: './' })

module.exports = function (app, controller) {

    const defaultRoute = "/ds/:name/"

    app.get("/ds/", (req, res) => {
        controller.findMap(req, res);
    });

    app.get(defaultRoute, (req, res) => {
        controller.findAll(req, res);
    });

    app.put(defaultRoute + "upload/", upload.any(), (req, res) => {

        controller.upload(req, res);
    });

    app.get(defaultRoute + "stats/", (req, res) => {
        controller.findStats(req, res);
    });


    app.get(defaultRoute + ":id/", (req, res) => {
        controller.findOne(req, res);
    });


    app.put(defaultRoute + ":id/accept", (req, res) => {
        controller.accept(req, res);
    });

    app.put(defaultRoute + ":id/reject", (req, res) => {
        controller.reject(req, res);
    });

    app.put(defaultRoute + ":id/ignore", (req, res) => {
        controller.ignore(req, res);
    });

    app.put(defaultRoute + ":id/undo", (req, res) => {
        controller.undo(req, res);
    });



}