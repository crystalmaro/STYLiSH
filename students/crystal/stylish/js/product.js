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
  console.log(variants.length)

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
    itemColorChip.setAttribute("id", item.colors[i].code);
    itemColors.appendChild(itemColorChip);
    switch(i) {
      case 0:
        itemColorChip.classList.add("current");
        break;
    }
    currentColorID = document.querySelectorAll(".current")[0].id;
    // console.log(currentColorID);
  };
  // item size loop
  let itemSizes = document.querySelector(".itemSizes");
  for (let i = 0; i < item.sizes.length; i++) {
    let sizeCircle = document.createElement("div");
    sizeCircle.className = "sizeCircle";
    sizeCircle.innerHTML = item.sizes[i];
    sizeCircle.setAttribute("onClick", `selectedSize(${i})`)
    sizeCircle.setAttribute("id", item.sizes[i])
    itemSizes.appendChild(sizeCircle);
    switch(i) {
      case 0:
        sizeCircle.classList.add("current");
        break;
    }
    currentSizeID = document.querySelectorAll(".current")[1].id;
    // console.log(currentSizeID);
  };
  document.querySelector(".itemNote").innerHTML = `*${item.note}`;
  document.querySelector(".itemTexture").innerHTML = item.texture;
  document.querySelector(".itemDesc").innerHTML = item.description.replace(/\r\n/g, "<br/>");;
  document.querySelector(".itemWash").innerHTML = `清洗：${item.wash}`;
  document.querySelector(".itemPlace").innerHTML = `產地：${item.place}`;
   
  // @todo C) itemInfo (additional item images)
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
  for (let i = 0; i < 3; i++) {
    itemColorChip[i].classList.remove("current");
    if (index !== undefined) {
      itemColorChip[index].classList.add("current");
      currentColorID = itemColorChip[index].id;
        if ()
    } 
    // else {
    //   itemColorChip[index].classList.remove("current");
    // }
  }
  checkStock();
  console.log(currentColorID);
};

function checkStock () {
  const stockArray = variants.filter(stock => 
    (currentColorID === stock.color_code && 
    currentSizeID === stock.size && 
    stock.stock > 0));

  if (stockArray.length > 0) {
    currentStock = stockArray[0].stock
  } else {
    currentStock = 0;
  }
}

// function selectedColor (index) {
//   let itemColorChip = document.getElementsByClassName("itemColorChip");
//   // for (let i = 0; i < 3; i++) {
    
//     // if (index !== undefined) {
//     //   itemColorChip[index].classList.add("current");
//     // } else {
//     //   itemColorChip[index].classList.add("remove");
//     // }

//     for (let i = 0; i < variants.length; i++) {
//     if (currentColorID === variants[i].color_code && currentSizeID === variants[i].size) {
//       itemColorChip[index].classList.add("current");
//       currentColorID = itemColorChip[index].id;
//       currentStock = variants[i].stock;  
//     }
//   }
//   // }
//   console.log("currentColor: "+currentColorID)
//   console.log("currentSize: "+currentSizeID)
//   console.log(variants)
//   console.log("current stock: "+currentStock)
// }

// function selectedSize (index) {
//   let sizeCircle = document.getElementsByClassName("sizeCircle");
//   for (let i = 0; i < variants.length; i++) {
//     i
//   }
// }

const selectedSize = (index) => {
  let sizeCircle = document.getElementsByClassName("sizeCircle");
  for (let i = 0; i < 3; i++) {
    sizeCircle[i].classList.remove("current");
    if (index !== undefined) {
      sizeCircle[index].classList.add("current");
      currentSizeID = sizeCircle[index].id;
    } 
    else {
      sizeCircle[index].classList.remove("current");
    }
  }
  checkStock();
  console.log(currentSizeID);
};



/* ==================
Button: Add to Cart
================== */
// let cartMinus = document.querySelectorAll(".qtyModify")[0];
// let cartPlus = document.querySelectorAll(".qtyModify")[1];
// let qtyValue = document.querySelector(".qtyValue");
// let initValue = 1;
// let maxQty = false;

// cartPlus.addEventListener("click", function(){
//   qtyValue.textContent = x++
// });
