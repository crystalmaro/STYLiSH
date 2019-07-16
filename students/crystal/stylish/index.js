
const API_HOST = "https://api.appworks-school.tw/api/1.0";
const API_HOST_Products = "https://api.appworks-school.tw/api/1.0/products/";
let type = "all";
let pageNumber;
let pagingURL;

// === AJAX 
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
WEEK 1 PART 3
================== */
// === Render & display /products/all on homePage initial loading
// another method: window.addEventListener()
ajax(`${API_HOST_Products}${type}`, render);

// Remove existing elements when loading new category
function removeElement(className){
  let elements = document.querySelector("."+className);
    while(elements.firstChild){
      elements.removeChild(elements.firstChild);
    }
};

// === Render & display based on clicked category
const getProducts = (inputType) => {
  type = inputType;
  removeElement("allProducts");
    ajax(`${API_HOST_Products}${inputType}`, render);
};

// === Product display rendering dynamically (createElement)
function render(data) {
  let allProducts = document.querySelector(".allProducts");
  let product = data.data;
  
  // pagingURL for ajax
  if (data.paging !== undefined) {
    pagingURL = `${API_HOST_Products}${type}?paging=${data.paging}`;
    window.addEventListener("scroll", handleScroll);
  } else {
    pagingURL = "";
    window.removeEventListener("scroll", handleScroll);
  }

  for (let i = 0; i < product.length; i++) {
    let productContainer = document.createElement("div");
      productContainer.setAttribute("class", "productContainer");
  
    // div.productImage
    let productImage = document.createElement("img")
    productImage.setAttribute("class", "productImage")
    productImage.setAttribute("src", `${product[i].main_image}`);
    productContainer.appendChild(productImage);

    // div.allColors
    let allColors = document.createElement("div");
    allColors.setAttribute("class", "allColors");
    productContainer.appendChild(allColors);
    // div.allColors (individual color chip)
    for (let j = 0; j < product[i].colors.length; j++) { 
      let colorChip = document.createElement("div");
      colorChip.setAttribute("class", "colorChip");
      colorChip.setAttribute("title", product[i].colors[j].name);
      colorChip.setAttribute("style", `background-color:#${product[i].colors[j].code};`);
      allColors.appendChild(colorChip);
      };
      /* ------- forEach also works for colorChip
      product[i].colors.forEach(color => {
      colorChip = document.createElement("div");
      colorChip.setAttribute("class", "color");
      colorChip.setAttribute("style", "background-color:#" + color.code);
      colorChip.title = color.name;
      allColors.appendChild(colorChip);
      });
      ------- */
    
    // div.productName
    let productName = document.createElement("div");
    productName.setAttribute("class", "productName");
    productName.innerHTML = product[i].title;
    productContainer.appendChild(productName);

    // div.productPrice
    let productPrice = document.createElement("div");
    productPrice.setAttribute("class", "productPrice");
    productPrice.appendChild(document.createTextNode(`TWD.${product[i].price}`))
    productContainer.appendChild(productPrice);

    allProducts.appendChild(productContainer);
  }
};

/* ==================
WEEK 1 PART 4: Search Function
================== */
const search = () => { 
  let input = document.querySelector(".searchInput").value;
  let searchResult = API_HOST_Products + "search?keyword=" + input;
  // 先移除目前的東西，再render搜尋結果
  removeElement("allProducts");
  ajax(searchResult, render);
  // 模擬使用者點擊 stimulate user click to close search bar on mobile
  let searchInput = document.querySelector(".searchInput");
  searchInput.click();
}

let showMobileSearch = () => {
  let searchInput = document.querySelector(".searchInput");
  let navFeature = document.querySelector(".navFeature");
  let nav = document.querySelector("nav");
  if (searchInput.className === "searchInput" && navFeature.className === "navFeature") {
    searchInput.className += " open";
    navFeature.className += " open";
  } else {
    searchInput.className = "searchInput"
    navFeature.className = "navFeature";
  }
}
/* ==================
WEEK 1 PART 4: Scrolling & Paging Feature
================== */
window.addEventListener("scroll", handleScroll);

function handleScroll(e) {
    let ticking = false;
    if (!ticking) {
      window.requestAnimationFrame(function () {
        endlessScroll();
        ticking = false;
      });
    }
    ticking = true;
  }

let endlessScroll = () => {
  let windowHeight = window.innerHeight;
  let remainingFooter = document.querySelector("footer").getBoundingClientRect().top;
    if (remainingFooter - windowHeight < 0) {
      ajax(pagingURL, setExtProduct);
      window.removeEventListener("scroll", handleScroll);
    }
}

function setExtProduct(data) {
  if (data.paging !== undefined) {
    pageNumber ++;
    // setting data.paging(right) to the global pageNumber(left);
    pageNumber = data.paging;
  }
  window.addEventListener("scroll", handleScroll);
  render(data);
}