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

// ======================================================
// ======================================================
// ======================================================
// FACEBOOK 
// ======================================================
// test if gh-pages is updated
alert("updated 02:49pm")

// let fbUser = {
//   name: "",
//   email: "",
//   picUrl: ""
// }
let userName;
let userEmail;
let userProfPic;
let fb_backend = {
  "provider": "facebook",
  "access_token": "",
  "name": "",
  "email": "",
  "picUrl": ""
};

// https://crystalmaro.github.io/Web-Front-End-2019-Summer/students/crystal/stylish/

window.fbAsyncInit = function() {
  FB.init({
    appId      : '2255951781382943',
    cookie     : true, 
    version    : 'v3.3'
  });
  // FB.AppEvents.logPageView();   

  // need to put below func within this window.func
  // otherwise it'd say FB isn't found
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


/// status change call back
function statusChangeCallback(response){
  if (response.status === "connected"){
    console.log("FB is logged in and authenticated");
    // console.log(response)

    FB.api("/me?fields=name,email,picture.width(500)", function(response){
      if (response && !response.error){
        alert("check response has something")
        console.log(response)

        // userName = response.name;
        // userEmail = response.email;
        // userProfPic = response.picture.data.url;

        let localStorageUser = getLocalStorage("user");
        localStorageUser.fe.name = response.name;
        localStorageUser.fe.email = response.email;
        localStorageUser.fe.pic = response.picture.data.url;
        setLocalStorage("user", localStorageUser);

        // fb_backend.access_token = response.authResponse.accessToken;
        // fb_backend.picUrl = response.picture.data.url;
        // fb_backend.name = response.name;
        // fb_backend.email = response.email;
        // console.log(fb_backend);
        // setLocalStorage("user", fb_backend)
      };
    });

    testAPI();
    
  } else {
    console.log("not authenticated!!!!");
    console.log(response)
  }
};

// onLogin() on the hidden fb button
function checkLoginState() {
  alert("checking login status");
  FB.getLoginStatus(function(response) {
    alert("getting login status");
    statusChangeCallback(response);
    
    // send fb access_token to Check Out API
    // let fbObj = {
    //   "provider": "facebook",
    //   "access_token": userAccessToken
    // };
    // postAjax(API_HOST_Order, fbObj, redirectToProfile);

    // the response where i gather info
    // don't need to save accessToken into anywhere (localStorage)
    // 1. need to set up what i need from FB (ie. access token)
    // 2. use access token to retrieve user info (name, email, pic)
    // use AJAX post 
    // 
    if(response.status == "connected"){redirectToProfile()}
  });
};


// ============= redirect to profile page if logged in
function redirectToProfile(){
  window.location.href = "./profile.html";
}


// ============== test API response status
function testAPI() {
  alert("testAPI activated");
  // console.log(response)
  FB.api("/me?fields=name,email,picture.width(500)", function(response){
    if (response && !response.error){
      alert("testAPI's FB.api")

      console.log(response)
      // buildProfile(response);
    }
  })
};