const Error = require("../common/error");

module.exports = function (app, controller) {

    const defaultRoute = "/meta/"

    app.get(defaultRoute, (req, res) => {
        controller.findAll(req, res);
    });

    app.get(defaultRoute + ":id/", (req, res) => {
        controller.findOne(req, res);
    });

    app.post(defaultRoute, (req, res) => {
        controller.create(req, res);
    });



}