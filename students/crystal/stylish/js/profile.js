

// ============== build user profile
function buildProfile() {
  alert("buildProfile activated")

  // let fbStorage = getLocalStorage("fbUser")
  let fbName = document.querySelector(".fbName");
  let fbEmail = document.querySelector(".fbEmail");
  let fbProfPic = document.querySelector(".fbleft img");

  fbName.innerHTML = userName;
  fbEmail.innerHTML = userEmail;
  fbProfPic.setAttribute("src", userProfPic);

  // window.location.href = "./profile.html";
};


window.addEventListener("load", buildProfile);