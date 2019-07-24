// let localStorageCart.list = getLocalStorage("cart").list;
let localStorageCart = getLocalStorage("cart");

function renderCartProduct(){
  let cartProductContainer = document.querySelector(".cartProductContainer");
    if (localStorageCart.list.length === 0) {
        emptyCart = document.createElement("div");
        emptyCart.classList.add("emptyCart");
        emptyCart.innerHTML = "empty shopping cart";
        cartProductContainer.appendChild(emptyCart);
    } else {
    localStorageCart.list.forEach(x => {
      // individual item row
      let cartProductIndex = document.createElement("div");
      cartProductIndex.classList.add("cartProductIndex", "flex");
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
      

          // 數量 onChange event
          qtyStockSelect.addEventListener("change", function(){
            cartProductSubtotal.innerHTML = `NT. ${x.price * event.target.value}`;
            x.qty = Number(event.target.value);
            setLocalStorage("cart", localStorageCart);
          });

          
          
      // item trash
      let cartProductTrash = document.createElement("div");
      cartProductTrash.classList.add("cartProductTrash");
      let trashIcon = document.createElement("img");
      trashIcon.setAttribute("src", "../images/cart-remove.png");
      cartProductTrash.appendChild(trashIcon);
      cartProductIndex.appendChild(cartProductTrash);
    });

  }





};

renderCartProduct();