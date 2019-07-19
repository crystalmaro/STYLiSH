const idQuery = getParamName('id');
ajax(`${API_HOST_Item}${idQuery}`, renderItem);
let currentColorID;
let currentSizeID;
let currentStock = 0;
let variants;

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
    switch(i) {
      case 0:
        itemColorChip.classList.add("current");
        break;
    }
  };
  currentColorID = document.querySelectorAll(".current")[0].id;
  // item size loop
  let itemSizes = document.querySelector(".itemSizes");
  for (let i = 0; i < item.sizes.length; i++) {
    let sizeCircle = document.createElement("div");
    sizeCircle.className = "sizeCircle";
    sizeCircle.innerHTML = item.sizes[i];
    sizeCircle.setAttribute("onClick", `selectedSize(${i})`)
    // loop size to #id to assign to global variable currentColorID
    sizeCircle.setAttribute("id", item.sizes[i])
    itemSizes.appendChild(sizeCircle);
    switch(i) {
      case 0:
        sizeCircle.classList.add("current");
        break;
    }
  };
  currentSizeID = document.querySelectorAll(".current")[1].id;
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
};

/* ==================
onClick() CSS for selected color and size
================== */
const selectedColor = (index) => {
let itemColorChip = document.getElementsByClassName("itemColorChip");
let sizeCircle = document.getElementsByClassName("sizeCircle");
  for (let i = 0; i < 3; i++) {
    // 砍掉重練 reset every color chip
    itemColorChip[i].classList.remove("current");
    if (true) {
      itemColorChip[index].classList.add("current");
      currentColorID = itemColorChip[index].id;
    }
  }
  // check and update stock on each click
  fetchStock();
  console.log(currentColorID);
};

const selectedSize = (index) => {
  let sizeCircle = document.getElementsByClassName("sizeCircle");
  for (let i = 0; i < 3; i++) {
    sizeCircle[i].classList.remove("current");
    if (index !== undefined) {
      sizeCircle[index].classList.add("current");
      currentSizeID = sizeCircle[index].id;
    } 
  }
  // check and update stock on each click
  fetchStock();
  console.log(currentSizeID);
};

function fetchStock() {
  let stockArray = variants.filter(item => 
    (currentColorID === item.color_code && 
    currentSizeID === item.size && 
    item.stock > 0));

  if (stockArray.length > 0) {
    currentStock = stockArray[0].stock
  } else {

    currentStock = 0;
  }
  console.log(stockArray)
}

function checkStock() {

  // @todo check current color's size's stock
  // if variants.stock = 0, then classList.add("disabled")

}


/* ==================
Button: Add to Cart
================== */
let cartMinus = document.querySelectorAll(".qtyModify")[0];
let cartPlus = document.querySelectorAll(".qtyModify")[1];
let qtyValue = document.querySelector(".qtyValue");
let initValue = 1;

function qtyBtn (action) {
let qtyValue = document.querySelector(".qtyValue").textContent;
let parsedQty = parseInt(qtyValue) //change string to number
  if (action === "add") {
    if (parsedQty < currentStock) {
      parsedQty++;
      qtyValue.textContent = parsedQty;
    } 
  }
    
  if (action === "minus") {
    if (parsedQty > 1) {
      parsedQty-- 
    }
    qtyValue.textContent = parsedQty
  }
};