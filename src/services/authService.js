import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../firebase/config";

// Register User
export const registerUser = async (name, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await updateProfile(userCredential.user, {
    displayName: name,
  });

  return userCredential.user;
};

// Login User
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;
};

// Logout
export const logoutUser = async () => {
  await signOut(auth);
};

// Google Login
export const googleLogin = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);

  return result.user;
};

// Forgot Password
export const forgotPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

// Auth State Listener
export const observeAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};