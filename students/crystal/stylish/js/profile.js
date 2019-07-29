

// ============== build user profile
function buildProfile() {
  alert("buildProfile activated")

  // let fbStorage = getLocalStorage("fbUser")
  let fbProfPic = document.querySelector(".fbleft img");
  let fbName = document.querySelector(".fbName");
  let fbEmail = document.querySelector(".fbEmail");

  fbProfPic.setAttribute("src", userProfPic);
  fbName.innerHTML = userName;
  fbEmail.innerHTML = userEmail;

  // window.location.href = "./profile.html";
};


window.addEventListener("load", function(){
  buildProfile();
})