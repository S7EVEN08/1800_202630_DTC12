import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

import { auth } from "./firebaseConfig.js";

export function createNewUser(name, email, password) {
  return createUserWithEmailAndPassword(auth, email, password).then(
    function (userCredential) {
      return updateProfile(userCredential.user, {
        displayName: name,
      });
    },
  );
}

export function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logoutUser() {
  return signOut(auth);
}

export function onAuthReady(callback) {
  return onAuthStateChanged(auth, callback);
}
