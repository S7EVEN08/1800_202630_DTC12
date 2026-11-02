const nextButton = document.getElementById("next-btn");
const previousButton = document.getElementById("previous-btn");
const stepCounter = document.getElementById("step-counter");
const stepTitle = document.getElementById("step-title");
const stepDescription = document.getElementById("step-description");

let currentStep = 1;

// NEXT BUTTON
nextButton.addEventListener("click", function () {
  if (currentStep < 3) {
    currentStep++;
    stepCounter.textContent = `Step ${currentStep} of 3`;

    if (currentStep === 2) {
      stepTitle.textContent = "Select your Wi-Fi network";
      stepDescription.textContent = "Choose your Wi-Fi network from the list.";
    } else if (currentStep === 3) {
      stepTitle.textContent = "Enter your Wi-Fi password";
      stepDescription.textContent = "Type your password and press Connect.";
    }
  }
});


previousButton.addEventListener("click", function () {
  if (currentStep > 1) {
    currentStep--;
    stepCounter.textContent = `Step ${currentStep} of 3`;

    if (currentStep === 2) {
      stepTitle.textContent = "Select your Wi-Fi network";
      stepDescription.textContent = "Choose your Wi-Fi network from the list.";
    } else if (currentStep === 1) {
      stepTitle.textContent = "Open your Wi-Fi settings";
      stepDescription.textContent =
        "Go to your device settings and select the Wi-Fi option.";
    }
  }
});

