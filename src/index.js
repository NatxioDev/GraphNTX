import "./scss/app.scss";
import "../node_modules/bootstrap" 
import "../node_modules/@fortawesome/fontawesome-free/js/brands.js";
import "../node_modules/@fortawesome/fontawesome-free/js/solid.js";
import "../node_modules/@fortawesome/fontawesome-free/js/fontawesome.js";

import "firebase/auth";

import firebase from "firebase/app";
var firebaseConfig = {
  apiKey: "AIzaSyA11GeJ8qfD7PsrS2rjvu7z5uoXUu37th8",
  authDomain: "graphntx.firebaseapp.com",
  projectId: "graphntx",
  storageBucket: "graphntx.appspot.com",
  messagingSenderId: "823334374348",
  appId: "1:823334374348:web:29380a77bbfd655f932b69",
  measurementId: "G-ZL2RXELTTB",
};
firebase.initializeApp(firebaseConfig);

