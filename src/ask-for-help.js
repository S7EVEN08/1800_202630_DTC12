import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig.js";

const descriptionInput = document.getElementById("problem-description");
const submitButton = document.getElementById("submit-help");

submitButton.addEventListener("click", function () {
  const description = descriptionInput.value.trim();

  if (description === "") {
    alert("Please describe your problem.");
    return;
  }

  addDoc(collection(db, "helpRequests"), {
    description: description,
    photoUrl: "",
  })
    .then(function () {
      alert("Help request submitted successfully!");
      descriptionInput.value = "";
    })
    .catch(function (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit help request.");
    });
});

async function submitReview(event) {
  event.preventDefault();

  //get value from front end
  const newReview = {
     title: document.getElementById("reviewTitle").value,
     rating: Number(document.getElementById("reviewRating").value),
     text: document.getElementById("reviewText").value,
     hikeDocID: hikeId,
     userID: currentUser.uid,
     userName: currentUser.displayName || currentUser.email,
     timestamp: serverTimestamp(),
   };

  try {
    await addDoc(collection(db, "reviews"), newReview);
    event.target.reset(); // clear the form
    displayReviews(); // re-read the list so the new review shows (Step 1.3)
  } catch (error) {
    alert(
      `Error saving review:\n${error.code || ""}\n${error.message || error}`,
    );
  }
}

//Feedback
async function submitReview(event) {
  event.preventDefault();

  //get value from front end
  const newReview = {
     title: document.getElementById("reviewTitle").value,
     rating: Number(document.getElementById("reviewRating").value),
     text: document.getElementById("reviewText").value,
     hikeDocID: hikeId,
     userID: currentUser.uid,
     userName: currentUser.displayName || currentUser.email,
     timestamp: serverTimestamp(),
   };

  try {
    await addDoc(collection(db, "reviews"), newReview);
    event.target.reset(); // clear the form
    displayReviews(); // re-read the list so the new review shows (Step 1.3)
  } catch (error) {
    alert(
      `Error saving review:\n${error.code || ""}\n${error.message || error}`,
    );
  }
}

console.log("submit clicked");

document.getElementById("reviewForm").addEventListener("submit", submitReview);

async function displayReviews() {
    const container = document.getElementById("reviews-go-here");
    const template = document.getElementById("reviewTemplate");
    container.innerHTML = "";     // start empty so we don't show duplicates

    // Build the question we want to ask Firestore
    const q = query(
        collection(db, "reviews"),
        where("hikeDocID", "==", hikeId),    // only THIS hike
        // orderBy("timestamp", "desc"),         // newest first
        // limit(5)                        // optional: only the latest 5 (try it after Step 1.4)
    );

    try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            container.innerHTML = "<p class='text-muted'>No reviews yet. Be the first!</p>";
            return;
        }

        querySnapshot.forEach(doc => {
            const review = doc.data();
            const card = template.content.cloneNode(true);

            card.querySelector(".review-title").textContent = `${review.title} ${"★".repeat(review.rating)}`;
            const date = review.timestamp ? review.timestamp.toDate().toLocaleDateString() : "just now";
            card.querySelector(".review-meta").textContent = `${review.userName} · ${date}`;
            card.querySelector(".review-text").textContent = review.text;

            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading reviews:", error);
    }
}
displayReviews();
