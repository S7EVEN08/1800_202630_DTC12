import "./components/site-navbar.js";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebaseConfig.js";

const descriptionInput = document.getElementById("problem-description");
const submitButton = document.getElementById("submit-help");
const photoInput = document.getElementById("problem-image");

// Show photo preview
function showPreview(event) {
  const file = event.target.files[0];
  const preview = document.getElementById("imagePreview");

  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.classList.remove("d-none");
  }
}

// Run showPreview when a photo is selected
photoInput.addEventListener("change", showPreview);

// Shrink a photo and convert it into Base64 text
function resizeImage(file, maxSize = 600) {
  return new Promise(function (resolve, reject) {
    const img = new Image();

    img.onload = function () {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");

      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));

      canvas.getContext("2d").drawImage(
        img, 0, 0, canvas.width, canvas.height
      );

      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// Submit help request
submitButton.addEventListener("click", async function () {
  const description = descriptionInput.value.trim();
  const photo = photoInput.files[0];

  if (description === "") {
    alert("Please describe your problem.");
    return;
  }

  submitButton.disabled = true;

  try {
    // Resize photo and convert it into Base64
    const photoUrl = photo ? await resizeImage(photo) : "";

    // Check image size before saving to Firestore
    if (photoUrl.length > 800000) {
      alert("The image is too large. Please select another image.");
      return;
    }

    // Save help request to Firebase
    const docRef = await addDoc(collection(db, "helpRequests"), {
      description: description,
      photoUrl: photoUrl,
      timestamp: serverTimestamp(),
    });

    // Clear the inputs
    descriptionInput.value = "";
    photoInput.value = "";

    // Go to Contact Method page with the document ID
    location.href = "contact-method.html?docID=" + docRef.id;
  } catch (error) {
    console.error("Error submitting request:", error);
    alert("Failed to submit help request.");
  } finally {
    submitButton.disabled = false;
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
