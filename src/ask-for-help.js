
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";

import { db } from "./firebaseConfig.js";

// Get HTML elements
const descriptionInput = document.getElementById("problem-description");
const submitButton = document.getElementById("submit-help");

// ==========================================
// SUBMIT A PROBLEM
// ==========================================

submitButton.addEventListener("click", async function () {

  // Get value from the text area
  const description = descriptionInput.value.trim();

  // Check if the description is empty
  if (description === "") {
    alert("Please describe your problem.");
    return;
  }

  try {

    // Save the problem to Firestore
    await addDoc(collection(db, "helpRequests"), {
      description: description,
      photoUrl: "",
      timestamp: serverTimestamp()
    });

    alert("Help request submitted successfully!");

    // Clear the text area
    descriptionInput.value = "";

    // Refresh the latest problems
    displayProblems();

  } catch (error) {
    console.error("Error submitting problem:", error);
    alert("Failed to submit help request.");
  }

});


// ==========================================
// SUBMIT A SOLUTION
// ==========================================

async function submitReview(event) {

  // Prevent page from refreshing
  event.preventDefault();

  // Get values from the form
  const title = document.getElementById("reviewTitle").value.trim();
  const text = document.getElementById("reviewText").value.trim();

  // Check if the fields are empty
  if (title === "" || text === "") {
    alert("Please fill in both fields.");
    return;
  }

  // Create a solution object
  const newSolution = {
    title: title,
    text: text,
    timestamp: serverTimestamp()
  };

  try {

    // Save solution to Firestore
    await addDoc(collection(db, "solutions"), newSolution);

    alert("Solution submitted successfully!");

    // Clear the form
    event.target.reset();

    // Refresh the solutions
    displaySolutions();

  } catch (error) {

    console.error("Error saving solution:", error);
    alert("Failed to submit solution.");

  }
}


// Listen for solution form submission
document.getElementById("reviewForm")
  .addEventListener("submit", submitReview);


// ==========================================
// DISPLAY LATEST PROBLEMS
// ==========================================

async function displayProblems() {

  const container = document.getElementById("reviews-go-here");

  // Clear old problems
  container.innerHTML = "";

  try {

    // Read all documents from helpRequests
    const querySnapshot = await getDocs(
      collection(db, "helpRequests")
    );

    // Check if there are any problems
    if (querySnapshot.empty) {
      container.textContent = "No problems submitted yet.";
      return;
    }

    // Convert documents into an array
    const problems = querySnapshot.docs.map(doc => doc.data());

    // Sort by newest first
    problems.sort((a, b) =>
      (b.timestamp?.toMillis() || 0) -
      (a.timestamp?.toMillis() || 0)
    );

    // Display each problem
    problems.forEach(problem => {

      // Create a Bootstrap card
      const card = document.createElement("div");
      card.className = "card mb-3";

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      // Problem description
      const description = document.createElement("p");
      description.className = "card-text";
      description.textContent = problem.description;

      // Date
      const date = document.createElement("small");
      date.className = "text-muted";

      date.textContent = problem.timestamp
        ? problem.timestamp.toDate().toLocaleString()
        : "Just now";

      // Add everything to the card
      cardBody.appendChild(description);
      cardBody.appendChild(date);

      card.appendChild(cardBody);
      container.appendChild(card);

    });

  } catch (error) {

    console.error("Error loading problems:", error);
    container.textContent = "Failed to load problems.";

  }

}


// ==========================================
// DISPLAY RECENT SOLUTIONS
// ==========================================

async function displaySolutions() {

  const container = document.getElementById("solutions-go-here");

  // Clear old solutions
  container.innerHTML = "";

  try {

    // Read all solutions from Firestore
    const querySnapshot = await getDocs(
      collection(db, "solutions")
    );

    // Check if there are solutions
    if (querySnapshot.empty) {
      container.textContent = "No solutions submitted yet.";
      return;
    }

    // Convert documents into an array
    const solutions = querySnapshot.docs.map(doc => doc.data());

    // Sort by newest first
    solutions.sort((a, b) =>
      (b.timestamp?.toMillis() || 0) -
      (a.timestamp?.toMillis() || 0)
    );

    // Display each solution
    solutions.forEach(solution => {

      // Create card
      const card = document.createElement("div");
      card.className = "card mb-3";

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      // Solution title
      const title = document.createElement("h5");
      title.className = "card-title";
      title.textContent = solution.title;

      // Solution description
      const text = document.createElement("p");
      text.className = "card-text";
      text.textContent = solution.text;

      // Date
      const date = document.createElement("small");
      date.className = "text-muted";

      date.textContent = solution.timestamp
        ? solution.timestamp.toDate().toLocaleString()
        : "Just now";

      // Add elements to the card
      cardBody.appendChild(title);
      cardBody.appendChild(text);
      cardBody.appendChild(date);

      card.appendChild(cardBody);
      container.appendChild(card);

    });

  } catch (error) {

    console.error("Error loading solutions:", error);
    container.textContent = "Failed to load solutions.";

  }

}


// ==========================================
// LOAD DATA WHEN PAGE OPENS
// ==========================================

displayProblems();
displaySolutions();
