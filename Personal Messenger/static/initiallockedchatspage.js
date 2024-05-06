document.addEventListener("DOMContentLoaded", function () {
  let homeButton = document.getElementById("home-homeChats");
  homeButton.addEventListener("click", function () {
    window.location.href = "/home";
  });

  let searchTextButton = document.getElementById("home-searchChats");
  searchTextButton.addEventListener("click", function () {
    window.location.href = "/searchtext";
  });

  let newAccountButton = document.getElementById("newLockedChatsAccountLink");
  newAccountButton.addEventListener("click", function () {
    let hideContainer = document.getElementById(
      "lockedChatsAlreadyAccountContainer"
    );
    hideContainer.style.display = "none";

    let hideContainer2 = document.getElementById("forgetPinContainer");
    hideContainer2.style.display = "none";

    let showContainer = document.getElementById(
      "lockedChatsNewAccountContainer"
    );
    showContainer.style.display = "block";

    let getFooter = document.getElementById("homeFooterBackground");
    getFooter.style.top = "369px";
  });

  let previousAccountButton = document.getElementById(
    "alreadyLockedChatsAccountLink"
  );
  previousAccountButton.addEventListener("click", function () {
    let hideContainer = document.getElementById(
      "lockedChatsNewAccountContainer"
    );
    hideContainer.style.display = "none";

    let hideContainer2 = document.getElementById("forgetPinContainer");
    hideContainer2.style.display = "none";

    let showContainer = document.getElementById(
      "lockedChatsAlreadyAccountContainer"
    );
    showContainer.style.display = "block";

    let getFooter = document.getElementById("homeFooterBackground");
    getFooter.style.top = "399px";
  });

  let forgetContainerButton = document.getElementById("forgetPin");
  forgetContainerButton.addEventListener("click", function () {
    alert("Enter the required details to update the PIN");

    let showContainer = document.getElementById("forgetPinContainer");
    showContainer.style.display = "block";

    let hideContainer = document.getElementById(
      "lockedChatsAlreadyAccountContainer"
    );
    hideContainer.style.display = "none";

    let hideContainer2 = document.getElementById(
      "lockedChatsNewAccountContainer"
    );
    hideContainer2.style.display = "none";

    let getFooter = document.getElementById("homeFooterBackground");
    getFooter.style.top = "449px";
  });

  let cancelForgetButton = document.getElementById("cancelForgetPinButton");
  cancelForgetButton.addEventListener("click", function () {
    let hideContainer = document.getElementById("forgetPinContainer");
    hideContainer.style.display = "none";

    let showContainer = document.getElementById(
      "lockedChatsAlreadyAccountContainer"
    );
    showContainer.style.display = "block";

    let getFooter = document.getElementById("homeFooterBackground");
    getFooter.style.top = "399px";
  });

  let setUpButton = document.getElementById("createAccountPin");
  setUpButton.addEventListener("click", function () {
    let newPin = document.getElementById("newAccountPinInput").value;
    let confirmPin = document.getElementById("confirmAccountPinInput").value;

    if (newPin != confirmPin) {
      return alert("PIN does not match. Please add correct PIN and try again");
    } else {
      fetch("/new_pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          new_pin: newPin,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status == 414) {
              alert(
                "You already have an existing PIN in your account. First remove it to add a new one!"
              );
              window.location.href = "/initiallockedchatspage";
              return Promise.reject("PIN aleady exists");
            } else {
              return new Error("Error in adding new locked PIN to account");
            }
          }
          return response.json();
        })
        .then((data) => {
          alert("Your new PIN has been set-up successfully!");
          window.location.href = "/initiallockedchatspage";
        })
        .catch((error) => {
          if (error.message !== "PIN already exists") {
            console.error("Error in setting up new PIN to account:", error);
            window.location.href = "/initiallockedchatspage";
          } else {
            console.error("Error in setting up new PIN to account:", error);
            alert("Failed to set-up this PIN");
            window.location.href = "/initiallockedchatspage";
          }
        });
    }
  });

  let updatePinButton = document.getElementById("checkDetailsButton");
  updatePinButton.addEventListener("click", function () {
    let mobileNumber = document.getElementById("mobileNumberInput").value;
    let userName = document.getElementById("userNameInput").value;

    fetch("/forget_pin", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        mobilenumber: mobileNumber,
        username: userName,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status == 500) {
            alert("Incorrect details entered. Please enter correct details");
            window.location.href = "/initiallockedchatspage";
          } else {
            throw new Error("Error in fetching the details of your account");
          }
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          let user_id = data.user_id;
          let newPin = prompt("Please enter your new PIN:");

          fetch("/update_pin", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              user_id: user_id,
              newPin: newPin,
            }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Error in updating the PIN of your account");
              }
              return response.json();
            })
            .then((data) => {
              alert(
                "Your PIN is updated. Now you can access your chats with this new PIN"
              );
              window.location.href = "/initiallockedchatspage";
            })
            .catch((error) => {
              console.error("Error updating the PIN of your account:", error);
            });
          window.location.href = "/initiallockedchatspage";
        } else {
          alert("Incorrect details entered. Please enter correct details");
          console.error("Failed to update the PIN of your account");
          window.location.href = "/initiallockedchatspage";
        }
      })
      .catch((error) => {
        console.error("Error in fetching the requested details:", error);
        window.location.href = "/initiallockedchatspage";
      });
  });

  let lockedChatsButton = document.getElementById("checkAlreadyAccountPin");
  lockedChatsButton.addEventListener("click", function () {
    let enteredPin = document.getElementById("alreadyAccountPinInput").value;

    fetch("/check_pin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        enteredPin: enteredPin,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return new Error("Error in checking the entered pin");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          window.location.href = "/lockedchats";
          alert("Redirecting to the chats...");
        } else {
          alert("Entered PIN is incorrect. Please enter a correct one");
          window.location.href = "/initiallockedchatspage";
        }
      })
      .catch((error) => {
        console.error("Error in checking the entered PIN:", error);
      });
  });

  let mediaPage = document.getElementById("home-manageMedia");
  mediaPage.addEventListener("click", function () {
    window.location.href = "/managemedia";
  });

  let savedChatsPage = document.getElementById("home-savedChats");
  savedChatsPage.addEventListener("click", function () {
    window.location.href = "/savedchats";
  });

  let userProfilePage = document.getElementById("home-showProfile");
  userProfilePage.addEventListener("click", function () {
    window.location.href = "/userprofile";
  });

  let settingsMsg = document.getElementById("showSettings");
  settingsMsg.addEventListener("click", function () {
    alert("More settings yet to come (stay tuned)");
  });

  fetch("/get_username")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Something went wrong in backend");
      }
      return response.json();
    })
    .then((data) => {
      let username = data.username;

      let updateHeading = document.getElementById("extraHeading1");
      updateHeading.textContent = `GOODBYE, ${username}`;
    })
    .catch((error) => {
      console.error("Error in updating the defined heading:", error);
    });

  document.getElementById("closeApp").addEventListener("click", function () {
    let confirmation = confirm("Are you sure you want to close this app ?");
    if (confirmation) {
      window.close();
    }
  });
});
