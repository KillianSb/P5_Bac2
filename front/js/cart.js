
//appel du panier situé dans le local storage, pour pouvoir l'exploiter
const panier = JSON.parse(localStorage.getItem("panier"));
if (panier) {
  cart();
};

function cart() {
  let cartItems = document.getElementById("cart__items")
  panier.forEach(element => {
    fetch("http://localhost:3000/api/products/"+element.id)
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then(function (product) {

        // console.table(element);

        // article cart__item
        let cartItem = document.createElement("article");
        cartItem.classList.add("cart__item")
        cartItem.setAttribute("data-id", element.id);
        cartItem.setAttribute("data-color", element.color);
      
        cartItems.appendChild(cartItem);

        // div cart__item__img
        let cartItemDivImg = document.createElement("div");
        cartItemDivImg.classList.add("cart__item__img")

        cartItem.appendChild(cartItemDivImg);

        // img cart__item__img
        let cartItemImg = document.createElement("img");
        cartItemImg.setAttribute("src", product.imageUrl);
        cartItemImg.setAttribute("alt", product.altTxt);

        cartItemDivImg.appendChild(cartItemImg);

        // div cart__item__content
        let cartItemContent = document.createElement("div");
        cartItemContent.classList.add("cart__item__content")

        cartItem.appendChild(cartItemContent);

        // div cart__item__content__description
        let productDescription = document.createElement("div");
        productDescription.classList.add("cart__item__content__description")

        cartItemContent.appendChild(productDescription);

        // h2 cart__item__content__description
        let productTitre = document.createElement("h2");
        productTitre.textContent = product.name;

        // p cart__item__content__description
        let productColor = document.createElement("p");
        productColor.textContent = element.color;

        let productPrice = document.createElement("p");
        productPrice.textContent = product.price + "€";
        // console.log(product.price);

        productDescription.appendChild(productTitre);
        productDescription.appendChild(productColor);
        productDescription.appendChild(productPrice);

        // div cart__item__content__settings
        let CartItemSettings = document.createElement("div");
        CartItemSettings.classList.add("cart__item__content__settings")

        cartItemContent.appendChild(CartItemSettings);

        // div cart__item__content__settings__quantity
        let CartItemSettingsQuantity = document.createElement("div");
        CartItemSettingsQuantity.classList.add("cart__item__content__settings__quantity")

        CartItemSettings.appendChild(CartItemSettingsQuantity);

        // p cart__item__content__settings__quantity pour la quantité
        let CartItemQuantityP = document.createElement("p");
        CartItemQuantityP.textContent = "Qté : ";
  
        CartItemSettingsQuantity.appendChild(CartItemQuantityP);

        // input cart__item__content__settings__quantity pour le choix de la quantité
        let CartItemQuantity = document.createElement("input");
        CartItemQuantity.setAttribute("type", "number");
        CartItemQuantity.classList.add("itemQuantity")
        CartItemQuantity.setAttribute("name", "itemQuantity");
        CartItemQuantity.setAttribute("min", "1");
        CartItemQuantity.setAttribute("max", "100");
        CartItemQuantity.setAttribute("value", element.quantity);

        CartItemQuantity.addEventListener('input', modifier);

        CartItemSettingsQuantity.appendChild(CartItemQuantity);

        // div cart__item__content__settings__delete
        let CartItemDelete = document.createElement("div");
        CartItemDelete.classList.add("cart__item__content__settings__delete")

        CartItemSettings.appendChild(CartItemDelete);

        // p contenant le texte "Supprimer"
        let CartItemDeleteP = document.createElement("p");
        CartItemDeleteP.classList.add("deleteItem")
        CartItemDeleteP.textContent = "Supprimer";

        CartItemDeleteP.addEventListener('click', supprimer);

        CartItemDelete.appendChild(CartItemDeleteP);


      })
      .catch(error => {
        // console.dir(error)
        if (error.message === "Failed to fetch"){
          error = error.message;
          ErrorMessage(error);
        }
      });
  })
  total();
}

function ErrorMessage(error) {
  console.log(error);
  if (error === 404) {
    alert('ERREUR : Le liens n existe pas')
  }
  if (error === "Failed to fetch") {
    alert('ERREUR : API non démarer')
  }

  // let ErreurH1 = "Erreur"
  // document.querySelector('.cartAndFormContainer h1').innerHTML = ErreurH1;

  // let messageError = "API non démarer"
  // document.querySelector('.cart__price p').innerHTML = messageError;
};

function total() {
  let quantites = 0;
  let price = 0;
  const panier = JSON.parse(localStorage.getItem("panier"));
  panier.forEach(element => {
    fetch("http://localhost:3000/api/products/"+ element.id)
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then(function (product) {
        quantites = element.quantity + quantites;
        price = (product.price * element.quantity) + price;
        // console.log(product.price * element.quantity);

        // span pour la quantité
        const quantiteTotale = document.getElementById("totalQuantity");
        quantiteTotale.textContent = quantites;

        // span pour le prix
        const prixTotale = document.getElementById("totalPrice");
        prixTotale.textContent = price;

      })
      .catch(error => console.error(error));
  })
}

function supprimer(event) {
  const panier = JSON.parse(localStorage.getItem("panier"));
  const article = event.target.closest("article");
  const articleId = article.dataset.id;
  const articleColor = article.dataset.color;
  const update = panier.filter(panier => articleId != panier.id || articleColor != panier.color)

  article.remove();
  localStorage.setItem("panier", JSON.stringify(update));
  total();
}

function modifier(event) {
  const panier = JSON.parse(localStorage.getItem("panier"));
  const articleQuantity = Number(event.target.value);
  const article = event.target.closest("article");
  const articleId = article.dataset.id;
  const articleColor = article.dataset.color;
  const update = panier.find(panier => articleId == panier.id && articleColor == panier.color);

  if (articleQuantity === 0){
    alert("Vous ne pouvez pas commander 0 canapé !")
    supprimer(event);
  }

  update.quantity = articleQuantity;
  
  localStorage.setItem("panier", JSON.stringify(panier));
  total();
}

document.getElementById('order').addEventListener('click', commander);

const nameRegex = /^[A-zÀ-ú' -]+$/;

const adressRegex = /([0-9]{1,}) ?([A-zÀ-ú,' -. ]*)/;

const mailRegex = /^[A-z0-9-_.]{1,}[@][A-z-]{2,}[.][A-z]{2,}$/;

function commander(event) {
  event.preventDefault();

  // récuperation des valeur entrer
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;
  let address = document.getElementById("address").value;
  let city = document.getElementById("city").value;
  let email = document.getElementById("email").value;

  // récuperation des id des erreurs
  const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
  const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
  const addressErrorMsg = document.getElementById("addressErrorMsg");
  const cityErrorMsg = document.getElementById("cityErrorMsg");
  const emailErrorMsg = document.getElementById("emailErrorMsg");

  let isGood = true;

  // vérification entrer input
  // si 'firstName' marche avec le RegexName alors pas de message erreur
  if (firstName.match(nameRegex)) {
    firstNameErrorMsg.textContent = '';
  } else if (firstName == "") {
    // si 'firstName' est egal a (null) alors afficher message d'erreur 1
    firstNameErrorMsg.textContent = 'Veuillez saisir un prénom.';
    isGood = false;
  } else {
    // si 'firstName' ne match pas avec le RegexName alors afficher message d'erreur 2
    firstNameErrorMsg.textContent = 'Veuillez saisir un prénom valide.';
    isGood = false;
  }

  if (lastName.match(nameRegex)) {
    lastNameErrorMsg.textContent = ''
  } else if (lastName == "") {
    lastNameErrorMsg.textContent = 'Veuillez saisir un nom.';
    isGood = false;
  } else {
    lastNameErrorMsg.textContent = 'Veuillez saisir un nom valide.';
    isGood = false;
  }

  if (address.match(adressRegex)) {
    addressErrorMsg.textContent = '';
  } else if (address == "") {
    addressErrorMsg.textContent = 'Veuillez saisir une adresse.';
    isGood = false;
  } else {
    addressErrorMsg.textContent = 'Veuillez saisir une adresse valide.';
    isGood = false;
  }

  if (city.match(nameRegex)) {
    cityErrorMsg.textContent = '';
  } else if (city == "") {
    cityErrorMsg.textContent = 'Veuillez saisir une ville.';
    isGood = false;
  } else {
    cityErrorMsg.textContent = 'Veuillez saisir une ville valide.';
    isGood = false;
  }

  if (email.match(mailRegex)) {
    emailErrorMsg.textContent = '';
  } else if (email == "") {
    emailErrorMsg.textContent = 'Veuillez saisir un email.';
    isGood = false;
  } else {
    emailErrorMsg.textContent = 'Veuillez saisir un email valide.';
    isGood = false;
  }

  if (isGood == false) {
    return;
  }

  // création de tableau contact
  let contact = {
    firstName: firstName,
    lastName: lastName,
    address: address,
    city: city,
    email: email
  };

  // création de la constante "panier" en y ajoutant notre panier
  const panier = JSON.parse(localStorage.getItem("panier"));
  let produits = [];
  panier.forEach(element => {
    produits.push(element.id);
  })

  // récupération des "produits"
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    },
    // envoi de "contact" et "produits" dans la page
    body: JSON.stringify({ contact, products: produits })
  })
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (data) {
      // récupération des données "data"
      // création de la variable "orderId" en y mettant Id de notre panier "data.orderId"
      let orderId = data.orderId;

      // changer de page et aller a la page de confirmation
      location.replace("confirmation.html?id=" + orderId)
    })
}
