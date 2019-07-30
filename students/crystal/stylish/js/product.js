const idQuery = getParamName('id');

/* ==================
Variables
================== */
let parsedData;
const qtyAdd = document.getElementById("qtyAdd");
const qtyMinus = document.getElementById("qtyMinus");
const qtyValue = document.querySelector(".qtyValue");
let currentColorCode;
let currentColorTitle;
let currentSizeID;
let currentStock = 0;
let qtyCount = 1;
let sizeCircle;
let sameProductIndex;
let productDetail = {
  id: "",
  qty: "",
  size: "",
  color: {
    code: "",
    name: ""
  },
  main_image: "",
  name: "",
  price: "",
  stock: ""
};

/* ==================
Button: Add to Cart
================== */
addCartButton.addEventListener("click", function(){
  alert("item added to cart")
  updateProductDetail();
  let localStorageCart = getLocalStorage("cart");
  // reset sameProductIndex, and run checkIfSameProduct() again
  sameProductIndex = -1;
  checkIfSameProduct();
  if (sameProductIndex > -1) {
    // update quantity only
    localStorageCart.order.list[sameProductIndex].qty = productDetail.qty;
  } else {
    // otherwise add new item into cart
    localStorageCart.order.list.push(updateProductDetail());
  }
  // re-set localStorage with updated cart
  setLocalStorage("cart", localStorageCart);
  // updated item count on shopping cart icon
  updateCartQty();
});

function checkIfSameProduct() {
  let localStorageCart = getLocalStorage("cart");
  for (let i = 0; i < localStorageCart.order.list.length; i++) {
    if (localStorageCart.order.list[i].id === productDetail.id &&
      localStorageCart.order.list[i].size === productDetail.size &&
      localStorageCart.order.list[i].color.code === productDetail.color.code) {
        sameProductIndex = i;
        console.log(i)
      } 
  }
};
//=== can also use findIndex for checkSameProduct, and assign the index to global variable
// function checkIfSameProduct () {
// let localStorageCart = getLocalStorage("cart");
//   sameProductIndex = localStorageCart.order.list.findIndex(x => 
//     (x.id === productDetail.id &&
//       x.size === productDetail.size &&
//       x.color.code === productDetail.color.code
//     ))
//   console.log(sameProductIndex);
// };

/* ==================
Render Product Detail based on Query String
================== */
function renderItem (data) {
  // assign size/color variants to globally declared variants for later use
  parsedData = data.data;
  // A) itemMainImg (upper left section)
  let itemMainImg = document.querySelector(".itemMainImg");
  let mainImg = document.createElement("img");
  mainImg.setAttribute("src", parsedData.main_image);
  itemMainImg.appendChild(mainImg);
  // B) itemDetails (upper right section)
  document.querySelector(".itemName").textContent = parsedData.title;
  document.querySelector(".itemID").textContent = parsedData.id;
  document.querySelector(".itemPrice").textContent = `TWD. ${parsedData.price}`;
  // item color loop
  let itemColors = document.querySelector(".itemColors");
  for (let i = 0; i < parsedData.colors.length; i++) {
    let colorLoop = document.createElement("div");
    colorLoop.classList.add("itemColorChip", "pointer");
    colorLoop.setAttribute("style", `background-color:#${parsedData.colors[i].code}`);
    colorLoop.setAttribute("onClick", `selectedColor(${i})`);
    // loop color_code to #id to assign to global variable currentColorCode
    colorLoop.setAttribute("id", parsedData.colors[i].code);
    colorLoop.setAttribute("title", parsedData.colors[i].name);
    itemColors.appendChild(colorLoop);
    // 1) use switch to assign "current" classList to the first color/size on page loading
    switch(i) {
      case 0:
        colorLoop.classList.add("current");
        break;
    }
  };
  // item size loop
  let itemSizes = document.querySelector(".itemSizes");
  for (let i = 0; i < parsedData.sizes.length; i++) {
    let sizeLoop = document.createElement("div");
    sizeLoop.classList.add("sizeCircle", "pointer");
    sizeLoop.innerHTML = parsedData.sizes[i];
    sizeLoop.setAttribute("onClick", `selectedSize('${parsedData.sizes[i]}')`)
    // loop size to #id to assign to global variable currentColorCode
    sizeLoop.setAttribute("id", parsedData.sizes[i])
    itemSizes.appendChild(sizeLoop);
    // 1) use switch to assign "current" classList to the first color/size on page loading
    switch(i) {
      case 0:
        sizeLoop.classList.add("current");
        break;
    }
  };
  document.querySelector(".itemNote").innerHTML = `*${parsedData.note}`;
  document.querySelector(".itemTexture").innerHTML = parsedData.texture;
  document.querySelector(".itemDesc").innerHTML = parsedData.description.replace(/\r\n/g, "<br/>");;
  document.querySelector(".itemWash").innerHTML = `清洗：${parsedData.wash}`;
  document.querySelector(".itemPlace").innerHTML = `產地：${parsedData.place}`;
  // C) itemInfo (story & additional item images)
  document.querySelector(".itemInfoStory").innerHTML = parsedData.story;
  let itemInfoImg = document.querySelector(".itemInfoImg");
  parsedData.images.forEach(img => {
    itemImg = document.createElement("img");
    itemImg.setAttribute("src", img)
    itemInfoImg.appendChild(itemImg);
  });
  //=========== assign current color/size/stock on page loading
  currentColorCode = document.querySelectorAll(".current")[0].id;
  currentColorTitle = document.querySelectorAll(".current")[0].title;
  currentSizeID = document.querySelectorAll(".current")[1].id;
  // initiate fetchStock() for currentColor/SizeID, assign to global currentStock
  // use currentStock to set condition for "-quantity+" button
  fetchStock();
  // after sizeCircles are created through loop
  // assign to global sizeCircle, for checkOutOfStockSize() to style out-of-stock size
  sizeCircle = document.getElementsByClassName("sizeCircle");
  //===========
  updateProductDetail();
};

// assign product detail to global variable productDetail
// call updateProductDetail() on every click action on page (selection on color, size, qty)
function updateProductDetail() {
  productDetail.id = parsedData.id;
  productDetail.main_image = parsedData.main_image;
  productDetail.name = parsedData.title;
  productDetail.price = parsedData.price;
  productDetail.qty = qtyCount;
  productDetail.size = currentSizeID;
  productDetail.stock = currentStock;
  productDetail.color.code = currentColorCode;
  productDetail.color.name = currentColorTitle;
  // use return to get something out of calling this function: for localStorage
  return productDetail;
}

/* ==================
onClick() color and size
================== */
const selectedColor = (index) => {
  let itemColorChip = document.getElementsByClassName("itemColorChip");
    for (let i = 0; i < itemColorChip.length; i++) {
      // 砍掉重練 reset every color chip and remove noStock size
      itemColorChip[i].classList.remove("current");
      sizeCircle[i].classList.remove("noStock");
      // apply "current" CSS styling to selected color
      itemColorChip[index].classList.add("current");
      // re-assign global colorID with each click
      currentColorCode = itemColorChip[index].id;
      currentColorTitle = itemColorChip[index].title;
    }
    // check and update stock on each click
    fetchStock();
    qtyReset();
    updateProductDetail();
    // check what size is out of stock for selected color, apply CSS accordingly
    checkOutOfStockSize();
};

const selectedSize = (index) => {
  for (let i = 0; i < 3; i++) {
    // 砍掉重練 reset every sizeCircle style
    sizeCircle[i].classList.remove("current");
    if (sizeCircle[index].classList[1] !== "noStock") {
      sizeCircle[index].classList.add("current");
      currentSizeID = sizeCircle[index].id;
      // if user clicks on out-of-stock size, re-apply current styling with currentSizeID
    } else if (sizeCircle[index].classList[1] === "noStock") {
      sizeCircle[0].classList.add("current");
      currentSizeID = sizeCircle[0].id;
    }
  }
  // check and update stock on each click
  fetchStock();
  qtyReset();
  updateProductDetail();
};

function fetchStock(){
  let stockArray = parsedData.variants.filter(item => 
    (currentColorCode === item.color_code && 
    currentSizeID === item.size 
    ));
  if (stockArray[0].stock > 0) {
    currentStock = stockArray[0].stock
  } else {
    currentStock = 0;
  }
};

function checkOutOfStockSize () {
  let colorStockList = parsedData.variants.filter(item => currentColorCode === item.color_code)
  for (let i = 0; i < colorStockList.length; i++) {
    for (let j = 0; j < sizeCircle.length; j++) {
      sizeCircle[j].classList.remove("current");
      if (sizeCircle[j].id === colorStockList[i].size 
        && colorStockList[i].stock === 0) {
        sizeCircle[j].classList.add("noStock");
      } 
      sizeCircle[0].classList.add("current");
      currentSizeID = sizeCircle[0].id;
    } 
  }
  fetchStock();
};

/* ==================
Button: - Quantity +
================== */
qtyAdd.addEventListener("click", function(){
  if (qtyCount < currentStock) {
  qtyCount++;
  qtyValue.innerHTML = qtyCount;
  }
  updateProductDetail();
  
});

qtyMinus.onclick = function(){
  if (qtyCount > 1) {
  qtyCount--;
  qtyValue.innerHTML = qtyCount;
  }
  updateProductDetail();
};

function qtyReset () {
  qtyCount = 1;
  qtyValue.innerHTML = qtyCount;
  updateProductDetail();
};

/* ==================
Initial Page Loading
================== */
getAjax(`${API_HOST_Item}${idQuery}`, renderItem);