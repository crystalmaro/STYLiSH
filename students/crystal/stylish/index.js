
const API_HOST = "https://api.appworks-school.tw/api/1.0";
const API_HOST_Products = "https://api.appworks-school.tw/api/1.0/products/";

// AJAX 
function ajax(src, callback) { 
    let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          callback(xhr.response);
        }
  }
    xhr.open("GET", src);
    xhr.send();
  }

/* ==================
WEEK 1 PART 3
================== */
// Render & display /products/all on homePage initial loading
// another method: window.addEventListener()
ajax(API_HOST_Products+"all", function(response) {
  render(response);
});

// Remove existing elements when loading new category
function removeElement(className){
  let elements = document.querySelector("."+className);
    while(elements.firstChild){
      elements.removeChild(elements.firstChild);
    }
};

// Render & display based on clicked category
const getProducts = (type) => {
  let productSRC = API_HOST_Products + type;
    ajax(productSRC, render);
};

 // Product display rendering dynamically
function render(data) {
  removeElement("allProducts");
  let allProducts = document.querySelector(".allProducts");
  let obj = JSON.parse(data);
  let product = obj.data;

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
WEEK 1 PART 4
================== */
  function search() {
    let input = document.querySelector(".searchInput").value;
    let searchResult = API_HOST_Products + "search?keyword=" + input;
    // if (event.keyCode === 13) {
    //   document.querySelector(".search_button").click();
    // }
    ajax(searchResult, render);
  }
