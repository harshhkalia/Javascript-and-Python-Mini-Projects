document.addEventListener("DOMContentLoaded", function () {
  let showSignupContainer = document.getElementById("signupRef");
  showSignupContainer.addEventListener("click", function () {
    let hideContainer = document.getElementById("loginElements");
    hideContainer.style.display = "none";

    let showContainer = document.getElementById("signupElements");
    showContainer.style.display = "block";
  });

  let showLoginContainer = document.getElementById("loginRef");
  showLoginContainer.addEventListener("click", function () {
    let hideContainer = document.getElementById("signupElements");
    hideContainer.style.display = "none";

    let showContainer = document.getElementById("loginElements");
    showContainer.style.display = "block";
  });

  let closeLoginContainer = document.getElementById("indexButton1");
  closeLoginContainer.addEventListener("click", function () {
    window.location.href = "/home";
  });

  let closeSignupContainer = document.getElementById("indexButton2");
  closeSignupContainer.addEventListener("click", function () {
    window.location.href = "/home";
  });
});
