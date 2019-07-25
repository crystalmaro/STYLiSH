let localStorageCart = getLocalStorage("cart");
let cartProductContainer = document.querySelector(".cartProductContainer");

// ==============================
// Order Submit Function
// ==============================

function checkoutInput(){
  let inputFields = document.querySelectorAll(".checkoutInput");
  for(let i = 0; i < inputFields.length; i++){
    if(inputFields[i].value === ""){}
  } alert("please enter all user info");
};



function checkCartItem(){
    if (localStorageCart.order.list.length == 0 || localStorageCart.order.list.length == null) {
      let emptyCart = document.createElement("div");
      emptyCart.classList.add("emptyCart");
      emptyCart.innerHTML = "empty shopping cart";
      cartProductContainer.appendChild(emptyCart);
    } else {
      renderCartItem();
    }
};
checkCartItem();

function renderCartItem(){
  // let xIndex = 0;
  localStorageCart.order.list.forEach( x => {
    // individual item row
    let cartProductIndex = document.createElement("div");
    cartProductIndex.classList.add("cartProductIndex", "flex");
    // cartProductIndex.setAttribute("id", xIndex++);
    cartProductContainer.appendChild(cartProductIndex);

    // item image
    let cartProductPic = document.createElement("div");
    cartProductPic.classList.add("cartProductPic");
    let itemImg = document.createElement("img");
    itemImg.setAttribute("src", x.main_image);
    cartProductPic.appendChild(itemImg);
    cartProductIndex.appendChild(cartProductPic);

    // item info
    let cartProductInfo = document.createElement("div");
    cartProductInfo.classList.add("cartProductInfo");
    cartProductIndex.appendChild(cartProductInfo);
    // item info - name
    let cartProductName = document.createElement("div");
    cartProductName.classList.add("cartProductName");
    cartProductName.innerHTML = x.name;
    cartProductInfo.appendChild(cartProductName);
    // item info - id
    let cartProductID = document.createElement("div");
    cartProductID.classList.add("cartProductID");
    cartProductID.innerHTML = x.id;
    cartProductInfo.appendChild(cartProductID);
    // item info - color
    let cartProductColor = document.createElement("div");
    cartProductColor.classList.add("cartProductColor");
    cartProductColor.innerHTML = `顏色 | ${x.color.name}`;
    cartProductInfo.appendChild(cartProductColor);
    // item info - size
    let cartProductSize = document.createElement("div");
    cartProductSize.classList.add("cartProductSize");
    cartProductSize.innerHTML = `尺寸 | ${x.size}`;;
    cartProductInfo.appendChild(cartProductSize);

    // item value
    let cartProductVal = document.createElement("div");
    cartProductVal.classList.add("cartProductVal", "flex")
    cartProductIndex.appendChild(cartProductVal);
    // item value mobile row
    let cartProductValRow1 = document.createElement("div");
    cartProductValRow1.classList.add("cartProductValRow1-mobile")
    cartProductVal.appendChild(cartProductValRow1);
      // 數量 title
      let mobileQty = document.createElement("div");
      mobileQty.classList.add("cartProductTitle-mobile");
      mobileQty.textContent = "數量";
      cartProductValRow1.appendChild(mobileQty);
      // 單價 title
      let mobilePrice = document.createElement("div");
      mobilePrice.classList.add("cartProductTitle-mobile");
      mobilePrice.textContent = "單價";
      cartProductValRow1.appendChild(mobilePrice);
      // 小計 title
      let mobileSubt = document.createElement("div");
      mobileSubt.classList.add("cartProductTitle-mobile");
      mobileSubt.textContent = "小計";
      cartProductValRow1.appendChild(mobileSubt);
    // item value numeric
    let cartProductValRow2 = document.createElement("div");
    cartProductValRow2.classList.add("cartProductValRow2")
    cartProductVal.appendChild(cartProductValRow2);
    let cartProductQty = document.createElement("div")
    cartProductQty.classList.add("cartProductQty");
    cartProductValRow2.appendChild(cartProductQty);
      // 數量 value
      let qtyStockSelect = document.createElement("select");
      qtyStockSelect.classList.add("qtyStock");
      cartProductQty.appendChild(qtyStockSelect);
      // create select option via loop
      for (let i = 1; i <= x.stock; i++) {
        let qtyStockOption = document.createElement("option");
        qtyStockOption.setAttribute("value", i);
        qtyStockOption.innerHTML = i;
        if (i === x.qty) {
          qtyStockOption.selected = true;
          qtyStockOption.setAttribute("selected", "selected");
        }  
        qtyStockSelect.appendChild(qtyStockOption);   
      };
            // 數量 onChange event
            qtyStockSelect.addEventListener("change", function(){
              cartProductSubtotal.innerHTML = `NT. ${x.price * event.target.value}`;
              x.qty = Number(event.target.value);
              setLocalStorage("cart", localStorageCart);
              calculateCartSubtotal();
              calculateCartTotal();
            });
            
      // 單價 value
      let cartProductPrice = document.createElement("div");
      cartProductPrice.classList.add("cartProductPrice");
      cartProductPrice.innerHTML = `NT. ${x.price}`;
      cartProductValRow2.appendChild(cartProductPrice);
      // 小計 value
      let cartProductSubtotal = document.createElement("div");
      cartProductSubtotal.classList.add("cartProductSubtotal");
      cartProductSubtotal.innerHTML = `NT. ${x.price * x.qty}`;
      cartProductValRow2.appendChild(cartProductSubtotal);
            
    // item trash
    let cartProductTrash = document.createElement("div");
    cartProductTrash.classList.add("cartProductTrash");
    cartProductTrash.setAttribute("onClick", "removeItem(this)");
    let trashIcon = document.createElement("img");
    trashIcon.setAttribute("src", "../images/cart-remove.png");
    cartProductTrash.appendChild(trashIcon);
    cartProductIndex.appendChild(cartProductTrash);
  });
};

// ============================
// Remove Function
// ============================
function removeItem(el){
  let itemCount = document.querySelectorAll(".cartProductIndex");
  let itemIndex = -1;
  // remove item from localStorage
  for(let i = 0; i < itemCount.length; i++) {
    if (itemCount[i] == el.parentNode) {
      itemIndex = i;
    }
  }
  // splice(start splicing at updated itemIndex, remove 1 count from array)
  localStorageCart.order.list.splice(itemIndex, 1);
  setLocalStorage("cart", localStorageCart);
  // remove item on page
  let parent = el.parentNode;
  parent.parentNode.removeChild(parent);
  // update cart qty + order value
  updateCartQty();
  calculateCartSubtotal();
  calculateCartTotal();
};

// ============================
// Order Value Section Calculation
// ============================
function calculateCartSubtotal(){
let newSubtotal = 0;
  let cartProductSubtotal = document.querySelectorAll(".cartProductSubtotal");
  for (let i = 0; i < cartProductSubtotal.length; i++) {
    // slice 4 character count including the space between NT. and $ 
    newSubtotal += Number(cartProductSubtotal[i].innerHTML.slice(4));
    // console.log(newSubtotal)
  }
  let orderSubtotalVal = document.querySelector(".orderSubtotalVal");
  orderSubtotalVal.innerHTML = newSubtotal;
  localStorageCart.order.subtotal = orderSubtotalVal.innerHTML;
  setLocalStorage("cart", localStorageCart);
}
calculateCartSubtotal();

function calculateCartTotal(){
  let orderTotalVal = document.querySelector(".orderTotalVal");
  let orderShippingVal = document.querySelector(".orderShippingVal");
  let orderSubtotalVal = parseInt((document.querySelector(".orderSubtotalVal").innerHTML));
  let localStorageCart = getLocalStorage("cart");
  orderTotalVal.innerHTML = orderSubtotalVal + Number(orderShippingVal.innerHTML);

  localStorageCart.order.total = orderTotalVal.innerHTML;
  setLocalStorage("cart", localStorageCart);
};
calculateCartTotal();