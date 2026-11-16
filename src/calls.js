import { doc, getDoc, enableNetwork } from "firebase/firestore";
import { db } from "./firebaseConfig.js";
const guideRef = doc(db, "guides", "wSkeKV7ezkcEwA5ZL5Mg");
enableNetwork(db)
    .then(() => getDoc(guideRef))
    .then(function (guideSnap) {
        if (guideSnap.exists()) {
            console.log("Guide data:", guideSnap.data());
        } else {
            console.log("Guide not found!");
        }
    })
    .catch(function (error) {
        console.error("Error reading guide:", error);
    });

const nextButton = document.getElementById("next-btn");
const previousButton = document.getElementById("previous-btn");

const stepCounter = document.getElementById("step-counter");
const stepTitle = document.getElementById("step-title");
const stepDescription = document.getElementById("step-description");
const stepIcon = document.getElementById("step-icon");

let currentStep = 1;

// Information for each step
const steps = [
    {
        title: "Open your Phone App",
        description: "Select the phone app icon at the bottom of your home screen.",
        icon: "bi-phone"
    },
    {
        title: "Select your Contact of Choice",
        description: "Choose the person you'd like to call, or enter a phone number.",
        icon: "bi-person-circle"
    },
    {
        title: "Start a Video Call",
        description: "Select the camera icon to start your video call.",
        icon: "bi-camera-video"
    }
];

// Update the guide based on current step
function updateStep() {

    const step = steps[currentStep - 1];

    stepCounter.textContent = `Step ${currentStep} of ${steps.length}`;

    stepTitle.textContent = step.title;
    stepDescription.textContent = step.description;

    // Change Bootstrap icon
    stepIcon.className = `bi ${step.icon}`;

    // Disable buttons at first and last steps
    previousButton.disabled = currentStep === 1;
    nextButton.disabled = currentStep === steps.length;
}

// NEXT BUTTON
nextButton.addEventListener("click", function () {
    if (currentStep < steps.length) {
        currentStep++;
        updateStep();
    }
});

// PREVIOUS BUTTON
previousButton.addEventListener("click", function () {
    if (currentStep > 1) {
        currentStep--;
        updateStep();
    }
});

// Show the first step when the page loads
updateStep();
