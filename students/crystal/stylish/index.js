
const HOST = "https://api.appworks-school.tw";
const API_HOST = "https://api.appworks-school.tw/api/1.0";
const API_HOST_Products = "https://api.appworks-school.tw/api/1.0/products";
let type = "all";
let pageNumber;
let pagingURL;
let ind = 0;


/* ==================
AJAX
================== */
function ajax(src, callback) { 
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      callback(JSON.parse(xhr.response));
    }
  }
  xhr.open("GET", src);
  xhr.send();
}


// === Render & display on initial loading
// another method: window.addEventListener()
ajax(`${API_HOST_Products}/${type}`, renderProduct);
ajax(`${API_HOST}/marketing/campaigns`, renderCampaign)

/* ==================
Marketing Campaign
================== */
let campaignSlider = (index) => {
  let campaign = document.getElementsByClassName("campaign");
  let campaignCircle = document.getElementsByClassName("campaignCircle");

  for (let i = 0; i < 3; i++) {
    campaign[i].classList.remove("current");
    campaignCircle[i].classList.remove("current");
  }
  // check if index is undefined (param passed by onClick action)
  if (index !== undefined) {
    campaign[index].classList.add("current");
    campaignCircle[index].classList.add("current");
  } else {
  // if undefined, then (ind++ % 3)
    campaign[ind].classList.add("current");
    campaignCircle[ind].classList.add("current");
    ind += 1;
    ind %= 3;
  }
};

// === (initial display:hide - show using campaignSlider()
function renderCampaign (data) {
  let campaignData = data.data
  let keyVisualSection = document.querySelector(".keyVisualSection");
  keyVisualSection.className = "keyVisualSection";
  for (let i = 0; i < campaignData.length; i++) {

    // campaign container
    let campaign = document.createElement("div");
    campaign.className = "campaign";
    campaign.setAttribute("style", `background-image:url(${HOST}${campaignData[i].picture})`);
    
    // campaign clickable background image
    let campaignLink = document.createElement("a");
    campaignLink.className = "campaignLink";
    campaignLink.setAttribute("href", `${HOST}/product.html?id=${campaignData[i].product_id}`)
    campaign.appendChild(campaignLink);
    
    // campaign story text
    let campaignStory = document.createElement("div");
    campaignStory.className = "campaignStory";
    campaignStory.innerHTML = campaignData[i].story.replace(/\r\n/g, "<br/>");
    console.log
    campaign.appendChild(campaignStory);

    keyVisualSection.appendChild(campaign);
  }
    // campaign circle toggle
  let campaignStep = document.createElement("div");
  campaignStep.className = "campaignStep";
  for (let i = 0; i < campaignData.length; i++) {
      let campaignCircle = document.createElement("a");
      campaignCircle.setAttribute("onClick", `campaignSlider(${i})`);
      campaignCircle.className = "campaignCircle";
      campaignStep.appendChild(campaignCircle);
      keyVisualSection.appendChild(campaignStep);
  }
  // load the first campaign data on loading
  campaignSlider(0);
  // display next campaign every 5 seconds
  setInterval(campaignSlider, 2000) 
};

/* ==================
Remove Element
================== */
function removeElement(className){
  let elements = document.querySelector("."+className);
    while(elements.firstChild){
      elements.removeChild(elements.firstChild);
    }
};

/* ==================
Render Products
================== */
const getProducts = (inputType) => {
  type = inputType;
  removeElement("allProducts");
    ajax(`${API_HOST_Products}/${inputType}`, renderProduct);
};

// === Product display rendering dynamically (createElement)
function renderProduct(data) {
  let allProducts = document.querySelector(".allProducts");
  let product = data.data;

  // pagingURL for scroll event
  if (data.paging !== undefined) {
    pagingURL = `${API_HOST_Products}/${type}?paging=${data.paging}`;
    window.addEventListener("scroll", handleScroll);
  } else {
    pagingURL = "";
    window.removeEventListener("scroll", handleScroll);
  }

  for (let i = 0; i < product.length; i++) {
    let productContainer = document.createElement("div");
      productContainer.setAttribute("class", "productContainer");
  
    // div.productImage
    let productImage = document.createElement("img");
    productImage.setAttribute("class", "productImage");
    productImage.setAttribute("src", `${product[i].main_image}`);
    productContainer.appendChild(productImage);

    // div.allColors
    let allColors = document.createElement("div");
    allColors.setAttribute("class", "allColors");
    productContainer.appendChild(allColors);
    // div.allColors (individual color chip)
    for (let j = 0; j < product[i].colors.length; j++) { 
      let colorChip = document.createElement("div");
      colorChip.setAttribute("class", "colorChip");
      colorChip.setAttribute("title", product[i].colors[j].name);
      colorChip.setAttribute("style", `background-color:#${product[i].colors[j].code};`);
      allColors.appendChild(colorChip);
    };
      /* ------- forEach also works for colorChip
      product[i].colors.forEach(color => {
      colorChip = document.createElement("div");
      colorChip.setAttribute("class", "color");
      colorChip.setAttribute("style", "background-color:#" + color.code);
      colorChip.title = color.name;
      allColors.appendChild(colorChip);
      });
      ------- */
    
    // div.productName
    let productName = document.createElement("div");
    productName.setAttribute("class", "productName");
    productName.innerHTML = product[i].title;
    productContainer.appendChild(productName);

    // div.productPrice
    let productPrice = document.createElement("div");
    productPrice.setAttribute("class", "productPrice");
    productPrice.appendChild(document.createTextNode(`TWD.${product[i].price}`))
    productContainer.appendChild(productPrice);

    allProducts.appendChild(productContainer);
  }
};

/* ==================
Search Function
================== */
const search = () => { 
  let input = document.querySelector(".searchInput").value;
  let searchResult = API_HOST_Products + "/search?keyword=" + input;
  // 先移除目前的東西，再render搜尋結果
  removeElement("allProducts");
  ajax(searchResult, renderProduct);
  // 模擬使用者點擊 stimulate user click to close search bar on mobile
  let searchInput = document.querySelector(".searchInput");
  searchInput.click();
}

let showMobileSearch = () => {
  let searchInput = document.querySelector(".searchInput");
  let navFeature = document.querySelector(".navFeature");
  // let nav = document.querySelector("nav");
  if (searchInput.className === "searchInput" && navFeature.className === "navFeature") {
    searchInput.classList.add("open");
    navFeature.className += " open";
  } else {
    searchInput.classList.remove("open");
    navFeature.className = "navFeature";
  }
}

/* ==================
Scrolling & Paging Feature
================== */
window.addEventListener("scroll", handleScroll);

function handleScroll(e) {
    let ticking = false;
    if (!ticking) {
      window.requestAnimationFrame(function () {
        endlessScroll();
        ticking = false;
      });
    }
    ticking = true;
  }
// 真測是不是快滑到最下面
let endlessScroll = () => {
  let windowHeight = window.innerHeight;
  let remainingFooter = document.querySelector("footer").getBoundingClientRect().top;
    if (remainingFooter - windowHeight < 0) {
      ajax(pagingURL, setExtProduct);
      window.removeEventListener("scroll", handleScroll);
    }
}

function setExtProduct(data) {
  if (data.paging !== undefined) {
    pageNumber ++;
    // setting data.paging(right) to the global pageNumber(left);
    pageNumber = data.paging;
  }
  window.addEventListener("scroll", handleScroll);
  renderProduct(data);
};