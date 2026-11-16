import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseConfig.js";

// Ask for Help
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

// Leave a Solution
async function submitSolution(event) {
  event.preventDefault();

  // Get values from the form
  const newSolution = {
    problem: document.getElementById("solutionProblem").value,
    solution: document.getElementById("solutionText").value,
    problemTimestamp: serverTimestamp(),
    solutionTimestamp: serverTimestamp(),
  };

  try {
    // Save to Firebase
    await addDoc(collection(db, "solutions"), newSolution);

    // Clear the form
    event.target.reset();

    // Display the updated list
    displaySolutions();
  } catch (error) {
    alert(
      `Error saving solution:\n${error.code || ""}\n${error.message || error}`,
    );
  }
}

// Submit solution form
document
  .getElementById("solutionForm")
  .addEventListener("submit", submitSolution);

// Display Problems and Solutions
async function displaySolutions() {
  const container = document.getElementById("problems-go-here");
  const template = document.getElementById("reviewTemplate");

  container.innerHTML = "";

  try {
    // Read solutions from Firebase
    const querySnapshot = await getDocs(collection(db, "solutions"));

    querySnapshot.forEach((doc) => {
      const solution = doc.data();

      if (!solution.problem || !solution.solution) {
        return;
      }

      const card = template.content.cloneNode(true);

      // Display problem
      card.querySelector(".solution-problem").textContent = solution.problem;

      // Display problem timestamp
      const problemDate = solution.problemTimestamp
        ? solution.problemTimestamp.toDate().toLocaleString()
        : "Date unavailable";

      card.querySelector(".problem-date").textContent = problemDate;

      // Display solution
      card.querySelector(".solution-text").textContent = solution.solution;

      // Display solution timestamp
      const solutionDate = solution.solutionTimestamp
        ? solution.solutionTimestamp.toDate().toLocaleString()
        : "Date unavailable";

      card.querySelector(".solution-date").textContent = solutionDate;

      // Add card to webpage
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading solutions:", error);
  }
}

// Display saved solutions when page loads
displaySolutions();
