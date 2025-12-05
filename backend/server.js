// import express module and create your express app
const express = require('express');
const session = require('express-session');
// ⚠️ Importez node-fetch pour les appels API sortants
const nodeFetch = require('node-fetch'); 
const fetch = nodeFetch.default;
const app = express();

// --- SÉCURITÉ : CLÉ D'API GEMINI ---
// 🛑 IMPORTANT : Cette clé est lue depuis l'environnement (Render). 
// NE JAMAIS écrire la clé en clair ici.
const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY; 

if (!GEMINI_API_KEY) {
    console.error("ERREUR DE CONFIGURATION: La variable d'environnement GOOGLE_AI_API_KEY n'est pas définie. Veuillez la configurer sur Render.");
    // Empêcher le serveur de démarrer si le secret est manquant
    process.exit(1); 
}
// ------------------------------------

app.use(session({
    secret: 'votre_secret_tres_long_et_securise', // Clé secrète pour signer le cookie de session
    resave: false, 
    saveUninitialized: true, 
    cookie: { maxAge: 6000000 } 
}));

// set the server host and port (Utilisez process.env.PORT pour Render)
const port = process.env.PORT || 3000;

// add data to req.body (for POST requests)
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Indispensable pour lire le JSON envoyé par le client

app.set('view engine', 'ejs');
app.set('views', './views');

// serve static files 
app.use(express.static('../frontend')); 

const indexRouter = require('./routers/index.js');
app.use('/', indexRouter); 

const bluescreenRouter = require('./routers/bluescreen.js');
app.use('/bluescreen', bluescreenRouter); 

const finRouter = require('./routers/fin.js');
app.use('/fin', finRouter); 

// --- NOUVEL ENDPOINT PROXY SÉCURISÉ POUR GEMINI ---
app.post('/api/generate', async (req, res) => {
    // Récupérer le prompt et le modèle envoyés par le client (qui ne connaît pas la clé)
    const { prompt, model } = req.body; 

    if (!prompt || !model) {
        return res.status(400).json({ error: "Les paramètres 'prompt' et 'model' sont requis dans le corps de la requête." });
    }

    try {
        // L'appel à l'API Gemini est fait ici, côté serveur, en utilisant la clé secrète
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // La clé est utilisée dans l'URL de l'API Gemini ici
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            })
        });

        if (!geminiResponse.ok) {
            const errorDetails = await geminiResponse.json();
            console.error("Erreur de l'API Gemini:", errorDetails);
            // Renvoyer l'erreur de Gemini au client avec le statut approprié
            return res.status(geminiResponse.status).json({ 
                error: "Erreur lors de la communication avec l'API Gemini", 
                details: errorDetails 
            });
        }

        const data = await geminiResponse.json();
        
        // Renvoyer la réponse de Gemini directement au client
        res.json(data);

    } catch (error) {
        console.error("Erreur du serveur proxy interne:", error);
        res.status(500).json({ error: "Erreur interne lors du traitement de la requête." });
    }
});
// ----------------------------------------------------


// 404 (doit rester la DERNIÈRE route)
app.use('*', function(req, res){
    res.status(404);
    res.sendFile("404.html", {root: "../frontend"});
});

// run the server
app.listen(port, () => {
    // callback executed when the server is launched
    console.log(`http://localhost:${port}`);
    // Rappel de sécurité
    console.log("RAPPEL: La clé Gemini est lue via process.env.GOOGLE_AI_API_KEY.");
});