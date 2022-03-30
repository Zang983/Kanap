const id=localStorage.getItem('id');
localStorage.clear();
document.getElementById("orderId").textContent=id;