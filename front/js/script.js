
let contenu_api=[];
/*
Cette fonction va permettre d'afficher tout les items de la page.

Possibilité d'amélioration : créer une fonction recevant en paramètre le type d'élément à ajouté et les arguments à y mettre.
Il y'aurait donc la fonction createItem appelée par la fonction newItem qui ensuite se chargera de faire l'appendChild et la modification du noeud parent.

*/
newItem= function(item_informations)
{
  let childNode = document.getElementById("items");
  let info=item_informations;
    /* Création du lien,ajout du href avec l'id de l'item. */
    newBlock=document.createElement("a");
    let lien="product.html?id="+info._id;
    newBlock.setAttribute("href",lien);
    childNode.appendChild(newBlock);
    childNode=newBlock;
    /* Création de l'article en lui même, aucun attribut à ajouté*/
    newBlock=document.createElement("article");
    childNode.appendChild(newBlock);
    childNode=newBlock;
    /*Insertion de l'image du produit */
    newBlock=document.createElement("img");
    newBlock.setAttribute("alt",info.altTxt);
    newBlock.setAttribute("src",info.imageUrl);
    childNode.appendChild(newBlock);
    /*Insertion du titre avec le nom du produit*/
    newBlock=document.createElement("h3");
    newBlock.textContent=info.name;
    childNode.appendChild(newBlock);
    /*Insertion de la description du produit*/
    newBlock=document.createElement("p");
    newBlock.textContent=info.description;
    childNode.appendChild(newBlock);
    
    return 1;
}


/*Fonction récupérant le contenu de l'API, initialement je pensais pouvoir récupéré le résultat dans une variable et faire tout le travail nécessaire à la suite.
N'y arrivant pas de la manière voulue, je dois faire tout le traitement au niveau du .then(function(value)).
Je garde la structure d'une fonction pour ne pas oublier de demander ce qu'il en est à Damien.
L'intégralité du travail va donc se faire par l'appel de fonctions dans cette partie.
*/
function recuperation(contenu)
{
    fetch("http://localhost:3000/api/products")
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function(value) {
      /*On parcours tout les éléments et on les affiche via la fonction newItem*/
      for(article of value)
      {
        newItem(article);
      }
      /*
      contenu=value;
      for(let i=0;i<contenu.length;i++)
      {
        newItem(contenu[i]);
      }*/
      return value;
    })
    .catch(function(err) {
      // Une erreur est survenue
    });
}

contenu_api=recuperation(contenu_api);
