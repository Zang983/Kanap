/*Définition des variables*/
let compteurArticle = 0, compteurPrix = 0, orderTab = JSON.parse(localStorage.getItem("orderTab"));
let firstNameField = document.getElementById("firstName"), lastNameField = document.getElementById("lastName"), addressField = document.getElementById("address");
let cityField = document.getElementById("city"), emailField = document.getElementById("email");
let validityForm = 0;


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
/* Fonction qui tri le tableau par valeur ID pour regrouper les articles par ID.*/
function sortOrderTab(orderTab) {
    if (orderTab != null) {
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
function deleteInTab(idItemToDel, colorItemToDel) {
    for (let i = 0; i < orderTab.length; i++) {
        if (orderTab[i].id == idItemToDel && orderTab[i].color == colorItemToDel) {
            orderTab.splice(i, 1);
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
        let idItemToDel = parentBlock.getAttribute("data-id");
        let colorItemToDel = parentBlock.getAttribute("data-color");
        deleteBtn.addEventListener("click", function (e) {
            deleteInTab(idItemToDel, colorItemToDel);
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
                    localStorage.setItem("orderTab", JSON.stringify(orderTab));
                    itemQuantitys[i].parentNode.firstChild.textContent = " Qté : " + article.quantity;//on modifie le dom
                    priceCart(value);
                }
            }
        })
    }
}


/* Fonction vérifiant chaque champs du formulaire via une regex.*/
function validInput() {
    /*Tableau des éléments du formulaire*/
    let fields = [firstNameField, lastNameField, addressField, cityField, emailField];
    /*Tableau des regex utilisées pour la validation des champs. Les deux premiers correspondent à une regex pour nom/prenom, suivi d'un pour l'adresse, la ville avec code postal et enfin l'email*/
    regexs = [new RegExp(/[0-9^\&\~\#\(\)\@\]\[\|\$\µ\!\§\;\\\/]/),//cherche les chiffres et quelques caractères spéciaux
    new RegExp(/[0-9^\&\~\#\(\)\@\]\[\|\$\µ\!\§\;\\\/]/),
    new RegExp(/.{33}/),//si plus de 33 caractères, trop de format d'adresse différent possible
    new RegExp(/^[0-9]{5}\s{1,1}[a-zA-Z]{1,26}/),
    new RegExp(/^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/)
    ];

    for (let i = 0; i < fields.length; i++) {
        fields[i].addEventListener("input", function (e) {
            if (i < 3) {
                if (regexs[i].test(fields[i].value)) {
                    fields[i].nextSibling.nextSibling.textContent = "Veuillez vérifier l'information saisie.";
                }
                else {
                    fields[i].nextSibling.nextSibling.textContent = "";

                }
            }
            else {
                if (!regexs[i].test(fields[i].value)) {

                    fields[i].nextSibling.nextSibling.textContent = "Champs incomplet ou incorrect";
                }
                else {
                    fields[i].nextSibling.nextSibling.textContent = "";
                }
            }
        });
    }
}

/* lors de l'appuie sur le bouton envoi vers l'api les*/
function createOrder() {
    let products = [];
    for (cases of orderTab) {
        products.push(cases.id);
    }
    let contact = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value
    }
    let finalOrder = { contact, products };
    sendOrderToServer(finalOrder);

}

/*Fonction faisant la requête vers le server et envois sur la page de confirmation*/
async function sendOrderToServer(finalOrder) {
    let request = new Request('http://localhost:3000/api/products/order',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(finalOrder)
        })
    let response = fetch(request)
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function (value) {
            localStorage.clear();//on vide le panier.
            localStorage.setItem('id', value.orderId);//on enregistre l'id de la commande.
            document.location.href = 'confirmation.html'//on redirige vers la page de confirmation.
        })

}
function checkCommandBtn(orderTab) {
    let btn = document.getElementById("order");
    btn.addEventListener("click", function (e) {
        createOrder(orderTab);
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
        validInput();
        checkCommandBtn(orderTab);
        
    })
    .catch(function (err) {
        // Une erreur est survenue
    });
sortOrderTab(orderTab);
