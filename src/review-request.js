import "./components/site-navbar.js";

import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebaseConfig.js";

// Get the document ID from the URL
const params = new URLSearchParams(window.location.search);
const requestId = params.get("docID");

// Get HTML elements
const reviewDescription = document.getElementById("reviewDescription");
const reviewPhoto = document.getElementById("reviewPhoto");
const noPhoto = document.getElementById("noPhoto");
const reviewContactMethod = document.getElementById("reviewContactMethod");
const backButton = document.getElementById("backButton");

// NEW: Get Submit Request button
const submitButton = document.getElementById("submitRequestButton");

// Display help request
async function displayRequest() {
  if (!requestId) {
    alert("Help request not found.");
    return;
  }

  try {
    // Find the help request in Firebase
    const requestRef = doc(db, "helpRequests", requestId);
    const requestSnap = await getDoc(requestRef);

    if (requestSnap.exists()) {
      const request = requestSnap.data();

      // Display problem description
      reviewDescription.textContent = request.description;

      // Display contact method
      reviewContactMethod.textContent = request.contactMethod;

      // Display photo if the user uploaded one
      if (request.photoUrl) {
        reviewPhoto.src = request.photoUrl;
        reviewPhoto.classList.remove("d-none");
        noPhoto.classList.add("d-none");
      }
    } else {
      alert("Help request not found.");
    }
  } catch (error) {
    console.error("Error loading request:", error);
    alert("Failed to load help request.");
  }
}

// Display request when the page loads
displayRequest();

// Go back to Contact Method page
backButton.href = "contact-method.html?docID=" + requestId;

// NEW: Submit help request
submitButton.addEventListener("click", async function () {
  if (!requestId) {
    alert("Help request not found.");
    return;
  }

  submitButton.disabled = true;

  try {
    // Find the existing help request
    const requestRef = doc(db, "helpRequests", requestId);

    // Update the help request in Firebase
    await updateDoc(requestRef, {
      status: "submitted",
      submittedAt: serverTimestamp(),
    });

    alert("Your help request has been submitted successfully!");

  } catch (error) {
    console.error("Error submitting request:", error);
    alert("Failed to submit help request.");
  } finally {
    submitButton.disabled = false;
  }
});