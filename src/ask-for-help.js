
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";

import { db } from "./firebaseConfig.js";

// ==========================================
// ASK FOR HELP
// ==========================================

const descriptionInput = document.getElementById("problem-description");
const submitButton = document.getElementById("submit-help");

// Submit a problem
submitButton.addEventListener("click", async function () {

  const description = descriptionInput.value.trim();

  if (description === "") {
    alert("Please describe your problem.");
    return;
  }

  try {
    // Save the problem to Firestore
    const docRef = await addDoc(collection(db, "helpRequests"), {
      description: description,
      photoUrl: "",
      timestamp: serverTimestamp()
    });

    // Clear the text area
    descriptionInput.value = "";

    // Redirect to Contact Method page
    location.href = "contact-method.html?docID=" + docRef.id;

  } catch (error) {
    console.error("Error submitting problem:", error);
    alert("Failed to submit help request.");
  }
});


// ==========================================
// SUBMIT A SOLUTION
// ==========================================

async function submitSolution(event) {

  // Prevent the page from refreshing
  event.preventDefault();

  // Get values from the form
  const problem = document.getElementById("solutionProblem").value.trim();
  const solution = document.getElementById("solutionText").value.trim();

  // Check if fields are empty
  if (problem === "" || solution === "") {
    alert("Please fill in both fields.");
    return;
  }

  // Create solution object
  const newSolution = {
    problem: problem,
    solution: solution,
    problemTimestamp: serverTimestamp(),
    solutionTimestamp: serverTimestamp()
  };

  try {
    // Save solution to Firestore
    await addDoc(collection(db, "solutions"), newSolution);

    alert("Solution submitted successfully!");

    // Clear the form
    event.target.reset();

    // Refresh displayed solutions
    displaySolutions();

  } catch (error) {
    console.error("Error saving solution:", error);
    alert("Failed to submit solution.");
  }
}

// Connect solution form to JavaScript
document.getElementById("solutionForm")
  .addEventListener("submit", submitSolution);


// ==========================================
// DISPLAY LATEST PROBLEMS AND SOLUTIONS
// ==========================================

async function displaySolutions() {

  const container = document.getElementById("problems-go-here");
  const template = document.getElementById("reviewTemplate");

  // Clear previous cards
  container.innerHTML = "";

  try {
    // Read solutions from Firestore
    const querySnapshot = await getDocs(
      collection(db, "solutions")
    );

    if (querySnapshot.empty) {
      container.textContent = "No solutions submitted yet.";
      return;
    }

    // Convert documents into an array
    const solutions = querySnapshot.docs.map(doc => doc.data());

    // Sort newest first
    solutions.sort((a, b) =>
      (b.solutionTimestamp?.toMillis() || 0) -
      (a.solutionTimestamp?.toMillis() || 0)
    );

    // Display each solution
    solutions.forEach(solution => {

      // Skip documents without the required fields
      if (!solution.problem || !solution.solution) {
        return;
      }

      // Clone the HTML template
      const card = template.content.cloneNode(true);

      // Display problem
      card.querySelector(".solution-problem").textContent =
        solution.problem;

      // Display solution
      card.querySelector(".solution-text").textContent =
        solution.solution;

      // Problem date
      const problemDate = solution.problemTimestamp
        ? solution.problemTimestamp.toDate().toLocaleString()
        : "Date unavailable";

      card.querySelector(".problem-date").textContent =
        problemDate;

      // Solution date
      const solutionDate = solution.solutionTimestamp
        ? solution.solutionTimestamp.toDate().toLocaleString()
        : "Date unavailable";

      card.querySelector(".solution-date").textContent =
        solutionDate;

      // Add card to webpage
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

displaySolutions();
