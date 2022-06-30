const params = new URLSearchParams(location.search);

// récuperation du paramettre "id" dans le liens
const orderId = params.get("id");

// ajout de l'id recuperer pour le mettre dans le span "orderId"
const CommandeId = document.getElementById("orderId");
CommandeId.textContent = (orderId);

// suppression du panier
localStorage.clear();