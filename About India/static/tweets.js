document.addEventListener("DOMContentLoaded", function () {
  let homePageButton = document.getElementById("homeButton");
  homePageButton.addEventListener("click", function () {
    window.location.href = "/home";
  });

  const postButton = document.getElementById("postTweet");
  postButton.addEventListener("click", function () {
    const textToAdd = document.getElementById("tweetText").value;
    if (textToAdd.trim() === "") {
      alert("Please add a tweet to post it.");
      return null;
    }

    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");

    fetch("/post_tweets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tweet_text: textToAdd,
        email: email,
        password: password,
      }),
    })
      .then((response) => {
        if (response.status === 401) {
          alert(
            "Incorrect email or password entered. Please enter correct one again"
          );
          return null;
        } else {
          return response.json();
        }
      })
      .then((data) => {
        alert(data.message);
        document.getElementById("tweetText").value = "";
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        console.error("Error occurred while posting the tweet:", error);
        alert("Failed to post tweet. Please try again later.");
      });
  });

  const tweetsDisplayContainer = document.getElementById(
    "tweetsUploadedContainer"
  );

  fetch("/get_tweets", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const tweets = data.tweets;
      tweets.forEach((tweet) => {
        const tweetBackground = document.createElement("div");
        tweetBackground.classList.add("tweet");

        const usernameElement = document.createElement("span");
        usernameElement.classList.add("username");
        usernameElement.textContent = `Posted by ${tweet.username}`;

        const tweettextElement = document.createElement("p");
        tweettextElement.classList.add("text");
        tweettextElement.textContent = tweet.text;

        const likesElement = document.createElement("span");
        likesElement.classList.add("likes");
        likesElement.textContent = `Likes: ${tweet.likes}`;

        const likeButton = document.createElement("button");
        likeButton.textContent = "LIKE";
        likeButton.classList.add("likeButton");
        likeButton.addEventListener("click", () => liketweet(tweet.id));

        const reportButton = document.createElement("button");
        reportButton.textContent = "REPORT";
        reportButton.classList.add("reportButton");
        reportButton.addEventListener("click", () => reportTweet(tweet.id));

        const dateElement = document.createElement("span");
        dateElement.classList.add("date");
        dateElement.textContent = `Added on ${tweet.date}`;

        tweetBackground.appendChild(usernameElement);
        tweetBackground.appendChild(tweettextElement);
        tweetBackground.appendChild(likesElement);
        tweetBackground.appendChild(likeButton);
        tweetBackground.appendChild(reportButton);
        tweetBackground.appendChild(dateElement);

        tweetsDisplayContainer.appendChild(tweetBackground);
      });
    })
    .catch((error) => {
      console.error("Error in fetching the tweets of users:", error);
      alert(
        "Something went wrong, you may not get to see users tweets currently on this page."
      );
    });

  function liketweet(reviewId) {
    fetch(`/like_tweet/${reviewId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          alert("There is an issue with your network. Please fix it first");
        }
      })
      .then((data) => {
        alert("You liked one tweet!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        console.error("Error in liking this tweet:", error);
        alert("Failed to like this comment, please try again");
      });
  }

  function reportTweet(reviewId) {
    const additionalText = prompt(
      "Enter additional text for reporting this tweet:"
    );
    if (additionalText.trim() === "") {
      alert("Please provide a reason for reporting this tweet.");
      return;
    }

    fetch(`/report_tweet/${reviewId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ additionalText: additionalText }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Thanks for your feedback, tweet reported successfully!");
        } else {
          alert("Failed to report tweet. Please try again later.");
        }
      })
      .catch((error) => {
        console.error("Error in reporting this tweet:", error);
        alert("Failed to report tweet. Please try again later.");
      });
  }

  const getMyTweetsButton = document.getElementById("profileButton");
  getMyTweetsButton.addEventListener("click", function () {
    fetch("/get_user_tweets", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        tweetsDisplayContainer.innerHTML = "";
        const tweets = data.tweets;
        tweets.forEach((tweet) => {
          const textHeading = document.createElement("h3");
          textHeading.textContent = "Your tweet";
          textHeading.id = "tweetHeading";

          const tweetBackground = document.createElement("div");
          tweetBackground.classList.add("tweet");

          const usernameElement = document.createElement("span");
          usernameElement.classList.add("yourUsername");
          usernameElement.textContent = `Posted by you`;

          const tweettextElement = document.createElement("p");
          tweettextElement.classList.add("text");
          tweettextElement.textContent = tweet.text;

          const likesElement = document.createElement("span");
          likesElement.classList.add("likes");
          likesElement.textContent = `Likes: ${tweet.likes}`;

          const dateElement = document.createElement("span");
          dateElement.classList.add("date");
          dateElement.textContent = `Added on ${tweet.date}`;

          const editTweetButton = document.createElement("button");
          editTweetButton.textContent = "EDIT";
          editTweetButton.classList.add("editButton");
          editTweetButton.addEventListener("click", () => {
            const newText = prompt("Enter the new tweet:");
            if (newText !== null && newText.trim() !== "") {
              fetch(`/edit_tweet/${tweet.review_id}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: newText }),
              })
                .then((response) => response.json())
                .then((data) => {
                  alert(
                    "Tweet edited successfully, comeback again and see your edited tweet!"
                  );
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                })
                .catch((error) => {
                  console.error("Error in updating the tweet:", error);
                  alert("Failed to edit the tweet, please try again");
                });
            }
          });

          const deleteTweetButton = document.createElement("button");
          deleteTweetButton.textContent = "DELETE";
          deleteTweetButton.classList.add("deleteButton");
          deleteTweetButton.addEventListener("click", () => {
            if (
              confirm("Are you sure you want to delete this tweet forever?")
            ) {
              fetch(`/delete_tweet/${tweet.review_id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  alert(
                    "Tweet deleted successfully. Now you won't see it here"
                  );
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                })
                .catch((error) => {
                  console.error("Error in deleting the selected tweet:", error);
                  alert("Failed to delete the tweet. Please try again later");
                });
            }
          });

          tweetBackground.appendChild(usernameElement);
          tweetBackground.appendChild(tweettextElement);
          tweetBackground.appendChild(likesElement);
          tweetBackground.appendChild(editTweetButton);
          tweetBackground.appendChild(deleteTweetButton);
          tweetBackground.appendChild(dateElement);

          tweetsDisplayContainer.appendChild(textHeading);
          tweetsDisplayContainer.appendChild(tweetBackground);
        });
      })
      .catch((error) => {
        console.error("Error in fetching the personal tweets of user:", error);
        alert(
          "Something went wrong, we are unable to get your tweets. Please try again later"
        );
      });
  });
});
