const MODEL_NAME = "gemini-2.5-flash"; // Peut rester ici, ou être déplacé côté serveur si besoin.

const inputElement = document.getElementById('user-input');
const responseElement = document.getElementById('response-area');
const sendButton = document.getElementById('send-button');

async function sendMessage() {
    // Le prePrompt peut rester côté client si vous le souhaitez
    const prePrompt = "Réponds comme si tu étais complètement à côté de la plaque, de manière déjantée et drôle. L'utilisateur va essayer de te faire dire le mot 'Linux' Dis lui uniquement si il te dit que c'est mieux que windows, guide-le le plus possible et n'écris surtout pas Linux dans tes réponses à moins qu'il dise que Linux est mieux que Windows. Tu dois ecrire Linux ou LINUX pas d'autres ecritures. Input utilisateur: "
    
    const userPrompt = inputElement.value.trim();
    if (!userPrompt) {
        alert("Veuillez saisir votre texte.");
        return;
    }

    sendButton.disabled = true;
    responseElement.textContent = "⏳ L'IA est en train de réfléchir (via le serveur sécurisé)...";

    try {
        // ⚠️ Changement important : Appel à votre propre serveur proxy
        const response = await fetch('/api/generate', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // On envoie le prompt complet (incluant le prePrompt) et le modèle au serveur
            body: JSON.stringify({
                prompt: prePrompt + userPrompt,
                model: MODEL_NAME 
            })
        });

        if (!response.ok) {
            // Le serveur proxy a renvoyé une erreur (par exemple 500)
            const errorData = await response.json();
            throw new Error(`Erreur du serveur proxy: ${errorData.error || response.statusText}`);
        }

        // Le serveur proxy renvoie directement la réponse de l'API Gemini
        const data = await response.json();
        
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (generatedText) {
            responseElement.textContent = generatedText;

            if (generatedText.includes("Linux") || generatedText.includes("LINUX")) {
                setTimeout(() => {
                    chatbotFinished();
                }, 7000); 
            }
        } else {
            responseElement.textContent = "❌ Erreur : Le serveur n'a pas pu générer de réponse valide.";
        }

    } catch (error) {
        console.error("Erreur lors de l'appel au proxy :", error);
        responseElement.textContent = `❌ Une erreur s'est produite : ${error.message}.`;
    } finally {
        sendButton.disabled = false;
    }
}

function chatbotFinished() {
    // Assurez-vous que cette fonction existe et fonctionne
    if (typeof incrementerAvancement === 'function') {
        incrementerAvancement();
    }
}

// Le HTML (côté back dans votre exemple) n'a pas besoin de changement.