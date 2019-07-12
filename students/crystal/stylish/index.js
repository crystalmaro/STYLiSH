
let API_HOST = "https://api.appworks-school.tw/api/1.0";

function getProducts(type) {
    let productSRC = API_HOST + "/products/" + type;
    // @todo delete existing product container when loading new products
    getProductCategory(productSRC, render);
}

function getProductCategory(src, callback) { 
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            // console.log(this.responseText[0].obj)
            callback(xhr.response);
        }
    }
    xhr.open("GET", src)
    xhr.send();
 }

 // @todo window.addEventListener() to show ALL products when open the page

function render(data) {
    let all_products = document.querySelector(".all_products");
    // let product_container = document.getElementsByClassName("product_container");
    let obj = JSON.parse(data);
    console.log(obj.data[0].title);

    for (let i = 0; i < obj.data.length; i++) {
        let product_container = document.createElement("div");
        product_container.setAttribute("class", "product_container");
    
        // @todo <img>
        let img = document.createElement("img")
            // set attribute src to img link
            // obj.data[i].main_image
        // @todo div.all_colors
            // (?) count colors.length to create amount of color chips?
        // @todo div_color
            // all_colors.appendChild(.color)
        // div.product_name
        let product_name = document.createElement("div");
        product_name.setAttribute("class", "product_name");
        product_name.innerHTML = obj.data[i].title;
        product_container.appendChild(product_name);
        // @todo div.product_price
        let product_price = document.createElement("div");
        product_price.setAttribute("class", "product_price");
        product_price.appendChild(document.createTextNode(`TWD.${obj.data[i].price}`))
        product_container.appendChild(product_price);
    
        // console.log(all_products);
        // use all_products[0] if getElementsByClassName
        all_products.appendChild(product_container);
    }
}





// getProducts(src, function(response){
//     let category_women = document.getElementsByClassName("category_women");
//     let category_men = document.getElementsByClassName("category_men");
//     let category_accessories = document.getElementsByClassName("category_accessories");

//     // @todo change if conditions
//     if (data === category_women) {
//         src += "/products/women";
//     } else if (data === category_men) {
//         src += "/products/men";
//     } else if (data === category_accessories) {
//         src += "/products/accessories";
//     } else {
//         src += "/products/all";
//     }

//     render(response);
// });













// req.onreadystatechange = function () {
//     if (this.readyState === 4 && this.status === 200) {
//         // document.querySelector(____PLACEHOLDER_____).innerHTML = this.responseText;
// // ============ products (start)
//         app.getProducts = function(tag) {
//             let path;
//             if (tag === null) {
//                 path = "/all";
//             } else if (tag === "women") {
//                 path = "/women";
//             } else if (tag === "men") {
//                 path = "/men";
//             } else (tag === "accessories") {
//                 path = "/accessories";
//             } else {
//                 path = "/search";
//             }
//             app.ajax("GET", app_src+"/products"+path);
//         };
// // ============ products (end)
//         }
//         app.send();
//     }