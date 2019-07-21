const idQuery = getParamName('id');
ajax(`${API_HOST_Item}${idQuery}`, renderItem);
let currentColorID;
let currentSizeID;
let currentStock = 0;
let variants;
let sizeList;

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
    sizeCircle.setAttribute("onClick", `selectedSize('${item.sizes[i]}')`)
    // loop size to #id to assign to global variable currentColorID
    sizeCircle.setAttribute("id", item.sizes[i])
    itemSizes.appendChild(sizeCircle);
    switch(i) {
      case 0:
        sizeCircle.classList.add("current");
        break;
    }
  };
  // assign to global sizeList, to use for checkStock(), to disable size without stock
  sizeList = itemSizes.querySelectorAll(".sizeCircle");
  currentSizeID = document.querySelectorAll(".current")[1].id;
  document.querySelector(".itemNote").innerHTML = `*${item.note}`;
  document.querySelector(".itemTexture").innerHTML = item.texture;
  document.querySelector(".itemDesc").innerHTML = item.description.replace(/\r\n/g, "<br/>");;
  document.querySelector(".itemWash").innerHTML = `清洗：${item.wash}`;
  document.querySelector(".itemPlace").innerHTML = `產地：${item.place}`;
  // 1) use switch to assign "current" classList to the first color/size on loading
  // 2) initiate fetchStock() for current color/size, to assign currentStock
  // 3) use currentStock to set condition for - quantity+ button
  fetchStock();
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
// let sizeCircle = document.getElementsByClassName("sizeCircle");
qtyReset();
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
  checkOutOfStock();
};

const selectedSize = (index) => {
  let sizeCircle = document.getElementsByClassName("sizeCircle");
  qtyReset();
  for (let i = 0; i < 3; i++) {
    sizeCircle[i].classList.remove("current");
    if (index !== undefined) {
      sizeCircle[index].classList.add("current");
      currentSizeID = sizeCircle[index].id;
    } 
  }

  // check and update stock on each click
  fetchStock();
};

function fetchStock() {
  let stockArray = variants.filter(item => 
    (currentColorID === item.color_code && 
    currentSizeID === item.size 
    ));

// stockArray.length > 0
  if (stockArray[0].stock > 0) {
    currentStock = stockArray[0].stock
  } else {
    currentStock = 0;
  }
  console.log(stockArray)
  console.log(stockArray[0].stock)
  console.log(stockArray[0].size)
  console.log(sizeList[1].id)
  console.log(currentStock)
  console.log(currentColorID)
  console.log(variants[0].color_code)
}

function checkOutOfStock () {
  //@todo get a stock/size List array from variants for currentColorID
  let noStockSize = variants.filter(item => currentColorID === item.color_code && item.stock === 0)[0].size
  console.log(noStockSize)

  // for (let j = 0; j < sizeList.length; j++) {
  //   for (let i = 0; i < colorStockList.length; i++) {
  //     if (colorStockList[i].stock === 0) {
  //       console.log(colorStockList[i].size)
  //     }
  //   }
  // }

}



//   if (currentColorID = variants[0].color_code) {
//     for (let i = 0; i < sizeList.length; i++) {
//       console.log(sizeList[i].id)
//       if (stockArray[0].size === sizeList[i].id && stockArray[0].stock === 0) {
//       alert("hello")
//       }
//     }
//   }


// for (let i = 0; i < variants.length; i++) {
//   for (let j = 0; j < sizeList.length; j++) {
//     if (currentColorID = variants[i].color_code && )
//   }
// }








  // for (let i = 0; i < AllsizeCircle.length; i++) {

  // }

  // @todo check current color's size's stock
  // if variants.stock = 0, then classList.add("disabled")




/* ==================
Button: Add to Cart
================== */
let qtyCount = 1;
let qtyAdd = document.getElementById("qtyAdd");
let qtyMinus = document.getElementById("qtyMinus");
let qtyValue = document.querySelector(".qtyValue");

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