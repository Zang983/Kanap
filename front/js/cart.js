/* ---------------- DÉFINITIONS DES VARIABLES -------------------*/
let orderTab=JSON.parse(localStorage.getItem("orderTab"));
let contenuApi;
var test; 
//localStorage.clear();

/*  On modifie le DOM que si un élément tableau de commande est présent*/
if(orderTab!=null)
{

    for(article of orderTab)
    {
        console.log(article)
    }
    
}
function recuperation(test) {
   
    fetch("http://localhost:3000/api/products/")
        .then(function (res) {
            if (res.ok) {
               // console.log(res);
                return res.json();
            }
        })
        .then(function (value) {
            //console.log(value)
            test=value
            console.log(test);
            return value;
        })
        .catch(function (err) {
            // Une erreur est survenue
        });
}
recuperation(test);
console.log(test)
