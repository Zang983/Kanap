/* ---------------- DÉFINITIONS DES VARIABLES -------------------*/
id_article = new URL(window.location.href).searchParams.get("id");// on récupère l'id du produit a affiché
let local = localStorage; // on initialise le localstorage
let orderTab = [];//tableau contenant les articles de la commande

/* ---------------- DÉFINITIONS DES CLASS -------------------*/
class item {
    constructor(id, color, quantity) {
        this.id = id;
        this.color = color;
        this.quantity = quantity;
    }
}
function verifCouleur(choix, nombreCouleurPossible) {
    if (choix < nombreCouleurPossible || choix > nombreCouleurPossible) {
        return 0;
    }
    return 1;
}
/*Récupération et affichage des infos produits*/
function recuperation(id) {

    let lien = "http://localhost:3000/api/products/" + id;
    fetch(lien)
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function (value) {
            /* On modifie directement le DOM ici,*/
            let emplacement, newBlock;
            /* Ajout de l'image */
            emplacement = document.querySelector("section div.item__img");
            newBlock = document.createElement("img");
            newBlock.setAttribute("alt", value.altTxt);
            newBlock.setAttribute("src", value.imageUrl);
            emplacement.appendChild(newBlock);
            /*Titre de l'article*/
            document.getElementById("title").textContent = value.name;
            /* Prix du produit */
            document.getElementById("price").textContent = value.price;
            /* Description de l'article */
            document.getElementById("description").textContent = value.description;
            /*Option couleur*/
            let optionCouleur = document.getElementById("colors");
            value.colors.forEach(function (element, key) {
                optionCouleur[key + 1] = new Option(element, key);
            });
        })
        .catch(function (err) {
            // Une erreur est survenue
        });
}

/* Fonction vérifiant la présence de l'item dans le tableau,s'il est présent modifie la quantité */
function checkItemsTab(orderTab, actualItem) {
    for (let i = 0; i < orderTab.length; i++) {
        if (orderTab[i].id == actualItem.id && orderTab[i].color == actualItem.color) {
            orderTab[i].quantity += actualItem.quantity
            return 1;
        }
    }
    return 0;
}

let submit_item = function (article_id, orderTab) {
    /* Récupération des éléments du formulaire*/
    let color_item = document.getElementById("colors").value;
    let quantity_item = parseInt(document.getElementById("quantity").value, 10);
    /* Création d'un nouvel item et vérification si ce dernier existe*/
    nouvelItem = new item(id_article, color_item, quantity_item);
  
        if (!checkItemsTab(orderTab, nouvelItem)) {
            orderTab.push(nouvelItem);
      }
    local.clear();/* On vide le local storage avant de mettre le nouveau tableau */
    local.setItem("orderTab", JSON.stringify(orderTab));
}
/* ---------------- FIN DES FONCTIONS-------------------*/

/* Le contenu de l'api n'est pas récupérable, il  faut voir avec Damien ce qu'il en est*/

recuperation(id_article);

if (local.getItem("orderTab") != null) {
    orderTab = JSON.parse(localStorage.getItem("orderTab"));
}
/* Écoute du bouton "ajouter au panier" */
let submit_btn = document.getElementById("addToCart");
submit_btn.addEventListener("click", function (e) {
    submit_item(id_article, orderTab);
}); 