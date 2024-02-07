function showSignup() {
  document.getElementById("signup-container").style.display = "block";
}

function showLogin() {
  document.getElementById("signup-container").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  let signupForm = document.getElementById("signup-form");

  signupForm.addEventListener("submit", function (event) {
    let password = document.getElementById("passwordBox").value;
    let confirmedPassword = document.getElementById("passBox").value;

    if (password !== confirmedPassword) {
      alert("Passwords do not match. Please re-enter");
      event.preventDefault();
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  let userEmailInput = document.getElementById("userEmailBox");

  userEmailInput.addEventListener("blur", function () {
    let email = userEmailInput.value;
    let emailRegax = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegax.test(email)) {
      alert("Please enter a valid email address.");
      userEmailInput.value = "";
    }
  });
});
