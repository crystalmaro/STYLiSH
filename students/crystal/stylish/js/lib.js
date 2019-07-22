const HOST = "https://api.appworks-school.tw";
const API_HOST = "https://api.appworks-school.tw/api/1.0";
const API_HOST_Products = "https://api.appworks-school.tw/api/1.0/products";
const API_HOST_Item = "https://api.appworks-school.tw/api/1.0/products/details?id=";
let type = "all";
let pageNumber;
let pagingURL;
let ind = 0;


/* ==================
AJAX
================== */
function ajax(src, callback) { 
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
}
  
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
}