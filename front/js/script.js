fetch("http://localhost:3000/api/products")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (products) {

    // Ajout de la liste des informations "products" dans la fonction "displayProducts" pour les récupérer ensuite
    displayProducts(products);

  })
  .catch(error => {
    // console.dir(error)
    if (error.message === "Failed to fetch"){
      error = error.message;
      ErrorMessage(error);
    }
  });
;

function ErrorMessage(error) {
  console.log(error);
  if (error === 404) {
    alert('ERREUR : Le liens n existe pas')
  }
  if (error === "Failed to fetch") {
    alert('ERREUR : API non démarer')
  }
  
  // let ErreurH1 = "Erreur"
  // document.querySelector('.titles h1').innerHTML = ErreurH1;

  // let messageError = "API non démarer"

  // document.querySelector('.titles h2').innerHTML = messageError;  
};

function displayProducts(products) {
  // Création d'une boucle pour afficher tout les éléments avec leurs informations tant qu'il en a encore avec la meme structure vennent de la liste "products" qui sera nommer ici en "element"
  if (products) {
    products.forEach(element => {
      
      // Création basile "a"
      let liensA = document.createElement("a");
      // Ajout de l'attribut "href" a la basile "a"
      liensA.setAttribute("href", "./product.html?id="+element._id);

      let article = document.createElement("article");

      let image = document.createElement("img");
      image.setAttribute("src", element.imageUrl);
      image.setAttribute("alt", element.altTxt);

      let titreH3 = document.createElement("h3");
      // Création de la classe "productName" au "h3"
      titreH3.classList.add("productName")
      // Incrémentation du nom récupérer pour "productName"
      titreH3.textContent = element.name;

      let paragraphe = document.createElement("p");
      paragraphe.classList.add("productDescription")
      paragraphe.textContent = element.description;

      // Classement d'ordre d'affichage parents/enfants
      liensA.appendChild(article);
      article.appendChild(image);
      article.appendChild(titreH3);
      article.appendChild(paragraphe);

      // Classement d'ordre d'affichage de "liensA" qui sera enfants de l'éléments avec l'id "items"
      document.getElementById("items").appendChild(liensA);
    })
  }
  // Table des canapés
  // console.table(products);
}