function openTerminal() {
  const terminal = document.getElementById("terminal-snake");
  terminal.style.display = 'block';
}

function openChatbot() {
  const chatbot = document.getElementById("chatbot");
  chatbot.style.display = 'block';
}

function fermerFenetre(idElement) {
  const fenetre = document.getElementById(idElement);
  fenetre.style.display = 'none';
}

function openQuetes() {
  const quetes = document.getElementById("journal-quetes");
  quetes.style.display = 'block';
}

/*
function incrementerAvancement() {
  fetch('/incrementer-avancement', {
    method: 'POST'
  })
  .then(res => res.json())
  .then(data => {
    console.log('Nouvel Avancement :', data.nouvelAvancement);

    if (data.nouvelAvancement >= 2) {
      console.log("gg")
      window.location.href = '/';
    }
    // Optionnel : mettre à jour l'affichage immédiatement après l'incrémentation
    document.getElementById('avancement').textContent = data.nouvelAvancement;
  })
  .catch(error => console.error('Erreur d\'incrémentation:', error));
}

function recupererAvancement() {
  fetch('/get-avancement') // Par défaut, la méthode est GET
  .then(res => res.json())
  .then(data => {
    console.log('Avancement initial chargé :', data.avancement);
    console.log(document.getElementById('avancement').textContent)
  })
  .catch(error => console.error('Erreur de récupération:', error));
}

// Exemple : appeler cette fonction quand un bouton est cliqué
// document.getElementById('bouton-etape-suivante').addEventListener('click', incrementerAvancement);

*/

function incrementerAvancement() {
  avancement = recupererAvancement();
  avancement.textContent = parseInt(avancement.textContent) + 1;

  if (avancement.textContent >= 2) {
    window.location.href = "/fin"
  }

}

function recupererAvancement() {
    return document.getElementById('avancement')
}