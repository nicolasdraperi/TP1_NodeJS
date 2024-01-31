const express = require("express")
const Route = express.Router()
const utilisateurController = require("../controllers/utilisateurController")

Route.get("/utilisateurs",utilisateurController.authenticator,utilisateurController.getUtilisateurs);
Route.get("/utilisateur",utilisateurController.getUtilisateurs);
Route.post("/inscription",utilisateurController.inscription);
Route.post("/login",utilisateurController.login);
Route.put("/utilisateurs/:id", utilisateurController.modifier);
Route.delete("/utilisateurs/:id", utilisateurController.supprimer);


module.exports = Route 