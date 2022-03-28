/* ---------------- DÉFINITIONS DES VARIABLES -------------------*/
id_article = new URL(window.location.href).searchParams.get("id");// on récupère l'id du produit a affiché
let orderTab = [];//tableau contenant les articles de la commande
let colorField=document.getElementById("colors"),quantityField=document.getElementById("quantity");
if (localStorage.getItem("orderTab") != null) {
    orderTab = JSON.parse(localStorage.getItem("orderTab"));
}
/* ---------------- DÉFINITIONS DES CLASS -------------------*/
class item {
    constructor(id, color, quantity) {
        this.id = id;
        this.color = color;
        this.quantity = quantity;
    }
}
/* Vérifie que la couleur choisie existe bien*/
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
            createItem(value);
        })
        .catch(function (err) {
            // Une erreur est survenue
        });
}
/*Fonction modifiant le dom pour afficher l'item et ses propriétés*/
function createItem(value) {
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
    let optionCouleur = colorField;
    value.colors.forEach(function (element, key) {
        optionCouleur[key + 1] = new Option(element, key);
    });
}
/* Fonction vérifiant la présence de l'item dans le tableau,s'il est présent modifie la quantité */
function checkItemsTab(orderTab, actualItem) {
    for (let i = 0; i < orderTab.length; i++) {
        if (orderTab[i].id == actualItem.id && orderTab[i].color == actualItem.color) {
            orderTab[i].quantity = parseInt(orderTab[i].quantity,10) + parseInt(actualItem.quantity,10)
            return 1;
        }
    }
    return 0;
}
/* Fonction ajoutant un item au panier*/
function submit_item (article_id, orderTab) {
    /* Récupération des éléments du formulaire*/
    let quantity_item = quantityField;
    if (quantity_item.value <= 0 || colorField.value == "") {
        alertUser(quantity_item.value, colorField.value)
    }
    else {
        /* Création d'un nouvel item et vérification si ce dernier existe*/
        nouvelItem = new item(id_article, colorField.value, parseInt(quantity_item.value, 10));
        if (!checkItemsTab(orderTab, nouvelItem)) {
            orderTab.push(nouvelItem);
        }
    }
    localStorage.setItem("orderTab", JSON.stringify(orderTab));
}

/*Fonction qui alerte l'utilsateur si la couleur ou la quantité n'est pas bonne.*/
function alertUser(quantity, color) {
    if (quantity <= 0) {
        quantityField.style.backgroundColor = ("red")
    }
    else {
        quantityField.style.backgroundColor = ("white")
    }
    if (color == "") {
        colorField.style.backgroundColor = ("red")
    }
    else {
        colorField.style.backgroundColor = ("white")
    }
}
/* FIN DES FONCTIONS */
recuperation(id_article);
/* Écoute du bouton "ajouter au panier" */
let submit_btn = document.getElementById("addToCart");
submit_btn.addEventListener("click", function (e) {
    submit_item(id_article, orderTab);
});

/*Vérifie tout changement pour la couleur de fonds du formulaire*/
colorField.addEventListener("change",function(e){
    alertUser(quantityField.value, colorField.value)
    });
quantityField.addEventListener("change",function(e){
    alertUser(quantityField.value, colorField.value)
    });