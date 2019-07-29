let fbName = document.querySelector(".fbName");
let fbEmail = document.querySelector(".fbEmail");
let fbPic = document.querySelector(".fbPic");

// ============== build user profile
function buildProfile() {
  alert("buildProfile activated")

  console.log(userName)
  console.log(userEmail)
  console.log(userProfPic)
  // let fbStorage = getLocalStorage("fbUser")

  fbName.innerHTML = userName;
  fbEmail.innerHTML = userEmail;
  fbPic.setAttribute("src", userProfPic);

  // window.location.href = "./profile.html";
};

window.addEventListener("load", buildProfile);