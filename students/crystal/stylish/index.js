
const API_HOST = "https://api.appworks-school.tw/api/1.0";
const API_HOST_Products = "https://api.appworks-school.tw/api/1.0/products/";

// AJAX 
function getProductCategory(src, callback) { 
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
getProductCategory(API_HOST_Products+"all", function(response) {
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
    removeElement("all_products");
    getProductCategory(productSRC, render);
};

 // Product display rendering dynamically
function render(data) {
  let all_products = document.querySelector(".all_products");
  let obj = JSON.parse(data);
  let product = obj.data;

    for (let i = 0; i < product.length; i++) {
      let product_container = document.createElement("div");
        product_container.setAttribute("class", "product_container");
    
      // div.product_main_img
      let product_main_img = document.createElement("img")
      product_main_img.setAttribute("class", "product_main_img")
      product_main_img.setAttribute("src", `${product[i].main_image}`);
      product_container.appendChild(product_main_img);

      // div.all_colors
      let all_colors = document.createElement("div");
        all_colors.setAttribute("class", "all_colors");
        product_container.appendChild(all_colors);
        // div.all_colors (individual color chip)
        for (let j = 0; j < product[i].colors.length; j++) { 
        let colorChip = document.createElement("div");
        colorChip.setAttribute("class", "colorChip");
        colorChip.setAttribute("title", product[i].colors[j].name);
        colorChip.setAttribute("style", `background-color:#${product[i].colors[j].code};`);
        all_colors.appendChild(colorChip);
        };
        /* ------- forEach also works for colorChip
        product[i].colors.forEach(color => {
        colorChip = document.createElement("div");
        colorChip.setAttribute("class", "color");
        colorChip.setAttribute("style", "background-color:#" + color.code);
        colorChip.title = color.name;
        all_colors.appendChild(colorChip);
        });
        ------- */
      
        // div.product_name
      let product_name = document.createElement("div");
      product_name.setAttribute("class", "product_name");
      product_name.innerHTML = product[i].title;
      product_container.appendChild(product_name);

        // div.product_price
      let product_price = document.createElement("div");
      product_price.setAttribute("class", "product_price");
      product_price.appendChild(document.createTextNode(`TWD.${product[i].price}`))
      product_container.appendChild(product_price);

      all_products.appendChild(product_container);
    }
};

/* ==================
WEEK 1 PART 4
================== */
// 7/14 console.log error
// "can't read property 'addEventListender' of null
// let search_button = document.querySelector(".search_button");
// search_button.addEventListener("click", () => {
//   let search_input = document.querySelector(".search_input").value;
//   getProductCategory(API_HOST_Products + "search?keyword=" + search_input, function(response) {
//     render(response)});
// });

// DOESN'T WORK EITHER TT___TT
function search(callback){
    let searchResult = new XMLHttpRequest();
    let input = document.querySelector(".search_input").value;
    searchResult.onreadystatechange = function(){
      if (searchResult.readyState === 4 && searchResult.status === 200) {
        let resultOutput = JSON.parse(searchResult.responseText);
        console.log("this type: " + typeof resultOutput, "output " + resultOutput);
        callback(resultOutput);
      }
    };
    searchResult.open("GET", API_HOST_Products + "search?keyword=" + input );
    searchResult.send();
  }