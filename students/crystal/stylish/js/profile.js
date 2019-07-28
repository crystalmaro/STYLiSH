let userName;
let userEmail;
let userProfPic;
let userAccessToken;

// https://crystalmaro.github.io/Web-Front-End-2019-Summer/students/crystal/stylish/

window.fbAsyncInit = function() {
  FB.init({
    appId      : '{2255951781382943',
    cookie     : true,
    xfbml      : true,
    version    : 'v3.3'
  });
    
//   FB.AppEvents.logPageView();   

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

function statusChangeCallback(response){
  if(response.status == "connected"){
    console.log("logged in and authenticated");
    window.location.href = `profile.html`;
    console.log(response)
    console.log(response.authResponse)
    console.log(response.authResponse.accessToken)
    userAccessToken = response.authResponse.accessToken;
    testAPI();
  } else {
    console.log("not authenticated!!!!");
    console.log(response)
    console.log(response.authResponse)
    console.log(response.authResponse.accessToken)
  }
};

function checkLoginState() {
  
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
    // the response where i gather info

    // don't need to save accessToken into anywhere (localStorage)
    // 1. need to set up what i need from FB (is. access token)
    // 2. use access token to retrieve user info (name, email, pic)
    // use AJAX post 
    // 
    // window.location.href = `profile.html`;
  });
};
 

// for this scenario: API is the object list from FB graph API, that shows user name, email, profile pic 
// need 


function testAPI() {
  FB.api("/me?fields=name,email,picture,profile_pic", function(response){
    if (response && !response.error){
      buildProfile(response);
    };
  });
};

function buildProfile(user) {
  userProfPic = user.profile_pic;
  userName = user.name;
  userEmail = user.email;

  let fbProfPic = document.querySelector(".fbleft img");
  let fbName = document.querySelector(".fbName");
  let fbEmail = document.querySelector(".fbEmail");

  fbProfPic.setAttribute("src", userProfPic);
  fbName.innerHTML = userName;
  fbEmail.innerHTML = userEmail;
  
};