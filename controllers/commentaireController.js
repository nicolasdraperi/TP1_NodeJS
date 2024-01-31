const { JsonWebTokenError } = require('jsonwebtoken');
const pool = require('../database/database')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// c'est vraiment pas beau :c
exports.authenticator_com = async (req, res, next) => {
    const token = req.body.token ? req.body.token : req.headers.authorization;

    if (token) {
        jwt.verify(token, process.env.API_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json("Action non autorisé 1");
            } else {
                try {
                    const conn = await pool.getConnection();
                    const result = await conn.query("SELECT role FROM utilisateur WHERE email = ?", [decoded.email]);
                    conn.release();
                    next()

                } catch (error) {
                    console.error(error);
                    return res.status(500).json({ error: "Action non autorisé 3" });
                }
            }
        });
    } else {
        return res.status(401).json('Action non autorisé 4');
    }
};

exports.isJournsaliste = async (req, res, next) => {
    const token = req.body.token ? req.body.token : req.headers.authorization;

    if (token) {
        jwt.verify(token, process.env.API_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json("Action non autorisé 1");
            } else {
                try {
                    const conn = await pool.getConnection();
                    const result = await conn.query("SELECT role FROM utilisateur WHERE email = ?", [decoded.email]);
                    conn.release();

                    if (result.length > 0 && result[0].role === 'journaliste') {
                        next();
                    } else {
                        return res.status(403).json("Action non autorisé 2");
                    }
                } catch (error) {
                    console.error(error);
                    return res.status(500).json({ error: "Action non autorisé 3" });
                }
            }
        });
    } else {
        return res.status(401).json('Action non autorisé 4');
    }
};




exports.creerCommentaire = async (req, res) => {
    const conn = await pool.getConnection();

    let date_creation_commentaire = req.body.date_creation_commentaire;
    let commentaire = req.body.commentaire;
    let utilisateur_id = req.body.utilisateur_id;
    let technologie_id = req.body.technologie_id;

    const newComment = await pool.query(
        "INSERT INTO Commentaire (date_creation_commentaire, commentaire, utilisateur_id, technologie_id) VALUES (?, ?, ?, ?) RETURNING *",
        [date_creation_commentaire, commentaire, utilisateur_id, technologie_id]
    );

    const rows2 = await pool.query("SELECT * FROM Commentaire");

    conn.release();

    res.status(200).json(rows2);
};

exports.getCommentairesByTechnologie = async (req, res) => {
    const technologie_id = req.params.id;
    const rows1 = await pool.query("SELECT * FROM Commentaire WHERE technologie_id = ?", [technologie_id]);
    res.json(rows1);
};

exports.getCommentairesByUtilisateur = async (req, res) => {
    const utilisateur_id = req.params.id;
    const rows1 = await pool.query("SELECT * FROM Commentaire WHERE utilisateur_id = ?", [utilisateur_id]);
    res.json(rows1);
};

exports.getCommentairesByDate = async (req, res) => {
    const date = req.params.date;
    const rows = await pool.query("SELECT * FROM Commentaire WHERE date_creation_commentaire < ?", [date]);
    res.json(rows);
};
exports.listeCommentaire = async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM commentaire");
        conn.release();
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération des technologies" });
    }
};

exports.creerCommentaireMaisHashe = async (req, res) => {
    const conn = await pool.getConnection();

    let date_creation_commentaire = req.body.date_creation_commentaire;
    let commentaire = req.body.commentaire;
    let utilisateur_id = req.body.utilisateur_id;
    let technologie_id = req.body.technologie_id;
    
    
    const hashedCom = await bcrypt.hash(commentaire, 10);

    const newComment = await pool.query(
        "INSERT INTO Commentaire (date_creation_commentaire, commentaire, utilisateur_id, technologie_id) VALUES (?, ?, ?, ?) RETURNING *",
        [date_creation_commentaire, hashedCom, utilisateur_id, technologie_id]
    );

    const rows2 = await pool.query("SELECT * FROM Commentaire");

    conn.release();

    res.status(200).json(rows2);
};
