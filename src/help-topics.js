console.log("Help Topics JavaScript is running!");
import { collection, getDocsFromServer } from "firebase/firestore";
import { db } from "./firebaseConfig.js";
const guidesRef = collection(db, "guides");
console.log("Starting Firebase READ...");

getDocsFromServer(guidesRef)
  .then(function (snapshot) {
    snapshot.forEach(function (guideDoc) {
      console.log("Guide:", guideDoc.data());
    });
  })
  .catch(function (error) {
    console.error("Error loading guides:", error);
  });

const searchInput = document.getElementById("search-input");
const helpTopics = document.querySelectorAll(".help-topic");

// Search bar
searchInput.addEventListener("input", function () {

  const searchText = searchInput.value.toLowerCase().trim();

  helpTopics.forEach(function (topic) {

    const topicName = topic.textContent.toLowerCase();

    if (topicName.includes(searchText)) {
      // Show matching topic
      topic.classList.remove("d-none");
    } else {
      // Hide non-matching topic
      topic.classList.add("d-none");
    }

  });

});

