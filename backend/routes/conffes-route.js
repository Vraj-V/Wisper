const express = require("express");

const Router = express.Router();
const confessionController = require("../Controllers/confession-controller")

Router.get('/', confessionController.getConfession);

Router.post('/',confessionController.createConfesion);

Router.put('/:cid',confessionController.updateConfession)
Router.delete("/:cid",confessionController.deleteConfession)


module.exports = Router;