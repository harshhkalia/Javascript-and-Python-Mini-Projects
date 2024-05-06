document
  .getElementById("signUpContainerLink")
  .addEventListener("click", function () {
    let hideContainer = document.getElementById("loginContainer");
    hideContainer.style.display = "none";

    let showContainer = document.getElementById("signupContainer");
    showContainer.style.display = "block";

    let getFooter = document.getElementById("footer-background");
    getFooter.style.top = "170px";
  });

document
  .getElementById("loginContainerLink")
  .addEventListener("click", function () {
    let hideContainer = document.getElementById("signupContainer");
    hideContainer.style.display = "none";

    let showContainer = document.getElementById("loginContainer");
    showContainer.style.display = "block";

    let getFooter = document.getElementById("footer-background");
    getFooter.style.top = "295px";
  });

let settingsMsg = document.getElementById("showSettings");
settingsMsg.addEventListener("click", function () {
  alert("First login to use settings");
});

document.getElementById("closeApp").addEventListener("click", function () {
  let confirmation = confirm("Are you sure you want to close this app ?");
  if (confirmation) {
    window.close();
  }
});
