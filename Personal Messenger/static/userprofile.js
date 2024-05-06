document.addEventListener("DOMContentLoaded", function () {
  let homePageButton = document.getElementById("home-homeChats");
  homePageButton.addEventListener("click", function () {
    window.location.href = "/home";
  });

  let savedTextButton = document.getElementById("home-searchChats");
  savedTextButton.addEventListener("click", function () {
    window.location.href = "/searchtext";
  });

  let lockedChatsButton = document.getElementById("home-lockedChats");
  lockedChatsButton.addEventListener("click", function () {
    window.location.href = "/initiallockedchatspage";
  });

  let manageMediaPage = document.getElementById("home-manageMedia");
  manageMediaPage.addEventListener("click", function () {
    window.location.href = "/managemedia";
  });

  let savedChatsPage = document.getElementById("home-savedChats");
  savedChatsPage.addEventListener("click", function () {
    window.location.href = "/savedchats";
  });

  fetch("/get_user_info")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error in fetching the details");
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        document.getElementById("userNameHeading").textContent =
          "User Name :  " + data.username;
        document.getElementById("phoneNumberHeading").textContent =
          "Phone Number :  " + data.phone_number;
        document.getElementById("emailHeading").textContent =
          "Email :  " + data.email;
      } else {
        alert("An error occured while fetching details of your account");
      }
    })
    .catch((error) => {
      console.error("Error in fetching the user profile details:", error);
      alert(
        "Something wrong occured in backend. Please ensure your network connection is good"
      );
    });

  document
    .getElementById("editUsername")
    .addEventListener("click", function () {
      let password = prompt("Please enter your password to continue:");
      if (password !== null) {
        let newUsername = prompt("Enter new username:");
        if (newUsername !== null) {
          fetch("/update_username", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              password: password,
              newUsername: newUsername,
            }),
          })
            .then((response) => {
              if (response.status == 401) {
                alert(
                  "The password you entered is incorrect. Please try again!"
                );
              } else if (!response.ok) {
                throw new Error("Error in updating the username");
              } else {
                return response.json();
              }
            })
            .then((data) => {
              if (data.success) {
                alert("Your username is updated successfully!");
                location.reload();
              } else {
                alert(
                  "Something went wrong. Unable to update your username, please try again!"
                );
              }
            })
            .catch((error) => {
              console.error(
                "Error in updating username of this person:",
                error
              );
            });
        }
      }
    });

  document
    .getElementById("editPhonenumber")
    .addEventListener("click", function () {
      let password = prompt("Enter your password to continue:");
      if (password !== null) {
        let newPhonenumber = prompt("Enter new phone number:");
        if (newPhonenumber !== null) {
          fetch("/update_phonenumber", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              password: password,
              newPhonenumber: newPhonenumber,
            }),
          })
            .then((response) => {
              if (response.status == 404) {
                alert(
                  "Incorrect password entered. Please enter the correct password"
                );
              } else if (!response.ok) {
                throw new Error("Error in updating the phone number");
              } else {
                return response.json();
              }
            })
            .then((data) => {
              if (data.success) {
                alert("Your number is updated successfully!");
                location.reload();
              } else {
                alert(
                  "Something went wrong. Unable to update your phone number, please try again"
                );
              }
            })
            .catch((error) => {
              console.error("Error in updating the phone number:", error);
            });
        }
      }
    });

  document.getElementById("editEmail").addEventListener("click", function () {
    let password = prompt("Enter your password to continue:");
    if (password !== null) {
      let newEmail = prompt("Enter new email:");
      if (newEmail !== null) {
        fetch("/update_email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: password,
            newEmail: newEmail,
          }),
        })
          .then((response) => {
            if (response.status == 404) {
              alert(
                "Incorrect password entered. Please enter a correct password and try again"
              );
            } else if (!response.ok) {
              throw new Error("Error in updating email of this user");
            } else {
              return response.json();
            }
          })
          .then((data) => {
            if (data.success) {
              alert("Your email is updated successfully!");
              location.reload();
            } else {
              alert(
                "Something went wrong. Unable to update your phone number, please try again"
              );
            }
          })
          .catch((error) => {
            console.error("Error in updating the email of this user:", error);
          });
      }
    }
  });

  document
    .getElementById("updatePasswordButton")
    .addEventListener("click", function () {
      let password = prompt("Enter your current password to update:");
      if (password !== null) {
        let newPassword = prompt("Enter new password:");
        if (newPassword !== null) {
          fetch("/update_password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              password: password,
              newPassword: newPassword,
            }),
          })
            .then((response) => {
              if (response.status == 404) {
                alert(
                  "You entered an incorrect password. Please enter correct password and try again"
                );
              } else if (!response.ok) {
                throw new Error(
                  "Something went wrong. Unable to change the current password"
                );
              } else {
                return response.json();
              }
            })
            .then((data) => {
              if (data.success) {
                alert(
                  "Your password has been updated. Now you can use your new password"
                );
                location.reload();
              } else {
                alert(
                  "Something went wrong. Unable to update your phone number, please try again"
                );
              }
            })
            .catch((error) => {
              console.error("Error in updating the current password:", error);
            });
        }
      }
    });

  document
    .getElementById("deleteAccountButton")
    .addEventListener("click", function () {
      let password = prompt("Enter your password to continue:");
      if (password !== null) {
        let deleteAccount = confirm(
          "Are you sure you want to delete this account? This action cannot be redone:"
        );
        if (deleteAccount) {
          fetch("/delete_account", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              password: password,
            }),
          })
            .then((response) => {
              if (response.status == 400) {
                alert(
                  "Incorrect password entered. Unable to delete the account, please try again"
                );
              } else if (!response.ok) {
                throw new Error("Error in deleting this account");
              } else {
                return response.json();
              }
            })
            .then((data) => {
              if (data.success) {
                alert("Your account has been deleted!");
                window.location.href = "/";
              }
            })
            .catch((error) => {
              console.error(
                "Error in deleting the account of this user:",
                error
              );
            });
        }
      }
    });

  let settingsMsg = document.getElementById("showSettings");
  settingsMsg.addEventListener("click", function () {
    alert("More settings yet to come (stay tuned)");
  });

  document.getElementById("closeApp").addEventListener("click", function () {
    let confirmation = confirm("Are you sure you want to close this app ?");
    if (confirmation) {
      window.close();
    }
  });

  //This function is not working I don't know why even though on other pages it's working perfectly
  // fetch("/get_username")
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error("Something went wrong in backend");
  //     }
  //     return response.json();
  //   })
  //   .then((data) => {
  //     let username = data.username;

  //     let updateHeading = document.getElementById("extraHeading1");
  //     updateHeading.textContent = `GOODBYE, ${username}`;
  //   })
  //   .catch((error) => {
  //     console.error("Error in updating the defined heading:", error);
  //   });
});
