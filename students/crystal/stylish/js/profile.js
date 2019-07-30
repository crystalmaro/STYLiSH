let userName;
let userEmail;
let userProfPic;

window.fbAsyncInit = function() {
  FB.init({
    appId      : '2255951781382943',
    cookie     : true, 
    version    : 'v3.3'
  });

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
  }
};



// ============== test API response status
function testAPI() {
  FB.api("/me?fields=name,email,picture.width(500)", function(response){
    if (response && !response.error){
      userName = response.name;
      userEmail = response.email;
      userProfPic = response.picture.data.url;
      buildProfile(response);
    }
  })
};

// ============== build user profile via Global Variables
function buildProfile() {
  let fbName = document.querySelector(".fbName");
  let fbEmail = document.querySelector(".fbEmail");
  let fbPic = document.querySelector(".fbPic");

  fbName.innerHTML = userName;
  fbEmail.innerHTML = userEmail;
  fbPic.setAttribute("src", userProfPic);
};