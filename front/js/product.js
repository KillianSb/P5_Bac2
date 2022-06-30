const params = new URLSearchParams(location.search);

const id = params.get("id");

// console.table(id);


fetch("http://localhost:3000/api/products/"+id)
  .then(function (res) {
    if (res.ok) {
      console.dir(res);
      return res.json();
    }
    if (res.status === 404) {
      error = res.status;
      ErrorMessage(error);
    }
  })
  .then(function (element) {

    // Ajout de la liste des informations "element" dans la fonction "displayElement" pour les récupérer ensuite
    displayElement(element);
    // console.log(element);

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
};

function displayElement(element) {

  // Création basile "a"
  let img = document.createElement("img");
  // Ajout de l'attribut "href" et "alt" a la basile "img"
  img.setAttribute("src", element.imageUrl);
  img.setAttribute("alt", element.altTxt);

  document.querySelector('.item__img').appendChild(img);

  document.getElementById('title').innerHTML = element.name;

  document.getElementById('description').innerHTML = element.description;

  document.getElementById('price').innerHTML = element.price;


  let list_colors = document.querySelector("#colors");
  element.colors.forEach(color => {
    let optionColor = document.createElement("option");
    optionColor.setAttribute("value", color);
    optionColor.textContent = color;
    list_colors.appendChild(optionColor);
  });

  // Table des canapés
  // console.table(element);
}

function addToCart(product) {
  const panier = JSON.parse(localStorage.getItem("panier")) || []
  if (localStorage.cart) {
      panier = JSON.parse(localStorage.cart);
  }
  //Si le panier du localStorage n'est pas vide
  if (panier.length) {
      let modified = false;
      panier.forEach(element => {
        if (element.id === product.id && element.color === product.color) {
            element.quantity += product.quantity;
            modified = true;
        }
      });
      if (!modified) {
          panier.push(product);
      }
      localStorage.setItem("panier", JSON.stringify(panier));
    // Si le panier et vide
  } else {
      panier.push(product);
      localStorage.setItem("panier", JSON.stringify(panier));
  }

}

document.getElementById('addToCart').addEventListener('click',function() {

  // if pour vérifier couleurs bien selectionner
  const customColor = document.querySelector("#colors").value;
  const quantity = document.querySelector("#quantity").value;
  const nameItem = document.getElementById("title").innerHTML;

  if (!customColor) {
    // si != rien selectionner alert, + return
    return alert("Veuillez choisir une couleur.")
  }

  // quantité bien comprise entre 0 et 100
  if (quantity <= 0 || quantity > 100) {
    // si != pas pareil alert, + return
    return alert("Veuillez choisir un nombre entre 1 et 100.")
  }

  let product = {
    "id": id,
    "name": nameItem,
    "color": customColor,
    "quantity": Number(quantity),
  }

  addToCart(product);
})