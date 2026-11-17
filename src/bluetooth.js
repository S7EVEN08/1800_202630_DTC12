import { doc, getDoc, enableNetwork } from "firebase/firestore";
import { db } from "./firebaseConfig.js";
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
