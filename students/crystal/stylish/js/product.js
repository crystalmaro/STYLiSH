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
/* ==================
Render Product Detail based on Query String
================== */
function renderItem (data) {
  let itemContainer = document.querySelector(".itemContainer");
  let item = data.data;

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
  item.colors.forEach(color => {
    itemColorChip = document.createElement("div");
    itemColorChip.className = "itemColorChip pointer"
    itemColorChip.setAttribute("style", "background-color:#" + color.code);
    itemColors.appendChild(itemColorChip);
  });
  // item size loop
  let itemSizes = document.querySelector(".itemSizes");
  item.sizes.forEach(sizing => {
      sizeCircle = document.createElement("div");
      sizeCircle.className = "sizeCircle pointer";
      sizeCircle.innerHTML = sizing;
      itemSizes.appendChild(sizeCircle);
  });
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