import {
    doc,
    getDoc,
    updateDoc,
    increment
} from "firebase/firestore";

import { db } from "./firebaseConfig.js";

const helpTopicRef = doc(db, "HelpTopics", "videocalls");
const guideRef = doc(db, "guides", "wSkeKV7ezkcEwA5ZL5Mg");

async function displayGuideInfo() {
    try {
        // Read the guide document
        const guideSnap = await getDoc(guideRef);

        if (guideSnap.exists()) {
            const guide = guideSnap.data();

            // Increase views by 1 in Firestore
            await updateDoc(guideRef, {
                views: increment(1)
            });

            // Display the updated view count
            document.getElementById("viewCount").textContent =
                (guide.views || 0) + 1;

        } else {
            console.log("Guide not found!");
        }

    } catch (error) {
        console.error("Error updating views:", error);
    }
}

// Run when the page opens
displayGuideInfo();



const nextButton = document.getElementById("next-btn");
const previousButton = document.getElementById("previous-btn");

const stepCounter = document.getElementById("step-counter");
const stepTitle = document.getElementById("step-title");
const stepDescription = document.getElementById("step-description");
const stepIcon = document.getElementById("step-icon");
const guideCard = document.getElementById("guide-card");
const completeScreen = document.getElementById("complete-screen");

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

    // Show completion screen after final step
    if (currentStep > steps.length) {

        // Hide the guide
        guideCard.classList.add("d-none");

        // Show completion screen
        completeScreen.classList.remove("d-none");

        return;
    }

    // Show normal guide steps
    guideCard.classList.remove("d-none");
    completeScreen.classList.add("d-none");

    const step = steps[currentStep - 1];

    stepCounter.textContent =
        `Step ${currentStep} of ${steps.length}`;

    stepTitle.textContent = step.title;
    stepDescription.textContent = step.description;

    // Change icon
    stepIcon.className = `bi ${step.icon}`;

    // Disable Previous on Step 1
    previousButton.disabled = currentStep === 1;

    // Change Next button text on the final step
    if (currentStep === steps.length) {
        nextButton.textContent = "Complete Guide";
    } else {
        nextButton.textContent = "Next";
    }
}


// NEXT BUTTON
nextButton.addEventListener("click", function () {

    if (currentStep <= steps.length) {
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
