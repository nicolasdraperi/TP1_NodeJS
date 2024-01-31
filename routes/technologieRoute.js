const express = require("express")
const Route = express.Router()
const technologieController = require("../controllers/technologieController")

Route.get('/technologies', technologieController.listeTechnologies);
Route.post('/technologies', technologieController.authenticator_tech, technologieController.creerTechnologie);
Route.put('/technologies/:id', technologieController.authenticator_tech, technologieController.modifierTechnologie);
Route.delete('/technologies/:id', technologieController.authenticator_tech, technologieController.supprimerTechnologie);

module.exports = Route;