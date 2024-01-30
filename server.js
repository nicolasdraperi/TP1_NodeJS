const express = require("express");
let cors = require("cors");
const app = express();
const pool = require("./database.js");
app.use(cors());
app.use(express.json());



app.get("/utilisateurs", async (req, res) => {

    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM utilisateur")
    conn.release()
    res.status(200).json(rows);

});
app.post("/utilisateurs", async (req, res) => {
    conn = await pool.getConnection();
    let nom = req.body.nom;
    let prenom = req.body.prenom;
    let email = req.body.email;
    const rows = await pool.query(`INSERT INTO Utilisateur (nom, prenom, email) VALUES (?,?,?)`, [nom, prenom, email]);
    const rows2 = await conn.query("SELECT * FROM utilisateur")
    conn.release();
    res.status(200).json(rows2);


});
app.put("/utilisateurs/:id", async (req, res) => {


    conn = await pool.getConnection();
    const id = req.params.id;

    let nom = req.body.nom;
    let prenom = req.body.prenom;
    let email = req.body.email;

    const rows = await pool.query("UPDATE Utilisateur SET nom = ?, prenom = ?, email = ? WHERE id = ?", [nom, prenom, email, id]);
    const rows2 = await conn.query("SELECT * FROM utilisateur")
    conn.release();
    res.status(200).json(rows2);
});
app.delete("/utilisateurs/:id", async (req, res) => {

    conn = await pool.getConnection();
    const id = req.params.id;
    const rows = await pool.query("DELETE FROM Utilisateur WHERE id = ?", [id]);

    const rows2 = await conn.query("SELECT * FROM utilisateur")
    conn.release();
    res.status(200).json(rows2);
});
app.post("/commentaires", async (req, res) => {
    const conn = await pool.getConnection();

    let date_creation_commentaire = req.body.date_creation_commentaire;
    let utilisateur_id = req.body.utilisateur_id;
    let technologie_id = req.body.technologie_id;
    const newComment = await pool.query(
        "INSERT INTO Commentaire (date_creation_commentaire, utilisateur_id, technologie_id) VALUES (?, ?, ?) RETURNING *",
        [date_creation_commentaire, utilisateur_id, technologie_id]
    );

    const rows2 = await pool.query("SELECT * FROM Commentaire");

    conn.release();

    res.status(200).json(rows2);
});

app.get("/commentaires/technologie/:id", async (req, res) => {

    const technologie_id = req.params.id;
    const rows1 = await pool.query("SELECT * FROM Commentaire WHERE technologie_id = ? ", [technologie_id]);
    res.json(rows1);

});
app.get("/commentaires/utilisateur/:id", async (req, res) => {

    const utilisateur_id = req.params.id;
    const rows1 = await pool.query("SELECT * FROM Commentaire WHERE utilisateur_id = ? ", [utilisateur_id]);
    res.json(rows1);

});

app.get("/commentaires/date/:date", async (req, res) => {

    const date = req.params.date;
    const rows = await pool.query("SELECT * FROM Commentaire WHERE date_creation_commentaire < ?", [date]);
    res.json(rows);

});


// Partie fonction :
async function testGetUsers() {

    const result = await fetch('http://localhost:8000/utilisateurs');
    const aff = await result.json();
    document.getElementById('liste_utilisateur').innerHTML = JSON.stringify(aff, null, 2);

}
async function testGetComById() {

    const id = document.getElementById('Id').value;
    const url = `http://localhost:8000/commentaires/technologie/${id}`;

    const result = await fetch(url);
    const aff = await result.json();
    document.getElementById('liste_commentaire').innerHTML = JSON.stringify(aff, null, 2);
}


app.listen(8000, () => {
    console.log("serveur lancer sur le port 8000");
})
