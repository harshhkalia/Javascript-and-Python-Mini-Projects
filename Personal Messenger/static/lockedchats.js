document.addEventListener("DOMContentLoaded", function () {
  let homePage = document.getElementById("home-homeChats");
  homePage.addEventListener("click", function () {
    window.location.href = "/home";
  });

  let searchTextPage = document.getElementById("home-searchChats");
  searchTextPage.addEventListener("click", function () {
    window.location.href = "/searchtext";
  });

  document
    .getElementById("closeSlideContainer")
    .addEventListener("click", function () {
      let hideContainer = document.getElementById("downSlideContainer");
      hideContainer.style.display = "none";

      let setFooter = document.getElementById("homeFooterBackground");
      setFooter.style.top = "-728px";
    });

  let contacts = document.querySelectorAll(".contact");

  let moreOptionsButton = document.createElement("button");
  moreOptionsButton.id = "moreOptionsContacts";
  moreOptionsButton.textContent = "MORE";

  moreOptionsButton.addEventListener("click", function () {
    let showContainer = document.getElementById("downSlideContainer");
    showContainer.style.display = "block";

    let hideContent = document.getElementById("addContactsBackgroundElements");
    hideContent.style.display = "none";

    let hideContainer = document.getElementById("editContactsElements");
    hideContainer.style.display = "none";

    let showContent = document.getElementById("moreOptionsContainer");
    showContent.style.display = "block";

    let getFooter = document.getElementById("homeFooterBackground");
    getFooter.style.top = "-1028px";

    let closeButton = document.getElementById("closeSlideContainer");
    closeButton.style.top = "240px";

    let hideModal = document.getElementById("viewContactElements");
    hideModal.style.display = "none";
  });

  document
    .getElementById("sendDocumentButton")
    .addEventListener("click", function () {
      alert("First select a contact to chat with...");
    });

  document
    .getElementById("sendMessageButton")
    .addEventListener("click", function () {
      alert("First select a contact to chat with...");
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
