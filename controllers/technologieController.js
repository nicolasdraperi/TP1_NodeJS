const { JsonWebTokenError } = require('jsonwebtoken');
const pool = require('../database/database')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

//middleware
exports.authenticator_tech = async (req, res, next) => {
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

                    if (result.length > 0 && result[0].role === 'admin') {
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



exports.listeTechnologies = async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM technologie");
        conn.release();
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération des technologies" });
    }
};

exports.creerTechnologie = async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const { nom_techno, date_creation } = req.body;
        const insertTechnoQuery = "INSERT INTO technologie (nom_techno, date_creation) VALUES (?, ?)";
        const insertTechnoValues = [nom_techno, date_creation];
        await conn.query(insertTechnoQuery, insertTechnoValues);
        const newTechno = await conn.query("SELECT * FROM technologie ORDER BY id DESC LIMIT 1");
        conn.release();
        res.status(200).json(newTechno);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la création de la technologie" });
    }
};

exports.modifierTechnologie = async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const id = req.params.id;
        const { nom_techno, date_creation } = req.body;
        const technoExists = await conn.query("SELECT * FROM technologie WHERE id = ?", [id]);
        if (technoExists.length === 0) {
            conn.release();
            return res.status(404).json({ error: "Technologie non trouvée" });
        }
        const updateTechnoQuery = "UPDATE technologie SET nom_techno = ?, date_creation = ? WHERE id = ?";
        const updateTechnoValues = [nom_techno, date_creation, id];
        await conn.query(updateTechnoQuery, updateTechnoValues);
        const updatedTechno = await conn.query("SELECT * FROM technologie WHERE id = ?", [id]);
        conn.release();
        res.status(200).json(updatedTechno);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la modification de la technologie" });
    }
};

exports.supprimerTechnologie = async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const id = req.params.id;
        const technoExists = await conn.query("SELECT * FROM technologie WHERE id = ?", [id]);
        if (technoExists.length === 0) {
            conn.release();
            return res.status(404).json({ error: "Technologie non trouvée" });
        }
        await conn.query("DELETE FROM technologie WHERE id = ?", [id]);
        const remainingTechnos = await conn.query("SELECT * FROM technologie");
        conn.release();
        res.status(200).json(remainingTechnos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la suppression de la technologie" });
    }
};