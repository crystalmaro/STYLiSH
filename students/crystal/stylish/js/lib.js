// ==========================================
//    All Global Variables
// ==========================================
const HOST = "https://api.appworks-school.tw";
const API_HOST = "https://api.appworks-school.tw/api/1.0";
const API_HOST_Products = "https://api.appworks-school.tw/api/1.0/products";
// const API_HOST_Tag = "https://api.appworks-school.tw/api/1.0/products/?tag=";
const API_HOST_Item = "https://api.appworks-school.tw/api/1.0/products/details?id=";
const API_HOST_Order = "https://api.appworks-school.tw/api/1.0/order/checkout";


const addCartButton = document.querySelector(".addCartButton");
const checkoutButton = document.querySelector(".checkoutButton");
let cartQty = document.querySelectorAll(".cartQty");


/* ==================
AJAX: Get & Post
================== */
function getAjax(src, callback){ 
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      callback(JSON.parse(xhr.response));
    }
  }
  xhr.open("GET", src);
  xhr.send();
};

function postAjax(src, obj, callback){
  let xhr = new XMLHttpRequest();
  xhr.open("POST", src, true);
  xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
  // xhr.setRequestHeader('authorization',`Bearer ${getLocalStorage(user)}`);
  xhr.onreadystatechange = function  () {
    let parsedGetData = JSON.parse(xhr.response);
    if (this.readyState == 4 && this.status == "200") {
      callback(parsedGetData);
    } 
  }
  // send back Order Number
  xhr.send(JSON.stringify(obj));
};

/* ==================
Order Number & Thank You
================== */
// let orderNum = {
//   data: {
//     number: ""
//   }
// };

/* ==================
Local Storage 
================== */
let cartValue = {
  prime: "",
  order: {
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
  }
};

let userValue = {
  be: {
    "provider": "facebook",
    "access_token": ""
  },
  fe: {
    "name": "",
    "email": "",
    "pic": ""
  }
}

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
  let localStorageUser = getLocalStorage("user");
    // initialize empty structure into localStorage
    if (localStorageCart === null || localStorageUser === null) {
      setLocalStorage("cart", cartValue);
      setLocalStorage("user", userValue);
    } else {
      for (let i = 0; i < cartQty.length; i++) {
        cartQty[i].innerHTML = localStorageCart.order.list.length;
      };
    };
};

// function updateUser(){
//   let localStorageUser = getLocalStorage("user");
//   if (localStorageUser === null)
// }

window.addEventListener("load", function(){
  updateCartQty();
});  

/* ==================
take Parameter by page URL
================== */
function getParamName(name, url){
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};


  


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
  getAjax(searchResult, renderProduct);
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