/* ==========================================
   All Global Variables
========================================== */
const HOST = "https://api.appworks-school.tw";
const API_HOST = "https://api.appworks-school.tw/api/1.0";
const API_HOST_Products = "https://api.appworks-school.tw/api/1.0/products";
const API_HOST_Item = "https://api.appworks-school.tw/api/1.0/products/details?id=";

const addCartButton = document.querySelector(".addCartButton");
const checkoutButton = document.querySelector(".checkoutButton");
let cartQty = document.querySelectorAll(".cartQty");

/* ==================
AJAX
================== */
function ajax(src, callback){ 
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      callback(JSON.parse(xhr.response));
    }
  }
  xhr.open("GET", src);
  xhr.send();
}

/* ==================
Local Storage 
================== */
let cartValue = {
  shipping: "delivery",
  frieght: 60,
  payment: "credit_card",
  subtotal: "",
  total: "",
  recipient: {
    name: "",
    phone: "",
    email: "",
    address: "",
    time: "anytime"
  },
  list: []
};

function setLocalStorage(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorage(key){
  return JSON.parse(localStorage.getItem(key));
}

/* ==================
Shopping Cart
================== */
function updateCartQty() {
  let localStorageCart = getLocalStorage("cart");
    // initialize empty structure into localStorage
    if (localStorageCart === null) {
      setLocalStorage("cart", cartValue);
    } else {
      for (let i = 0; i < cartQty.length; i++) {
        cartQty[i].innerHTML = localStorageCart.list.length;
      };
    };
  };
  
window.addEventListener("load", function(){
  updateCartQty();
});  

/* ==================
Remove Element
================== */
function removeElement(className){
    let elements = document.querySelector("."+className);
      while(elements.firstChild){
        elements.removeChild(elements.firstChild);
      }
};

/* ==================
Search Function
================== */
const search = () => { 
    let input = document.querySelector(".searchInput").value;
    let searchResult = API_HOST_Products + "/search?keyword=" + input;
    // 先移除目前的東西，再render搜尋結果
    removeElement("allProducts");
    ajax(searchResult, renderProduct);
    // 模擬使用者點擊 stimulate user click to close search bar on mobile
    let searchInput = document.querySelector(".searchInput");
    searchInput.click();
};
  
const showMobileSearch = () => {
    let searchInput = document.querySelector(".searchInput");
    let navFeature = document.querySelector(".navFeature");
    // let nav = document.querySelector("nav");
    if (searchInput.className === "searchInput" && navFeature.className === "navFeature") {
      searchInput.classList.add("open");
      navFeature.className += " open";
    } else {
      searchInput.classList.remove("open");
      navFeature.className = "navFeature";
    }
};

