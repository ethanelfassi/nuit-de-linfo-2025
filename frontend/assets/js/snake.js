const manText = `RTFM(1)                                    General Commands Manual                                    RTFM(1)

NAME
       rtfm - Read The Fine Manual

SYNOPSIS
       rtfm [--help]

DESCRIPTION
       rtfm est un outil essentiel pour tout utilisateur. Il vous rappelle poliment, mais fermement,
       que la réponse à votre question se trouve probablement déjà dans la documentation.
       Par exemple, pour passer à la suite vous pouvez utiliser la commande 'snake' dans le terminal
       et avoir au moins 5 points.

EXIT STATUS
       0 si la lecture du manuel est considérée comme réussie (i.e., vous avez appuyé sur 'q').
       1 en cas d'erreur de lecture.

BUGS
       Aucun. La simplicité est la clé de la perfection.

AUTEUR
       Le Collectif des Développeurs fatigués.

                                        Décembre 2025                                                RTFM(1)
(END) - Appuyez sur 'q' pour quitter.
`;

const commandInput = document.getElementById('commandInput');
const canvasOutput = document.getElementById('canvasOutput');
const manPageOutput = document.getElementById('manPageOutput')

let isManPageVisible = false;

commandInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const command = commandInput.value.trim().toLowerCase();
        
        if (command === 'snake') {
            
            // 1. Affiche le canvas
            canvasOutput.hidden = false;
            
            // 2. Cache l'input et l'invite pour simuler le lancement du jeu
            commandInput.hidden = true;
            document.querySelector('.prompt').hidden = true;

            // 3. Lance le jeu (appel à resetGame pour initialiser si le jeu n'a pas encore démarré)
            resetGame();
            
        } else if (command === 'man rtfm') { // NOUVEAU : Commande man rtfm
            showManPage();
            
        } else {
            // Optionnel : Afficher un message d'erreur
            alert(`Erreur: Commande '${command}' non trouvée.`);
            commandInput.value = ''; // Effacer la saisie
        }
    }
});

// --- 1. Initialisation du Canvas et des Variables de Jeu ---

const canvas = document.getElementById('terminalCanvas');
const ctx = canvas.getContext('2d');

// Taille des segments (blocs) du serpent et de la grille
const gridSize = 20; // Chaque segment fait 20x20 pixels
const tileCountX = canvas.width / gridSize; // Largeur en tuiles (720 / 20 = 36)
const tileCountY = canvas.height / gridSize;

// Variables du Serpent
let snake = [
    { x: 10, y: 10 } // Position de départ au milieu de la grille
];
let headX = 10;
let headY = 10;

// Direction de déplacement (dx=vitesse horizontale, dy=vitesse verticale)
let velX = 1; // Commence en allant à droite
let velY = 0;

// Variables de la Nourriture
let foodX = 15;
let foodY = 15;

// Vitesse du jeu (fréquence de rafraîchissement)
let speed = 8; // Mouvements par seconde

// État du jeu
let score = 0;
let isGameOver = false;

// --- 2. Boucle Principale du Jeu ---

function gameLoop() {
    if (isGameOver) {   
        // NOUVEAU : Vérification de la condition de victoire/fin
        if (score >= 5) {
            gameSuccess(); // Appeler la fonction de succès si le score est de 10+
            return;
        }
        
        // Afficher le message de fin de jeu (défaite)
        drawGameOver();
        return;
    }

    // Fait avancer le serpent (mises à jour toutes les 1000/speed ms)
    setTimeout(gameLoop, 1000 / speed);

    // Mettre à jour la position de la tête
    headX += velX;
    headY += velY;

    // Vérifier les collisions avec les bords (perte si on sort)
    if (headX < 0 || headX >= tileCountX || headY < 0 || headY >= tileCountY) {
        isGameOver = true;
        return;
    }

    // Vérifier l'auto-collision (mordre sa propre queue)
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === headX && snake[i].y === headY) {
            isGameOver = true;
            return;
        }
    }

    // Ajouter la nouvelle tête à l'avant du serpent
    snake.unshift({ x: headX, y: headY });

    // Vérifier si le serpent a mangé la nourriture
    if (foodX === headX && foodY === headY) {
        score++;
        // Générer une nouvelle position pour la nourriture
        placeFood();
        // L'appel à snake.pop() est sauté, donc le serpent grandit d'un segment
    } else {
        // Si pas de nourriture mangée, enlever le dernier segment (déplacement)
        snake.pop();
    }

    // Dessin (nettoyage et dessin des éléments)
    drawEverything();
}


// --- 3. Fonctions de Dessin ---

function drawEverything() {
    // 1. Dessiner le fond (Noir)
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Dessiner la Nourriture (Rouge)
    ctx.fillStyle = 'red';
    ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize - 1, gridSize - 1);

    // 3. Dessiner le Serpent (Vert)
    ctx.fillStyle = 'lime'; // Vert vif
    snake.forEach((segment, index) => {
        // Dessine chaque segment
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
        
        // Ajouter un petit contour noir pour la tête
        if (index === 0) {
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;
                ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
        }
    });
    
    // 4. Afficher le Score
    ctx.fillStyle = 'white';
    ctx.font = '14px Consolas';
    ctx.fillText('Score: ' + score, 20, 20);
}

function drawGameOver() {
    // Si nous arrivons ici, cela signifie que isGameOver est true MAIS score < 10
    // (car si score >= 10, gameLoop appelle gameSuccess)
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'red';
    ctx.font = '30px Consolas';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2 - 20);
    
    ctx.fillStyle = 'white';
    ctx.font = '20px Consolas';
    ctx.fillText('Score final: ' + score, canvas.width / 2, canvas.height / 2 + 10);
    ctx.fillText('Appuyez sur ESPACE pour rejouer', canvas.width / 2, canvas.height / 2 + 40);
}

// --- 4. Gestion de la Nourriture ---

function placeFood() {
    do {
        foodX = Math.floor(Math.random() * tileCountX);
        foodY = Math.floor(Math.random() * tileCountY);
    } while (
        // S'assurer que la nourriture n'apparaît pas sur le serpent
        snake.some(segment => segment.x === foodX && segment.y === foodY)
    );
}

// --- 5. Gestion des Entrées (Touches du Clavier) ---

document.addEventListener('keydown', keyPush);

function keyPush(event) {

    if (isManPageVisible && event.key.toLowerCase() === 'q') {
        hideManPage();
        return; // Stoppe toute autre action
    }

    // Sauvegarde de la dernière direction pour éviter de se retourner instantanément
    const prevVelX = velX;
    const prevVelY = velY;

    switch(event.key) {
        case 'ArrowLeft':
        case 'q': // Touche 'q' (gauche)
            if (prevVelX === 1) return; // Ne permet pas de faire demi-tour
            velX = -1; velY = 0;
            break;
        case 'ArrowUp':
        case 'z': // Touche 'z' (haut)
            if (prevVelY === 1) return;
            velX = 0; velY = -1;
            break;
        case 'ArrowRight':
        case 'd': // Touche 'd' (droite)
            if (prevVelX === -1) return;
            velX = 1; velY = 0;
            break;
        case 'ArrowDown':
        case 's': // Touche 's' (bas)
            if (prevVelY === -1) return;
            velX = 0; velY = 1;
            break;
        case ' ': // Touche Espace pour recommencer
            if (isGameOver) {
                resetGame();
            }
            break;
    }
}

function showManPage() {
    isManPageVisible = true;
    
    // Cache l'input et l'invite
    commandInput.hidden = true;
    document.querySelector('.prompt').hidden = true;
    
    // Affiche la zone du manuel et son contenu
    manPageOutput.innerHTML = manText;
    manPageOutput.hidden = false;
    
    // Déplace le focus vers la fenêtre (pour que 'q' fonctionne sans cliquer)
    window.focus(); 
}

function hideManPage() {
    isManPageVisible = false;
    
    // Cache la zone du manuel
    manPageOutput.hidden = true;
    
    // Réaffiche l'input et l'invite
    commandInput.hidden = false;
    document.querySelector('.prompt').hidden = false;
    commandInput.value = ''; // Efface la commande après exécution
    commandInput.focus(); // Rétablit le focus sur l'input
}

// --- 6. Fonction de Réinitialisation ---

function resetGame() {
    isGameOver = false;
    score = 0;
    headX = 10;
    headY = 10;
    velX = 1;
    velY = 0;
    snake = [{ x: 10, y: 10 }];
    placeFood(); // Placer la nourriture au début
    gameLoop(); // Redémarrer la boucle de jeu
}

function gameSuccess() {
    // 1. Dessiner l'écran de succès sur le canvas
    ctx.fillStyle = 'rgba(46, 52, 54, 0.9)'; // Fond presque opaque, couleur du terminal
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#4CAF50'; // Vert pour le succès
    ctx.font = '30px Consolas';
    ctx.textAlign = 'center';
    ctx.fillText('MISSION ACCOMPLIE !', canvas.width / 2, canvas.height / 2 - 20);
    
    ctx.fillStyle = 'white';
    ctx.font = '20px Consolas';
    ctx.fillText(`Score atteint: ${score} points`, canvas.width / 2, canvas.height / 2 + 10);
    ctx.fillText('Terminal fermé.', canvas.width / 2, canvas.height / 2 + 40);
    
    
    // 2. Cacher le terminal après un court délai
    const terminalWindow = document.querySelector('.terminal-window');
    
    setTimeout(() => {
        if (terminalWindow) {
            terminalWindow.hidden = true;
            incrementerAvancement();
            // Optionnel : Vous pourriez ici afficher le prochain élément de l'énigme
        }
    }, 3000); // 3 secondes de délai pour lire le message de succès
}
