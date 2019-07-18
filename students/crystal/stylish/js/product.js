const id = getParamName('id');

ajax(`${API_HOST_Item}${id}`, renderItem);

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
console.log(id);
console.log(`${API_HOST_Item}${id}`)
// https://api.appworks-school.tw/api/1.0/products/details?id=123456789




function renderItem (data) {
  let itemContainer = document.querySelector(".itemContainer");
  let item = data.data;

  // @todo C) itemSeparator 
  let itemSeparator = document.querySelector(".itemSeparator");
  // itemContainer.appendChild(itemSeparator)
  // itemMainImg.appendChild("itemSeparator")


  // @todo A) itemMainImg
  let itemMainImg = document.createElement("div");
  itemMainImg.className = "itemMainImg";
  let mainImg = document.createElement("img");
  mainImg.setAttribute("src", item.main_image);
  itemMainImg.appendChild(mainImg);
  itemContainer.appendChild(itemMainImg);
  // itemSeparator.insertBefore(itemMainImg, itemSeparator.childNodes[0]);

 /* @todo B) itemDetails
    itemContainer.appendChild(itemDetails)*/
  let itemDetails = document.createElement("div");
  itemDetails.className = "itemDetails";
  itemContainer.appendChild(itemDetails);

  let itemName = document.createElement("div")
  itemName.className = "itemName";
  itemName.innerHTML = item.title;
 itemDetails.appendChild(itemName);

  let itemID = document.createElement("div");
  itemID.className = "itemID";
  itemID.innerHTML = item.id;
  itemDetails.appendChild(itemID);

  let itemPrice = document.createElement("div");
  itemPrice.className = "itemPrice";

    console.log("3. itemPrice: " + item.price);
    // create parent color element
    // loop itemColors to create individual itemColorChip
    console.log("4. itemColors - itemColorChip: " + item.colors[0].code);    // create parent size element
    // loop itemSizes to create individual sizeCircle
    console.log("5. itemSizes - sizeCircle: " + item.sizes[0]);
    // create dummy 6. itemQty div for now
    // create dummy 7. addCart div for now
    console.log("8. itemSummary: " + item.texture);
    // app.get("#product-summary").innerHTML=product.note+"<br/><br/>"+product.texture+"<br/>"+product.description.replace(/\r\n/g, "<br/>")+"<br/><br/>清洗："+product.wash+"<br/>產地："+product.place;

   

    /* @todo D) itemInfo
        itemContainer.appendChild(itemInfo)*/

}


