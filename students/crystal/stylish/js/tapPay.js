
// ======================= 設置好等等 GetPrime 所需要的金鑰
// Setup SDK (software development kit)
const tap = {
    APP_ID: 12348,
    APP_KEY: "app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF",
    serverType: "sandbox"
};
TPDirect.setupSDK(tap.APP_ID, tap.APP_KEY, tap.serverType);

// 把 TapPay 內建輸入卡號的表單給植入到 div 中
TPDirect.card.setup({
    fields: {
        number: {
            // css selector
            element: '#card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            // DOM object
            element: document.getElementById('card-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: '#card-ccv',
            placeholder: 'ccv'
        }
    },
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.cvc': {
            // 'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            // 'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            // 'font-size': '16px'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
});

// ======================= onUpdate

TPDirect.card.onUpdate(function (update) {
    // update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    if (update.canGetPrime) {
        // Enable submit Button to get prime.
        // submitButton.removeAttribute('disabled')
    } else {
        // Disable submit Button to get prime.
        // submitButton.setAttribute('disabled', true)
    }

    // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unknown']
    if (update.cardType === 'visa') {
        // Handle card type visa.
    }

    // number fields is error
    if (update.status.number === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.number === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.expiry === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.expiry === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.cvc === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.cvc === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }
});

// ======================= getTappay Fields Status
TPDirect.card.getTappayFieldsStatus();

// ======================= get Prime
// call TPDirect.card.getPrime when user submit form to get tappay prime

function checkoutInput(){
    let isValid = true;
    let inputFields = document.querySelectorAll(".checkoutInput");
    for(let i = 0; i < inputFields.length; i++){
      if(inputFields[i].value == ""){
        isValid = false;
      } 
    } 
    if (isValid == false){
        alert("Please enter all user info.")
    }
};

function getPrime(){
    let localStorageCart = getLocalStorage("cart");
    checkoutInput();
    // return new Promise((resolve, reject) => {
        event.preventDefault();

        // Get TapPay Fields  status
        const tappayStatus = TPDirect.card.getTappayFieldsStatus()

        // Check can getPrime
        if (tappayStatus.canGetPrime === false) {
            alert('can not get prime')
            return
        }

        // Get prime
        TPDirect.card.getPrime((result) => {
            if (result.status !== 0) {
                alert('get prime error ' + result.msg)
                return
            }
            
            // resolve(console.log(localStorageCart.prime));
            alert('get prime success, prime: ' + result.card.prime)
            localStorageCart.prime = result.card.prime;
            setLocalStorage("cart", localStorageCart);
            updateUserInput();
            // send prime to your server, to pay with Pay by Prime API .
            // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
        })
    // })
};

function updateUserInput(){
  let localStorageCart = getLocalStorage("cart");
  let buyerName = document.querySelector(".buyerName");
  let buyerEmail = document.querySelector(".buyerEmail");
  let buyerPhone = document.querySelector(".buyerPhone");
  let buyerAddress = document.querySelector(".buyerAddress");
  
  localStorageCart.order.recipient.name = buyerName.value;
  localStorageCart.order.recipient.email = buyerEmail.value;
  localStorageCart.order.recipient.phone = buyerPhone.value;
  localStorageCart.order.recipient.address = buyerAddress.value;
  setLocalStorage("cart", localStorageCart);
};