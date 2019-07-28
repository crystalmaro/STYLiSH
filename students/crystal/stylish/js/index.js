
/* ==================
Variables
================== */
// type="all" on initial loading
let type = "all";
// after <a> refirection, tag = tagQuery: all, women, men, or accessories 
let tagQuery = getParamName("tag");
let pageNumber;
let pagingURL;
let ind = 0;

/* ==================
Marketing Campaign
================== */
// === initial display:hide - show using campaignSlider()
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
    campaignLink.setAttribute("href", `product.html?id=${campaignData[i].product_id}`);
    campaign.appendChild(campaignLink);
    
    // campaign story text
    let campaignStory = document.createElement("div");
    campaignStory.className = "campaignStory";
    campaignStory.innerHTML = campaignData[i].story.replace(/\r\n/g, "<br/>");
    campaign.appendChild(campaignStory);

    keyVisualSection.appendChild(campaign);
  };

  // campaign circle toggle
  let campaignStep = document.createElement("div");
  campaignStep.className = "campaignStep";
  for (let i = 0; i < campaignData.length; i++) {
    let campaignCircle = document.createElement("a");
    // add onClick func to campaignCircle
    // assign index i into campaignSlider()
    campaignCircle.setAttribute("onClick", `campaignSlider(${i})`);
    campaignCircle.className = "campaignCircle";
    campaignStep.appendChild(campaignCircle);
    keyVisualSection.appendChild(campaignStep);
  };
  // load the first campaign data on loading
  campaignSlider(0);
  // display next campaign every 10 seconds
  setInterval(campaignSlider, 10000);
};

// onClick function for campaignCicle
const campaignSlider = (index) => {
  let campaign = document.getElementsByClassName("campaign");
  let campaignCircle = document.getElementsByClassName("campaignCircle");
  // initially, remove all 'current' CSS styling
  for (let i = 0; i < 3; i++) {
    campaign[i].classList.remove("current");
    campaignCircle[i].classList.remove("current");
  };
  // check if there's an index 0,1,2 (param passed by onClick action)
  if (index !== undefined) {
    // display campaign image and story
    campaign[index].classList.add("current");
    // indicate current campaignCircle by changing circle color
    campaignCircle[index].classList.add("current");
  } else {
  // if undefined (no click action), then add to the globally defined ind
  // (ind++ % 3) to make endless loop, because campaign.length < 3
    campaign[ind].classList.add("current");
    campaignCircle[ind].classList.add("current");
    ind += 1;
    ind %= 3;
  }
};

/* ==================
Render Products
================== */
// === Product display rendering dynamically (createElement)
function renderProduct(data) {
  let allProducts = document.querySelector(".allProducts");
  let product = data.data;
  
  // pagingURL for scroll event
  if (data.paging !== undefined) {
    pagingURL = `${API_HOST_Products}/${type}?paging=${data.paging}`;
    console.log(pagingURL)
    window.addEventListener("scroll", handleScroll);
  } else {
    pagingURL = "";
    window.removeEventListener("scroll", handleScroll);
  };

  // start creating product from JSON data
  for (let i = 0; i < product.length; i++) {
    let productContainer = document.createElement("a");
    productContainer.setAttribute("class", "productContainer");
    productContainer.setAttribute("href", `product.html?id=${product[i].id}`);
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
  };
};

/* ==================
Scrolling & Paging Feature
================== */
function handleScroll(e) {
    let ticking = false;
    if (!ticking) {
      window.requestAnimationFrame(function() {
        endlessScroll();
        ticking = false;
      });
    }
    ticking = true;
};

// 偵測是不是快滑到最下面
function endlessScroll() {
  let windowHeight = window.innerHeight;
  let remainingFooter = document.querySelector("footer").getBoundingClientRect().top;
    if (remainingFooter - windowHeight < 0) {
      getAjax(pagingURL, setExtProduct);
      console.log(pagingURL)
      window.removeEventListener("scroll", handleScroll);
    }
};

function setExtProduct(data) {
  if (data.paging !== undefined) {
    pageNumber ++;
    // setting data.paging(right) to the global pageNumber(left);
    pageNumber = data.paging;
  }
  window.addEventListener("scroll", handleScroll);
  renderProduct(data);
};

window.addEventListener("scroll", handleScroll);

/* ==================
Shopping Cart
================== */
function updateCartQty() {
  let localStorageCart = getLocalStorage("cart");
    // initialize empty structure into localStorage
    if (localStorageCart === null) {
      setLocalStorage("cart", cartValue);
    } else {
      for (let i = 0; i < cartQty.length; i++) {
        cartQty[i].innerHTML = localStorageCart.order.list.length;
      };
    };
};

/* ==================
Initial Page Loading
================== */
window.addEventListener('load', (event) => {

  // load & display marketing campaign
  getAjax(`${API_HOST}/marketing/campaigns`, renderCampaign);

  // CSS styling for current category
  let activeCatg = document.querySelectorAll(".catg");
  activeCatg.forEach(x=>{
    x.classList.remove("currentCategory");
    if (x.name == tagQuery) {
      x.classList.add("currentCategory");
    }
  });
  // 砍掉重練 remove all products on initial loading
  removeElement("allProducts");

  if (tagQuery == "women" || tagQuery == "men" || tagQuery == "accessories") {
    type = tagQuery;
    getAjax(`${API_HOST_Products}/${tagQuery}`, renderProduct);
  } else {
    getAjax(`${API_HOST_Products}/all`, renderProduct);
  }

});