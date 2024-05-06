document.addEventListener("DOMContentLoaded", function () {
  let goHome = document.getElementById("home-homeChats");
  goHome.addEventListener("click", function () {
    window.location.href = "/home";
  });

  let lockedChats = document.getElementById("home-lockedChats");
  lockedChats.addEventListener("click", function () {
    window.location.href = "/initiallockedchatspage";
  });

  let closeSearchContainer = document.getElementById("closeSearchContainer");
  closeSearchContainer.addEventListener("click", function () {
    alert("Redirecting you back to home tab...");
    window.location.href = "/home";
  });

  fetch("/get_username")
    .then((response) => {
      if (!response.ok) {
        return new Error("Something went wrong while fetching the username");
      }
      return response.json();
    })
    .then((data) => {
      let username = data.username;

      let showQuery = document.getElementById("searchTextQuery");
      showQuery.addEventListener("click", function () {
        alert(`Hello ${username}, please read "NOTE" in container below...`);
        window.location.href = "/searchtext";
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
