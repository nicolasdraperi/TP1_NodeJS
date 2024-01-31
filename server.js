const express = require("express");
let cors = require("cors");
const app = express();
const utilisateur = require('./routes/utilisateurRoute.js');
const technologie = require('./routes/technologieRoute.js');
const commentaire = require('./routes/commentaireRoute.js');


 
app.use(cors()); 
app.use(express.json());
app.use("/user", utilisateur);
app.use("/tech", technologie);
app.use("/com", commentaire)
 




// Partie fonction :
async function testGetUsers() {

    const result = await fetch('http://localhost:8000/user/utilisateur');
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
async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://127.0.0.1:8000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            alert(errorMessage);  
            return;
        }
        const token = await response.json();
        localStorage.setItem('token', token);
        alert('Login successful!\nToken: ' + token);
        
    } catch (error) { 
        console.error('Error during login:', error);
        alert('An error occurred during login. Please try again.');
    }
}

app.listen(8000, () => { 
    console.log("serveur lancer sur le port 8000");
})
