
import {
  doc,
  getDoc,
  updateDoc,
  increment
} from "firebase/firestore";

import { db } from "./firebaseConfig.js";

// Firestore HelpTopics document
const helpTopicRef = doc(db, "HelpTopics", "wifi");

// Count views
async function displayGuideInfo() {
  try {
    const topicSnap = await getDoc(helpTopicRef);

    if (topicSnap.exists()) {
      const topic = topicSnap.data();

      await updateDoc(helpTopicRef, {
        views: increment(1)
      });

      document.getElementById("viewCount").textContent =
        (topic.views || 0) + 1;
    } else {
      console.log("Wi-Fi topic not found!");
    }
  } catch (error) {
    console.error("Error updating views:", error);
  }
}

displayGuideInfo();

// HTML elements
const nextButton = document.getElementById("next-btn");
const previousButton = document.getElementById("previous-btn");
const stepCounter = document.getElementById("step-counter");
const stepTitle = document.getElementById("step-title");
const stepDescription = document.getElementById("step-description");
const stepIcon = document.getElementById("step-icon");
const guideCard = document.getElementById("guide-card");
const completeScreen = document.getElementById("complete-screen");

let currentStep = 1;

// Wi-Fi guide steps
const steps = [
  {
    title: "Open your Wi-Fi settings",
    description: "Go to your device settings and select the Wi-Fi option.",
    icon: "bi-wifi"
  },
  {
    title: "Select your Wi-Fi network",
    description: "Choose your Wi-Fi network from the list.",
    icon: "bi-router"
  },
  {
    title: "Enter your Wi-Fi password",
    description: "Type your password and press Connect.",
    icon: "bi-key"
  }
];

// Update the current step
function updateStep() {

  if (currentStep > steps.length) {
    guideCard.classList.add("d-none");
    completeScreen.classList.remove("d-none");
    return;
  }

  guideCard.classList.remove("d-none");
  completeScreen.classList.add("d-none");

  const step = steps[currentStep - 1];

  stepCounter.textContent =
    `Step ${currentStep} of ${steps.length}`;

  stepTitle.textContent = step.title;
  stepDescription.textContent = step.description;

  stepIcon.className = `bi ${step.icon}`;

  previousButton.disabled = currentStep === 1;

  if (currentStep === steps.length) {
    nextButton.textContent = "Complete Guide";
  } else {
    nextButton.textContent = "Next";
  }
}

// Next button
nextButton.addEventListener("click", function () {
  if (currentStep <= steps.length) {
    currentStep++;
    updateStep();
  }
});

// Previous button
previousButton.addEventListener("click", function () {
  if (currentStep > 1) {
    currentStep--;
    updateStep();
  }
});

// Display first step
updateStep();
