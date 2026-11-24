
import {
    doc,
    getDoc,
    updateDoc,
    increment
} from "firebase/firestore";

import { db } from "./firebaseConfig.js";

// Reference to Bluetooth in HelpTopics
const helpTopicRef = doc(db, "HelpTopics", "bluetooth");

// Count views when someone opens the page
async function displayGuideInfo() {
    try {
        const topicSnap = await getDoc(helpTopicRef);

        if (topicSnap.exists()) {
            const topic = topicSnap.data();

            // Increase views in HelpTopics
            await updateDoc(helpTopicRef, {
                views: increment(1)
            });

            // Display the new number
            document.getElementById("viewCount").textContent =
                (topic.views || 0) + 1;

        } else {
            console.log("Bluetooth topic not found!");
        }

    } catch (error) {
        console.error("Error updating Bluetooth views:", error);
    }
}

// Run when the page loads
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
        title: "Open your Settings App",
        description: "Select the connections option then tap Bluetooth",
        icon: "bi-bluetooth"
    },
    {
        title: "Turn on device",
        description: "ensure the device you are trying to connect is on and near your phone",
        icon: "bi-headphones"
    },
    {
        title: "Connect the Device",
        description: "Once your device appears as avaible on your phone click the option and wait for them to pair",
        icon: "bi-check"
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
