let userName;
let userEmail;
let userProfPic;

// // ============== build user profile via Local Storage
// function buildProfile() {
//   alert("buildProfile Local Storage")
//   let localStorageUser = getLocalStorage("user");
//   let fbName = document.querySelector(".fbName");
//   let fbEmail = document.querySelector(".fbEmail");
//   let fbPic = document.querySelector(".fbPic");

//   fbName.innerHTML = localStorageUser.fe.name;
//   fbEmail.innerHTML = localStorageUser.fe.email;
//   fbPic.setAttribute("src", localStorageUser.fe.pic);

// };


// window.addEventListener("load", buildProfile);

// ======================================================
// FACEBOOK 
// ======================================================
// test if gh-pages is updated
alert("updated 04:30pm")


window.fbAsyncInit = function() {
  FB.init({
    appId      : '2255951781382943',
    cookie     : true, 
    version    : 'v3.3'
  });
  alert("PROFILE fbAsyncInit is activated")
  // need to put below func within this window.func
  // otherwise it'd say FB isn't found
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
};


(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


/// status change call back
function statusChangeCallback(response){
  if (response.status === "connected"){
    console.log("PROF_FB is logged in and authenticated");
    console.log(response)
    testAPI();

  } else {
    console.log("not authenticated!!!!");
    console.log(response)
  }
};



// ============== test API response status
function testAPI() {
  alert("PROF_testAPI activated");
  // console.log(response)
  FB.api("/me?fields=name,email,picture.width(500)", function(response){
    if (response && !response.error){
      userName = response.name;
      userEmail = response.email;
      userProfPic = response.picture.data.url;
      alert("PROF_testAPI's FB.api")
      
      buildProfile(response);
    }
  })
};

// ============== build user profile via Global Variables
function buildProfile() {
  alert("buildProfile Global Variables")
  let fbName = document.querySelector(".fbName");
  let fbEmail = document.querySelector(".fbEmail");
  let fbPic = document.querySelector(".fbPic");

  fbName.innerHTML = userName;
  fbEmail.innerHTML = userEmail;
  fbPic.setAttribute("src", userProfPic);
};