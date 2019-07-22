const idQuery = getParamName('id');
ajax(`${API_HOST_Item}${idQuery}`, renderItem);
let currentColorCode;
let currentColorTitle;
let currentSizeID;
let currentStock = 0;
let qtyCount = 1;
let qtyAdd = document.getElementById("qtyAdd");
let qtyMinus = document.getElementById("qtyMinus");
let qtyValue = document.querySelector(".qtyValue");
let sizeCircle;
let parsedData;
let existingItemIndex;
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

let localStorageCart = getLocalStorage("cart");

/* ==================
Button: Add to Cart
================== */
let sameProductIndex = -1;
let addCartButton = document.querySelector(".addCartButton");
/*========== add to cart logic notes
if (nothing in local storage) {
  insert first item into cart
} else {
  checkExistingProduct();
  if (existingItem = true) {
    update product size
  } else {
    push to currentList
  }
  re-set localStorage with the newly updated currentList
}
==========*/
addCartButton.addEventListener("click", function(){
  alert("added to cart")
  let localStorageCart = getLocalStorage("cart");

  if (localStorageCart === null) {
    // Insert first item into cart
    cartValue.list.push(updateProductDetail());
    setLocalStorage("cart", cartValue);
  } else {
    checkExistingProduct();
    if (existingItemIndex > -1) {
      localStorageCart.list[existingItemIndex].qty = productDetail.qty;
    } else {
      localStorageCart.list.push(updateProductDetail());
    }
    setLocalStorage("cart", localStorageCart);
  }
  updataCartQty();
});

function checkExistingProduct () {
let localStorageCart = getLocalStorage("cart");
  existingItemIndex = localStorageCart.list.findIndex(x => 
    (x.id === productDetail.id &&
      x.size === productDetail.size &&
      x.color.code === productDetail.color.code
    ))
  console.log(existingItemIndex);
}


/* ==================
Update Shopping Cart
================== */
function updataCartQty () {
let cartQty = document.querySelectorAll(".cartQty");
let localStorageCart = getLocalStorage("cart");
  if (localStorageCart === null) {
    cartValue.list = [];
  } else {
    for (let i = 0; i < cartQty.length; i++) {
      cartQty[i].innerHTML = localStorageCart.list.length;
    };
  };
};

// load cart quantity from localStorage on page loading
window.addEventListener("load", function(){
  updataCartQty();
});

/* ==================
take Parameter by page URL
================== */
function getParamName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

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
    let itemColorChip = document.createElement("div");
    itemColorChip.classList.add("itemColorChip", "pointer");
    itemColorChip.setAttribute("style", `background-color:#${parsedData.colors[i].code}`);
    itemColorChip.setAttribute("onClick", `selectedColor(${i})`);
    // loop color_code to #id to assign to global variable currentColorCode
    itemColorChip.setAttribute("id", parsedData.colors[i].code);
    itemColorChip.setAttribute("title", parsedData.colors[i].name);
    itemColors.appendChild(itemColorChip);
    // 1) use switch to assign "current" classList to the first color/size on page loading
    switch(i) {
      case 0:
        itemColorChip.classList.add("current");
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
function updateProductDetail () {
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
    for (let i = 0; i < 3; i++) {
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

function fetchStock() {
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
Button: Quantity
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