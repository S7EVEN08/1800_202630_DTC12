import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig.js";

const descriptionInput = document.getElementById("problem-description");
const submitButton = document.getElementById("submit-help");

submitButton.addEventListener("click", function () {
  const description = descriptionInput.value.trim();

  if (description === "") {
    alert("Please describe your problem.");
    return;
  }

  addDoc(collection(db, "helpRequests"), {
    description: description,
    photoUrl: "",
  })
    .then(function () {
      alert("Help request submitted successfully!");
      descriptionInput.value = "";
    })
    .catch(function (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit help request.");
    });
});
