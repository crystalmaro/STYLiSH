
// https://crystalmaro.github.io/Web-Front-End-2019-Summer/students/crystal/stylish/

window.fbAsyncInit = function() {
  FB.init({
    appId      : '2255951781382943',
    cookie     : true, 
    version    : 'v3.3'
  });
  // FB.AppEvents.logPageView();   

//   alert("LIB fbAsyncInit is activated")

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
    console.log("LIB_FB is logged in and authenticated");
    console.log(response)
    
    let localStorageUser = getLocalStorage("user");
    localStorageUser.be.access_token = response.authResponse.accessToken;
    setLocalStorage("user", localStorageUser);
    
  } else {
    console.log("not authenticated!!!!");
    console.log(response)
  }
};

// onLogin() on the hidden fb button
function checkLoginState() {
  // localStorage.clear("user");
//   alert("checking login status");
  FB.getLoginStatus(function(response) {
    // alert("getting login status");
    statusChangeCallback(response);
    
    if(response.status === "connected"){
        redirectToProfile();
    }

  });
};


// ============= redirect to profile page if logged in
function redirectToProfile(){
  window.location.href = "./profile.html";
}
