
import { logoutUser, onAuthReady } from "/src/authentication.js";

class SiteNavbar extends HTMLElement {
  constructor() {
    super();
    this.renderNavbar();
  }

  connectedCallback() {
    this.renderAuthControls();
  }

  renderNavbar() {
    this.innerHTML = `
      <!-- Navbar: single source of truth -->
      <nav class="navbar navbar-expand-sm bg-success navbar-dark">
        <div class="container">

          <!-- Brand -->
          <a class="navbar-brand fw-bold" href="index.html">
            Older and Wiser
          </a>

          <!-- Login/Logout and Mobile Menu -->
          <div class="d-flex align-items-center gap-2 order-sm-2">

            <!-- Firebase Authentication Controls -->
            <div
              id="authControls"
              class="d-flex align-items-center"
            >
              <!-- Populated by Firebase -->
            </div>

            <!-- Hamburger Menu -->
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>

          </div>

          <!-- Navigation Links -->
          <div
            class="collapse navbar-collapse order-sm-1"
            id="navbarSupportedContent"
          >

            <ul class="navbar-nav me-auto">

              <li class="nav-item">
                <a class="nav-link" href="index.html">Home</a>
              </li>

              <li class="nav-item">
                <a class="nav-link" href="help-topics.html">Help Topics</a>
              </li>

              <li class="nav-item">
                <a class="nav-link" href="help-topics.html">Guides</a>
              </li>

              <li class="nav-item">
                <a class="nav-link" href="ask-for-help.html">Ask for Help</a>
              </li>

            </ul>

          </div>

        </div>
      </nav>
    `;
  }

  // Display Log in or Log out based on Firebase authentication
  renderAuthControls() {
    const authControls = this.querySelector("#authControls");

    // Invisible placeholder while Firebase checks login status
    authControls.innerHTML = `
      <div
        class="btn btn-outline-light"
        style="visibility: hidden; min-width: 80px;"
      >
        Log out
      </div>
    `;

    onAuthReady(function (user) {

      if (user) {
        // User is logged in
        authControls.innerHTML = `
          <button
            class="btn btn-outline-light"
            id="signOutBtn"
            type="button"
            style="min-width: 80px;"
          >
            Log out
          </button>
        `;

        const signOutBtn = authControls.querySelector("#signOutBtn");

        signOutBtn.addEventListener("click", logoutUser);

      } else {
        // User is not logged in
        authControls.innerHTML = `
          <a
            class="btn btn-outline-light"
            id="loginBtn"
            href="login.html"
            style="min-width: 80px;"
          >
            Log in
          </a>
        `;
      }
    });
  }
}

customElements.define("site-navbar", SiteNavbar);
