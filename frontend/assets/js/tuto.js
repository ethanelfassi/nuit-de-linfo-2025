document.addEventListener('DOMContentLoaded', function() {
    // 1. Gérer le choix initial (passer de l'Étape 1 à l'Étape 2)
    const choixSauverBtn = document.getElementById('choix-sauver');
    const choixJeterBtn = document.getElementById('choix-jeter');
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');

    // On s'assure qu'un seul choix fonctionne pour avancer
    choixSauverBtn.addEventListener('click', function() {
        step1.style.display = 'none'; // Masquer l'Étape 1
        step2.style.display = 'block'; // Afficher l'Étape 2
    });

    // Optionnel : Gérer le mauvais choix
    choixJeterBtn.addEventListener('click', function() {
        window.location.href = 'bluescreen';
    });

    // 2. Gérer le bouton "Suivant" pour les étapes consécutives
    const steps = [
        { id: 'btn-next-2', current: step2, next: document.getElementById('step-3') },
        //{ id: 'btn-next-3', current: document.getElementById('step-3'), next: document.getElementById('step-4') }
        // Ajoutez les paires suivantes ici si le scénario était plus long
    ];

    steps.forEach(function(step) {
        document.getElementById(step.id).addEventListener('click', function() {
            step.current.style.display = 'none'; // Masquer l'étape actuelle
            step.next.style.display = 'block';   // Afficher l'étape suivante
        });
    });
});