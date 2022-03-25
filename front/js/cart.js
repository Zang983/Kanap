/*Définition des variables*/
let compteurArticle = 0;
let compteurPrix = 0;

let orderTab = JSON.parse(localStorage.getItem("orderTab"));

sortOrderTab(orderTab);

/* Début des fonctions */
function afficheItem(itemInOrderTab, article) {
    let text = "", newBlock = document.createElement("article");
    newBlock.setAttribute("class", "cart__item");
    newBlock.setAttribute("data-id", itemInOrderTab.id);
    newBlock.setAttribute("data-color", itemInOrderTab.color);
    /* Les lignes suivante créent le code HTML mis à jour avec nos variables*/
    text += '<div class="cart__item__img"><img src="' + article.imageUrl + '" alt="' + article.altTxt + '"></div><div class="cart__item__content"><div class="cart__item__content__description">'
    text += "<h2>" + article.name + '</h2><p>"' + article.colors[itemInOrderTab.color] + '"<p>' + article.price + '</p></div><div class="cart__item__content__settings">';
    text += '<div class="cart__item__content__settings__quantity"><p>Qté : ' + itemInOrderTab.quantity.toString() + '</p><input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="';
    text += itemInOrderTab.quantity + '"></div><div class="cart__item__content__settings__delete"><p class="deleteItem">Supprimer</p></div></div></article>';
    newBlock.innerHTML = text;
    document.querySelector("#cart__items").appendChild(newBlock);
}
function sortOrderTab(orderTab) {
    if(orderTab!=null)
    {
        orderTab.sort((function compare(a, b) {
            if (a.id < b.id)
                return -1;
            if (a.id > b.id)
                return 1;
            return 0;
        }));
    }

}
/* Supprimes un article du tableau présent dans localStorage*/
function deleteInTab(id, color) {
    for (let i = 0; i < orderTab.length; i++) {

        if (orderTab[i].id == id && orderTab[i].color == color) {
            orderTab.splice(i, 1);
            localStorage.clear();
            localStorage.setItem("orderTab", JSON.stringify(orderTab));
        }
    }
}
/* Supprime l'élément du DOM */
function deleteInDom(deletedBlock, value) {
    deletedBlock.parentNode.removeChild(deletedBlock);
    priceCart(value);
}
/*Detecte lorsqu'on appuie sur un bouton supprimer*/
function detectDeleteBtn(value) {

    let deleteBtns = document.querySelectorAll(".deleteItem");
    for (deleteBtn of deleteBtns) {
        let parentBlock = deleteBtn.parentNode.parentNode.parentNode.parentNode;
        let id = parentBlock.getAttribute("data-id");
        let color = parentBlock.getAttribute("data-color");
        deleteBtn.addEventListener("click", function (e) {
            deleteInTab(id, color);
            deleteInDom(parentBlock, value);
        });
    }
}
/* calcul le montant du panier et le nombre d'article*/
function priceCart(value) {
    let compteurPrix = 0;
    let compteurArticle = 0
    for (article of orderTab) {
        compteurArticle += parseInt(article.quantity);
        for (item of value) {
            if (item._id == article.id) {
                compteurPrix += item.price * article.quantity;
            }
        }
    }
    affichePrix(compteurPrix, compteurArticle);
}
/* affiche le prix total de la commande ainsi que le nombre d'article*/
function affichePrix(compteurPrix, compteurArticle) {
    document.getElementById("totalPrice").textContent = compteurPrix;
    document.getElementById("totalQuantity").textContent = compteurArticle;
}
/*Cette fonction détecte le changement de quantité d'un produit et met à jour le tableau.*/
function detectQuantityChange(value) {
    let itemQuantitys = document.querySelectorAll(".itemQuantity");
    for (let i = 0; i < itemQuantitys.length; i++) {
        let parentBlock = itemQuantitys[i].parentNode.parentNode.parentNode.parentNode;
        let id = parentBlock.getAttribute("data-id");
        let color = parentBlock.getAttribute("data-color");
        itemQuantitys[i].addEventListener("change", function (e) {
            for (article of orderTab) {
                if (article.id === id && article.color === color) {
                    article.quantity = itemQuantitys[i].value;
                    localStorage.clear();
                    localStorage.setItem("orderTab", JSON.stringify(orderTab));
                    modifDomQuantity(article.quantity, itemQuantitys[i].parentNode.firstChild)
                    priceCart(value);
                }
            }
        })
    }
}
/* Modifie la quantité présente dans le dom en même temps que l'utilisateur change sa quantité.*/
function modifDomQuantity(quantity, block) {
    block.textContent = "Qté : " + quantity;
}
/* Fonction vérifiant chaque champs du formulaire via une regex,si tout les champs sont bons le bouton de validation deviens clickable*/
function validateInput() {

    /*Tableau des éléments du formulaire*/
    fields = [
        document.getElementById("firstName"),
        document.getElementById("lastName"),
        document.getElementById("address"),
        document.getElementById("city"),
        document.getElementById("email")]
    /*Tableau des regex utilisées pour la validation des champs. Les deux premiers correspondent à une regex pour nom/prenom, suivi d'un pour l'adresse, la ville avec code postal et enfin l'email*/
    regexs = [
        RegExp(/[0-9^\&\~\#\(\)\@\]\[\|\$\µ\!\§\;]/),
        RegExp(/[0-9^\&\~\#\(\)\@\]\[\|\$\µ\!\§\;]/)]
    for (let i = 0; i < 2; i++) {
        fields[i].addEventListener("input", function (e) {
            if (regexs[i].test(fields[i].value)) {
                fields[i].nextSibling.nextSibling.textContent = "Veuillez vérifier l'information saisie.";
            }
            else {
                fields[i].nextSibling.nextSibling.textContent = "";
            }

        });
    }
}
/* lors de l'appuie sur le bouton envoi vers l'api les*/
function validateForm() {


}
function checkCommandBtn() {
    let btn = document.getElementById("order");
    btn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (validateForm() && orderTab[0] != undefined) {
            /*Ici on appelle la fonction faisant la requête post et récupérant l'identifiant de la commande avant de faire la redirection*/
        }
        else {
            if (orderTab[0] === undefined) {
                alert("Veuillez avoir au moins un article dans votre panier.");
            }
        }
    });
}
/* Récupération des données de l'API et execution du contenu de la page.*/
fetch("http://localhost:3000/api/products/")
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function (value) {

        for (itemInOrderTab of orderTab) {
            for (article of value) {
                if (itemInOrderTab.id == article._id) {
                    afficheItem(itemInOrderTab, article);
                }
            }
        }
        detectDeleteBtn(value);
        detectQuantityChange(value);
        priceCart(value);
        validateInput();
        //checkCommandBtn();
    })
    .catch(function (err) {
        // Une erreur est survenue
    });


