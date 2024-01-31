const express = require("express")
const Route = express.Router()
const commentaireController = require("../controllers/commentaireController")


Route.get('/commentaires/technologie/:id', commentaireController.getCommentairesByTechnologie);
Route.get('/commentaires/utilisateur/:id', commentaireController.getCommentairesByUtilisateur);
Route.get('/commentaires/date/:date', commentaireController.getCommentairesByDate);

Route.post("/commentaires", commentaireController.authenticator_com, commentaireController.isJournsaliste, commentaireController.creerCommentaire);
Route.get("/commentaires", commentaireController.authenticator_com, commentaireController.listeCommentaire);



module.exports = Route;