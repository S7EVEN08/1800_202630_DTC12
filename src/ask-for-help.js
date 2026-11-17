
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";

import { db } from "./firebaseConfig.js";

// Get HTML elements
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseConfig.js";

// Ask for Help
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
  addDoc(collection(db, "helpRequests"), {
    description: description,
    photoUrl: "",
  })
    .then(function (docRef) {
      descriptionInput.value = "";

      // Go to Contact Method page with the document ID
      location.href = "contact-method.html?docID=" + docRef.id;
    })
    .catch(function (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit help request.");
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
