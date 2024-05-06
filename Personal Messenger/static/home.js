document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("openSlideContainer")
    .addEventListener("click", function () {
      alert("Please enter the details here:");
      let showContainer = document.getElementById("downSlideContainer");
      showContainer.style.display = "block";

      let showContent = document.getElementById(
        "addContactsBackgroundElements"
      );
      showContent.style.display = "block";

      let hideContent = document.getElementById("moreOptionsContainer");
      hideContent.style.display = "none";

      let hideContainer = document.getElementById("editContactsElements");
      hideContainer.style.display = "none";

      let setFooter = document.getElementById("homeFooterBackground");
      setFooter.style.top = "-1028px";

      let hideModal = document.getElementById("viewContactElements");
      hideModal.style.display = "none";
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

  contacts.forEach(function (contact) {
    contact.addEventListener("click", function () {
      let contactName = this.textContent.trim();

      sessionStorage.setItem("selectedContactName", contactName);

      fetch("/get_current_contact_info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedContactName: contactName,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            return new Error("Error fetching the contact information");
          }
          return response.json();
        })
        .then((data) => {
          let theContainer = document.getElementById("chatsUpperBarBackground");
          theContainer.innerHTML =
            "<span class='contact-class'>" + contactName + "</span>";

          let contactNumber = data.contactNumber;
          let contactNumberElement = document.createElement("span");
          contactNumberElement.textContent =
            "CURRENT NUMBER OF USER: " + contactNumber;
          contactNumberElement.classList.add("currentNumberHeading");

          let contactNameElement = document.createElement("span");
          contactNameElement.textContent =
            "CURRENT NAME OF USER:  " + data.contactName;
          contactNameElement.classList.add("currentNameHeading");

          moreOptionsButton.style.display = "block";
          theContainer.appendChild(moreOptionsButton);

          let hideContainer = document.getElementById("downSlideContainer");
          let footer = document.getElementById("homeFooterBackground");

          let showContactDetails = document.getElementById(
            "editContactsBackgroundContainer"
          );
          showContactDetails.appendChild(contactNumberElement);
          showContactDetails.appendChild(contactNameElement);

          if (hideContainer) {
            hideContainer.style.display = "none";
            footer.style.top = "-728px";
          }
        })
        .catch((error) => {
          console.error("Error fetching the contact details:", error);
        });
      let hideModal = document.getElementById("viewContactElements");
      hideModal.style.display = "none";

      let clearChat = document.getElementById("chatsAreaBackground");
      clearChat.innerHTML = "";
    });
  });

  let editContactButton = document.getElementById("editContactButton");
  editContactButton.addEventListener("click", function () {
    let hideContent = document.getElementById("moreOptionsContainer");
    hideContent.style.display = "none";

    let hideModal = document.getElementById("viewContactElements");
    hideModal.style.display = "none";

    let showContainer = document.getElementById("editContactsElements");
    showContainer.style.display = "block";
  });

  let editContactsForm = document.getElementById("editContactsForm");
  editContactsForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let originalName = prompt("Enter current name of this user to continue:");

    if (!originalName) {
      return alert(
        "Name does not edited. Try again and input name of the user..."
      );
    }

    let editedNumber = document.getElementById("editNumberInput").value;
    let editedName = document.getElementById("editNameInput").value;

    document.getElementById("originalNameInput").value = originalName;

    fetch("/edit_contact", {
      method: "POST",
      body: new URLSearchParams({
        editNumber: editedNumber,
        editName: editedName,
        originalName: originalName,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("This contact has been edited!");
          window.location.href = "/home";
        } else if (response.status === 404) {
          alert(
            "Incorrect username entered. Please try again with correct username..."
          );
        } else {
          alert("Unable to edit this contact. Please try again...");
          console.error("Failed to edit the contact.");
        }
      })
      .catch((error) => {
        console.error("Error editing the contact:", error);
      });
  });

  let viewContactsModal = document.getElementById("viewContactButton");
  viewContactsModal.addEventListener("click", function () {
    let showModal = document.getElementById("viewContactElements");
    showModal.style.display = "block";

    let hideContainer = document.getElementById("downSlideContainer");
    hideContainer.style.display = "none";

    let getFooter = document.getElementById("homeFooterBackground");
    getFooter.style.top = "-1082px";

    let selectedContactName = sessionStorage.getItem("selectedContactName");

    if (selectedContactName) {
      fetch("/get_current_contact_info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedContactName: selectedContactName,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Something wrong occured in backend");
          }
          return response.json();
        })
        .then((data) => {
          let contactNumber = data.contactNumber;
          let contactNumberElement = document.createElement("span");
          contactNumberElement.textContent =
            "THE NUMBER OF THIS USER IS: " + contactNumber;
          contactNumberElement.classList.add("contactDetailsNumber");
          showModal.appendChild(contactNumberElement);

          let contactNameElement = document.createElement("span");
          contactNameElement.textContent =
            "THE NAME OF THIS USER IS: " + data.contactName;
          contactNameElement.classList.add("contactDetailsName");
          showModal.appendChild(contactNameElement);
        })
        .catch((error) => {
          console.error("Error fetching the contact details:", error);
        });
    } else {
      console.error("No contact selected.");
    }
  });

  let closeContactModal = document.getElementById("closeContactContainer");
  closeContactModal.addEventListener("click", function () {
    let hideModal = document.getElementById("viewContactElements");
    hideModal.style.display = "none";

    let getFooter = document.getElementById("homeFooterBackground");
    getFooter.style.top = "-728px";

    alert("Refreshing this page for better experience...");
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

      let updateHeading = document.getElementById("extraHeading1");
      updateHeading.textContent = `GOODBYE, ${username}`;

      let showBlockedAlert = document.getElementById("blockContactButton");
      showBlockedAlert.addEventListener("click", function () {
        let selectedContactName = sessionStorage.getItem("selectedContactName");

        alert(
          `Something went wrong. Sorry ${username}, we can't block ${selectedContactName}`
        );
      });
    })
    .catch((error) => {
      console.error("Error showing the alert of block contact:", error);
    });

  document
    .getElementById("sendMessageButton")
    .addEventListener("click", function () {
      let messageInput = document.getElementById("messageInput").value;
      let contactName = sessionStorage.getItem("selectedContactName");

      if (messageInput.trim() !== "" && contactName) {
        fetch("/get_contact_id", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contactName: contactName,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              return new Error(
                "Something went wrong while fetching reciever ID"
              );
            }
            return response.json();
          })
          .then((data) => {
            sendMessage(data.contactId, messageInput);
          })
          .catch((error) => {
            console.error("Error fetching the reciever's ID:", error);
          });
      } else {
        console.error("No message typed or No contact selected!");
      }

      function sendMessage(contactId, message) {
        fetch("/send_message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contact_id: contactId,
            message: message,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              return new Error(
                "Something went wrong while sending the message"
              );
            }
            return response.json();
          })
          .then((data) => {
            displayMessage(message);
          })
          .catch((error) => {
            console.error("Error in sending the message:", error);
          });
      }

      function fetchAndDisplayMessages(contactName) {
        fetch("/fetch_messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contactName: contactName,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              return new Error(
                "Something went wrong while fetching the messages"
              );
            }
            return response.json();
          })
          .then((data) => {
            data.messages.forEach((message) => {
              displayMessage(message);
            });
          })
          .catch((error) => {
            console.error("Error in fetching message from backend:", error);
          });
      }

      window.addEventListener("load", function () {
        let contactName = sessionStorage.getItem("selectedContactName");
        if (contactName) {
          fetchAndDisplayMessages(contactName);
        }
      });

      function displayMessage(message) {
        let chatsArea = document.getElementById("chatsAreaBackground");
        chatsArea.style.overflowY = "auto";
        let messageElement = document.createElement("div");
        messageElement.textContent = message;
        messageElement.classList.add("newMessage");
        chatsArea.appendChild(messageElement);

        chatsArea.scrollTop = chatsArea.scrollHeight;
      }
    });

  document
    .getElementById("sendDocumentButton")
    .addEventListener("click", function () {
      document.getElementById("fileInput").click();
    });

  document
    .getElementById("fileInput")
    .addEventListener("click", function (event) {
      let file = event.target.files[0];
      if (file) {
        displayPhoto(file);
      }

      function displayPhoto(file) {
        let chatsArea = document.getElementById("chatsAreaBackground");
        chatsArea.style.overflowY = "auto";
        let photoElement = document.createElement("img");
        photoElement.src = URL.createObjectURL(file);
        photoElement.classList.add("newPhoto");
        chatsArea.appendChild(photoElement);

        chatsArea.scrollTop = chatsArea.scrollHeight;
      }
    });

  let openContactsEditor = document.getElementById("editContactSecondButton");
  openContactsEditor.addEventListener("click", function () {
    let openContainer = document.getElementById("editContactsElements");
    openContainer.style.display = "block";

    let showSlider = document.getElementById("downSlideContainer");
    showSlider.style.display = "block";

    let hideContent = document.getElementById("moreOptionsContainer");
    hideContent.style.display = "none";

    let getFooter = document.getElementById("homeFooterBackground");
    getFooter.style.top = "-1028px";

    let hideContainer = document.getElementById("viewContactElements");
    hideContainer.style.display = "none";
  });

  let refMeToSearchPage = document.getElementById("home-searchChats");
  refMeToSearchPage.addEventListener("click", function () {
    window.location.href = "/searchtext";
  });

  let lockedChats = document.getElementById("home-lockedChats");
  lockedChats.addEventListener("click", function () {
    window.location.href = "/initiallockedchatspage";
  });

  let lockChatsButton = document.getElementById("lockContactButton");
  lockChatsButton.addEventListener("click", function () {
    let selectedContact = sessionStorage.getItem("selectedContactName");

    let contacts = document.querySelectorAll(".contact");

    contacts.forEach(function (contactElement) {
      if (contactElement.textContent.trim() === selectedContact) {
        contactElement.parentNode.removeChild(contactElement);

        alert(
          "This contact has been locked. You can access this chat with your security PIN."
        );

        let hideContainer = document.getElementById("downSlideContainer");
        hideContainer.style.display = "none";

        let setFooter = document.getElementById("homeFooterBackground");
        setFooter.style.top = "-728px";

        let removeContent = document.getElementById("chatsUpperBarBackground");
        removeContent.innerHTML = "";

        let lockedChatsBackgroundContainer = document.getElementById(
          "lockedChatsBackground"
        );

        let newContactElement = document.createElement("div");
        newContactElement.textContent = selectedContact;
        newContactElement.classList.add("contact");
        lockedChatsBackgroundContainer.appendChild(newContactElement);
      }
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

  document.getElementById("closeApp").addEventListener("click", function () {
    let confirmation = confirm("Are you sure you want to close this app ?");
    if (confirmation) {
      window.close();
    }
  });
});
