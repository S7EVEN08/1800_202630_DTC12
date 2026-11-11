import { db } from "./firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";
import { onAuthReady } from "./authentication.js";

async function displayGuides() {
  const guideContainer = document.getElementById("guides-go-here");

  guideContainer.innerHTML = `
      <div class="col" id="helpTopics">
         <div class="card h-100">
             <div class="card-body d-flex flex-column">
                 <div class="d-flex align-items-center" style="height: 50px;">
                     <i class="bi bi-book fs-1 text-success"></i>
                 </div>
                 <h5 class="card-title">Help Topics</h5>
                 <p class="card-text"> Browse different technology topics to find the help you need.</p>
                 <a href="help-topics.html" class="btn btn-success mt-auto align-self-start">Browse Topics</a>
             </div>
          </div>
      </div>

      <div class="col" id="guides">
         <div class="card h-100">
             <div class="card-body d-flex flex-column">
                 <div class="d-flex align-items-center" style="height: 50px;">
                     <i class="bi-list-check fs-1 text-success"></i>
                 </div>
                 <h5 class="card-title">Guides</h5>
                 <p class="card-text"> Follow simple step-by-step instructions to learn how to use technology.</p>
                 <a href="guide.html" class="btn btn-success mt-auto align-self-start">View Guides</a>
             </div>
          </div>
      </div>

      <div class="col" id="askForHelp">
         <div class="card h-100">
             <div class="card-body d-flex flex-column">
                 <div class="d-flex align-items-center" style="height: 50px;">
                     <i class="bi-chat-dots fs-1 text-success"></i>
                 </div>
                 <h5 class="card-title">Ask for Help</h5>
                 <p class="card-text"> Need extra help? Send us a request and explain your problem.</p>
                 <a href="ask-for-help.html" class="btn btn-success mt-auto align-self-start">Ask for Help</a>
             </div>
          </div>
      </div>
    `;

  // Read the homeCards collection from Firebase
  try {
    const cardsRef = collection(db, "homeCards");
    const cardsSnap = await getDocs(cardsRef);

    // Loop through the three Firebase documents
    cardsSnap.forEach((doc) => {
      const card = doc.data();

      // Find the matching HTML card using its ID
      const cardElement = document.getElementById(doc.id);

      if (cardElement) {
        // Update the card information from Firebase
        cardElement.querySelector(".card-title").textContent = card.title;
        cardElement.querySelector(".card-text").textContent = card.description;

        // Update the icon
        const icon = cardElement.querySelector("i");
        icon.className = `bi ${card.icon} fs-1 text-success`;

        // Update the button link
        cardElement.querySelector("a").href = card.link;
      }
    });

  } catch (error) {
    console.error("Error loading homepage cards:", error);
  }
}

const loginButton = document.getElementById("hero-login-btn");

onAuthReady(function (user) {
  if (user) {
    // Logged in: hide Login
    loginButton.classList.add("d-none");
  } else {
    // Logged out: show Login
    loginButton.classList.remove("d-none");
  }
});

displayGuides();