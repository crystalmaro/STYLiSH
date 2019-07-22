const idQuery = getParamName('id');
ajax(`${API_HOST_Item}${idQuery}`, renderItem);
let currentColorCode;
let currentColorTitle;
let currentSizeID;
let currentStock = 0;
// let variants;
let sizeList;
let qtyCount = 1;
let qtyAdd = document.getElementById("qtyAdd");
let qtyMinus = document.getElementById("qtyMinus");
let qtyValue = document.querySelector(".qtyValue");
let sizeCircle;
let parsedData;


/* ==================
Local Storage
================== */
let productDetail = {
  id: "",
  main_image: "",
  name: "",
  price: "",
  qty: "",
  size: "",
  stock: "",
  color: {
    code: "",
    name: ""
  }
}



let cartStructure = {
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

let item = {};

// function SetLocalStorage(item, cart){
                        //(key, value)
  localStorage.setItem("cart", JSON.stringify(cartStructure));
// }

// function GetLocalStorage(item){
  // return 
  JSON.parse(localStorage.getItem("cart"));

// }

// SetLocalStorage(item, cart)


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
  // variants = parsedData.variants;
 
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
    itemColorChip.className = "itemColorChip";
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
    sizeLoop.className = "sizeCircle";
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
  resetProductDetail();
};

// assign product detail to global variable productDetail
// call resetProductDetail() on every click action on page
// click actions: color, size, qty
function resetProductDetail() {
  productDetail.id = parsedData.id;
  productDetail.main_image = parsedData.main_image;
  productDetail.name = parsedData.title;
  productDetail.price = parsedData.price;
  productDetail.qty = qtyCount;
  productDetail.size = currentSizeID;
  productDetail.stock = currentStock;
  productDetail.color.code = currentColorCode;
  productDetail.color.name = currentColorTitle;
}

/* ==================
onClick() CSS for selected color and size
================== */
const selectedColor = (index) => {
  let itemColorChip = document.getElementsByClassName("itemColorChip");
  // reset quantity inside 數量 button
  qtyReset();
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
    // check what size is out of stock for selected color, apply CSS accordingly
    checkOutOfStockSize();
    resetProductDetail();
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
  resetProductDetail();
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
  console.log(colorStockList)
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
  resetProductDetail();
});

qtyMinus.onclick = function(){
  if (qtyCount > 1) {
  qtyCount--;
  qtyValue.innerHTML = qtyCount;
  }
  resetProductDetail();
};

function qtyReset () {
  qtyCount = 1;
  qtyValue.innerHTML = qtyCount;
  resetProductDetail();
};


/* ==================
Button: Add to Cart
================== */
let addCartButton = document.querySelector(".addCartButton");

addCartButton.addEventListener("click", function(){
  
})