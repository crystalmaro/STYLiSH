const idQuery = getParamName('id');
ajax(`${API_HOST_Item}${idQuery}`, renderItem);
let currentColorID;
let currentSizeID;
let currentStock = 0;
let variants;
let sizeList;
let qtyCount = 1;
let qtyAdd = document.getElementById("qtyAdd");
let qtyMinus = document.getElementById("qtyMinus");
let qtyValue = document.querySelector(".qtyValue");

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
  let itemContainer = document.querySelector(".itemContainer");
  let item = data.data;
  // assign size/color variants to globally declared variants for later use
  variants = item.variants;

  // A) itemMainImg (upper left section)
  let itemMainImg = document.querySelector(".itemMainImg");
  let mainImg = document.createElement("img");
  mainImg.setAttribute("src", item.main_image);
  itemMainImg.appendChild(mainImg);

  // B) itemDetails (upper right section)
  document.querySelector(".itemName").textContent = item.title;
  document.querySelector(".itemID").textContent = item.id;
  document.querySelector(".itemPrice").textContent = `TWD. ${item.price}`;
  // item color loop
  let itemColors = document.querySelector(".itemColors");
  for (let i = 0; i < item.colors.length; i++) {
    let itemColorChip = document.createElement("div");
    itemColorChip.className = "itemColorChip";
    itemColorChip.setAttribute("style", `background-color:#${item.colors[i].code}`);
    itemColorChip.setAttribute("onClick", `selectedColor(${i})`);
    // loop color_code to #id to assign to global variable currentColorID
    itemColorChip.setAttribute("id", item.colors[i].code);
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
  for (let i = 0; i < item.sizes.length; i++) {
    let sizeCircle = document.createElement("div");
    sizeCircle.className = "sizeCircle";
    sizeCircle.innerHTML = item.sizes[i];
    sizeCircle.setAttribute("onClick", `selectedSize('${item.sizes[i]}')`)
    // loop size to #id to assign to global variable currentColorID
    sizeCircle.setAttribute("id", item.sizes[i])
    itemSizes.appendChild(sizeCircle);
    // 1) use switch to assign "current" classList to the first color/size on page loading
    switch(i) {
      case 0:
        sizeCircle.classList.add("current");
        break;
    }
  };
  document.querySelector(".itemNote").innerHTML = `*${item.note}`;
  document.querySelector(".itemTexture").innerHTML = item.texture;
  document.querySelector(".itemDesc").innerHTML = item.description.replace(/\r\n/g, "<br/>");;
  document.querySelector(".itemWash").innerHTML = `清洗：${item.wash}`;
  document.querySelector(".itemPlace").innerHTML = `產地：${item.place}`;

  // C) itemInfo (story & additional item images)
  document.querySelector(".itemInfoStory").innerHTML = item.story;
  let itemInfoImg = document.querySelector(".itemInfoImg");
  item.images.forEach(img => {
    itemImg = document.createElement("img");
    itemImg.setAttribute("src", img)
    itemInfoImg.appendChild(itemImg);
  });
  // (1) set default (page loading) color and size, assign to global variables (currentColor/SizeID)
  // (2) currentColor/SizeID are used to load stock for default color/size via fetchStock()
  currentColorID = document.querySelectorAll(".current")[0].id;
  currentSizeID = document.querySelectorAll(".current")[1].id;
  // (3) initiate fetchStock() for currentColor/SizeID, assign to global currentStock
  // (4) use currentStock to set condition for "-quantity+" button
  fetchStock();
  // assign to global sizeList, for checkOutOfStockSize() to style out-of-stock size
  sizeList = itemSizes.querySelectorAll(".sizeCircle");
};

/* ==================
onClick() CSS for selected color and size
================== */
const selectedColor = (index) => {
let itemColorChip = document.getElementsByClassName("itemColorChip");
let sizeCircle = document.getElementsByClassName("sizeCircle");
// reset quantity inside 數量 button
qtyReset();
  for (let i = 0; i < 3; i++) {
    // 砍掉重練 reset every color chip and remove noStock size
    itemColorChip[i].classList.remove("current");
    sizeCircle[i].classList.remove("noStock");
    // sizeCircle[currentSizeID].classList.add("current");

    itemColorChip[index].classList.add("current");
    currentColorID = itemColorChip[index].id;
  }
  // check and update stock on each click
  fetchStock();
  // check what size is out of stock for selected color, apply CSS accordingly
  checkOutOfStockSize();
};

const selectedSize = (index) => {
  let sizeCircle = document.getElementsByClassName("sizeCircle");
  
  for (let i = 0; i < 3; i++) {
    // 砍掉重練 reset every sizeCircle style
    sizeCircle[i].classList.remove("current");
    if (sizeCircle[index].classList[1] !== "noStock") {
      sizeCircle[index].classList.add("current");
      currentSizeID = sizeCircle[index].id;
      // if user clicks on out-of-stock size, re-apply current styling with currentSizeID
    } else if (sizeCircle[index].classList[1] === "noStock") {
      sizeCircle[currentSizeID].classList.add("current");
    }
  }
  // check and update stock on each click
  fetchStock();
  qtyReset();
};

function fetchStock() {
  let stockArray = variants.filter(item => 
    (currentColorID === item.color_code && 
    currentSizeID === item.size 
    ));
  if (stockArray[0].stock > 0) {
    currentStock = stockArray[0].stock
  } else {
    currentStock = 0;
  }
};

function checkOutOfStockSize () {
  let colorStockList = variants.filter(item => currentColorID === item.color_code)
  for (let i = 0; i < colorStockList.length; i++) {
    for (let j = 0; j < sizeList.length; j++) {
      sizeList[j].classList.remove("current");
      if (sizeList[j].id === colorStockList[i].size 
        && colorStockList[i].stock === 0) {
        sizeList[j].classList.add("noStock");
      } 
      sizeList[0].classList.add("current");
    } 
  }
};

/* ==================
Button: Add to Cart
================== */
qtyAdd.addEventListener("click", function(){
  if (qtyCount < currentStock) {
  qtyCount++;
  qtyValue.innerHTML = qtyCount;
  }
});

qtyMinus.onclick = function(){
  if (qtyCount > 1) {
  qtyCount--;
  qtyValue.innerHTML = qtyCount;
  }
};

function qtyReset () {
  qtyCount = 1;
  qtyValue.innerHTML = qtyCount;
};