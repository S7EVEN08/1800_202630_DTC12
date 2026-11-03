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

searchInput.addEventListener("input", function () {
  const searchText = searchInput.value.toLowerCase();

  helpTopics.forEach(function (topic) {
    const topicName = topic.textContent.toLowerCase();

    if (topicName.includes(searchText)) {
      topic.parentElement.classList.remove("d-none");
    } else {
      topic.parentElement.classList.add("d-none");
    }
  });
});
