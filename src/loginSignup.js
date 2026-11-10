console.log("loginSignup is running");
import { createNewUser, loginUser } from "./authentication.js";

const loginView = document.getElementById("loginView");
const signupView = document.getElementById("signupView");

const toSignup = document.getElementById("toSignup");
const toLogin = document.getElementById("toLogin");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const authAlert = document.getElementById("authAlert");

toSignup.addEventListener("click", function (event) {
  event.preventDefault();

  loginView.classList.add("d-none");
  signupView.classList.remove("d-none");
});

toLogin.addEventListener("click", function (event) {
  event.preventDefault();

  signupView.classList.add("d-none");
  loginView.classList.remove("d-none");
});

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  loginUser(email, password)
    .then(function () {
      location.href = "index.html";
    })
    .catch(function (error) {
      authAlert.textContent = error.message;
      authAlert.classList.remove("d-none");
    });
});

signupForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  createNewUser(name, email, password)
    .then(function () {
      location.href = "index.html";
    })
    .catch(function (error) {
      authAlert.textContent = error.message;
      authAlert.classList.remove("d-none");
    });
});
