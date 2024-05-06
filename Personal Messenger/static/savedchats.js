document.addEventListener("DOMContentLoaded", function () {
  let homeButton = document.getElementById("home-homeChats");
  homeButton.addEventListener("click", function () {
    window.location.href = "/home";
  });

  let searchTextButton = document.getElementById("home-searchChats");
  searchTextButton.addEventListener("click", function () {
    window.location.href = "/searchtext";
  });

  let lockedChatsButton = document.getElementById("home-lockedChats");
  lockedChatsButton.addEventListener("click", function () {
    window.location.href = "/initiallockedchatspage";
  });

  let manageMediaButton = document.getElementById("home-manageMedia");
  manageMediaButton.addEventListener("click", function () {
    window.location.href = "/managemedia";
  });

  let searchButton = document.getElementById("searchChatButton");
  searchButton.addEventListener("click", function () {
    alert("ROUSTUF is not saving any of your texts and chats");
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
