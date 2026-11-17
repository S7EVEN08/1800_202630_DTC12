import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig.js";

// Get the help request ID from the URL
const params = new URLSearchParams(window.location.search);
const requestId = params.get("docID");

// Get the radio buttons
const textMethod = document.getElementById("text-method");
const phoneMethod = document.getElementById("phone-method");

// Get the circle icons
const textIcon = document.getElementById("text-icon");
const phoneIcon = document.getElementById("phone-icon");

// Change circle to checkmark when selected
textMethod.addEventListener("change", function () {
  textIcon.className = "bi bi-check-circle-fill me-2";
  phoneIcon.className = "bi bi-circle me-2";
});

phoneMethod.addEventListener("change", function () {
  phoneIcon.className = "bi bi-check-circle-fill me-2";
  textIcon.className = "bi bi-circle me-2";
});

// Next button
const nextButton = document.getElementById("next-btn");

nextButton.addEventListener("click", async function () {
  const selectedMethod = document.querySelector(
    'input[name="contactMethod"]:checked',
  );

  if (selectedMethod === null) {
    alert("Please select a contact method.");
    return;
  }

  if (!requestId) {
    alert("Help request not found. Please submit your problem first.");
    return;
  }

  try {
    // Update the existing help request in Firebase
    const requestRef = doc(db, "helpRequests", requestId);

    await updateDoc(requestRef, {
      contactMethod: selectedMethod.value,
    });

    // Show confirmation
    alert("Your contact method has been saved successfully!");
  } catch (error) {
    console.error("Error saving contact method:", error);
    alert("Failed to save contact method.");
  }
});
