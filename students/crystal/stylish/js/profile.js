let fbName = document.querySelector(".fbName");
let fbEmail = document.querySelector(".fbEmail");
let fbPic = document.querySelector(".fbPic");

// ============== build user profile
function buildProfile() {
  alert("buildProfile activated")
  let localStorageUser = getLocalStorage("user");

  fbName.innerHTML = localStorageUser.fe.name;
  fbEmail.innerHTML = localStorageUser.fe.email;
  fbPic.setAttribute("src", localStorageUser.fe.pic);

  // window.location.href = "./profile.html";
};

window.addEventListener("load", buildProfile);
