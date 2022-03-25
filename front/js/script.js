
let contenu_api;
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


function recuperation()
{
    fetch("http://localhost:3000/api/products")
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function(value) {//On parcourt tous les éléments et on les affiche via la fonction newItem
      for(article of value)
      {
        newItem(article);
      }
      return value;
    })
    .catch(function(err) {
      // Une erreur est survenue
    });
}


recuperation();


