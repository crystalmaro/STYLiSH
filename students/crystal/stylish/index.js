
const API_HOST = "https://api.appworks-school.tw/api/1.0";

// Render & display /products/all on homePage initial loading
// another method: window.addEventListener()
getProductCategory(API_HOST+"/products/all", function(response) {
    render(response);
    });

// Remove existing elements when loading new category
function removeElement(className){
  let elements = document.querySelector("."+className);
    while(elements.firstChild){
        elements.removeChild(elements.firstChild);
    }
}

// Render & display based on clicked category
const getProducts = (type) => {
  let productSRC = API_HOST + "/products/" + type;
    removeElement("all_products");
    getProductCategory(productSRC, render);
}

// function getProducts(type) {
//       let productSRC = API_HOST + "/products/" + type;
//     removeElement("all_products");
//     getProductCategory(productSRC, render);
// }

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

        
        // div.all_colors (individual color chip)
        for (let i = 0; i < product[i].colors.length; i++) {
          let color = document.createElement("div");
            // removeElement("color");
            color.setAttribute("class", "color");
            color.setAttribute("style", `background-color:#${product[i].colors[i].code};`);
            // @TODO need to append corresponding color child to color containers
            // now all products are all using the first product's colors TT___TT
            all_colors.appendChild(color);
        }

        product_container.appendChild(all_colors);
      
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
}