import "./scss/app.scss";
import "../node_modules/bootstrap";
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

var btnLogIn = document.getElementById("btnIniciarSesion");
var btnLogInGgle = document.getElementById("btnIniciarGoogle");
// btnIniciar = document.getElementById("btnIniciarSesion")
btnLogIn.addEventListener("click", function () {
  var email = document.getElementById("inputEmail").value;
  var pass = document.getElementById("inputPass").value;
  var user = { email: email, pass: pass };

  verificarUsuario(user) ? iniciarSesion(user) : error("Error en los campos");
});

btnLogInGgle.addEventListener("click", function () {
  console.log("Google");
});

function verificarUsuario(user) {
  console.log(user);
  if (user.email.trim().length > 0 && user.pass.trim().length > 0) return true;
  return false;
}
function iniciarSesion(user) {
  console.log(user);
}

function error(msg) {
  alert("", msg);
}

function changeDir(url, tiempo) {
  let actualPage = location.href;
  console.log(actualPage);
  setTimeout(function () {
    location.href = url;
  }, tiempo * 1000);
}
