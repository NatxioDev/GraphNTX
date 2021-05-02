import "./scss/app.scss";
import "../node_modules/bootstrap";
import "../node_modules/@fortawesome/fontawesome-free/js/brands.js";
import "../node_modules/@fortawesome/fontawesome-free/js/solid.js";
import "../node_modules/@fortawesome/fontawesome-free/js/fontawesome.js";
import style from "./style.css";
import "firebase/auth";
import { DataSet, Network } from "vis-network/standalone";
import Swal from "sweetalert2";
import firebase from "firebase/app";
import { generarNuevoId } from "./generarNuevoId";
import { info } from "autoprefixer";
import { router } from "./router/index.routes";
var btnNuevoNodo = document.getElementById("btnNuevoNodo");
var btnReiniciar = document.getElementById("btnReiniciar");
var btnDescargar = document.getElementById("btnDescargar");
var btnGenerarMatriz = document.getElementById("btnGenerarMatriz");

btnNuevoNodo.addEventListener("click", añadirNodo);
btnReiniciar.addEventListener("click", reiniciar);
btnDescargar.addEventListener("click", añadirNodo);
btnGenerarMatriz.addEventListener("click", generarMatriz);

console.log("object");

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

export var nodes = new DataSet([]);

var edges = new DataSet([]);

var container = document.getElementById("mynetwork");

window.addEventListener("hashchange", () => {
  router(window.location.hash);
});

var data = {
  nodes: nodes,
  edges: edges,
};

var options = {
  width: "",
  height: "700",
  locale: "es",
  physics: false,
  manipulation: {
    enabled: true,
    initiallyActive: false,
    addNode: function (nodeData, callback) {
      añadirNodo(nodeData, callback);
    },
    addEdge: function (edgeData, callback) {
      añadirEdge(edgeData, callback);
    },
    editEdge: function (edgeData, callback) {
      añadirEdge(edgeData, callback);
    },
    editNode: function (nodeData, callback) {
      editarNodo(nodeData, callback);
    },
  },
  nodes: {
    color: "#eeda7c",
    font: {
      color: "#333333",
      size: 20,
    },
  },
  edges: {
    color: {
      color: "#f5f5f5",
      highlight: "#848484",
      hover: "#848484",
    },
    arrows: {
      to: {
        enabled: true,
        type: "triangle",
      },
    },
    font: {
      color: "#f5f5f5",
      size: 20,
      align: "horizontal",
      background: "none",
      strokeWidth: 0,
      align: "top",
    },
  },
};

async function añadirNodo() {
  const { value: valorNodo } = await Swal.fire({
    title: "Ingresa el valor del nodo",
    icon: "info",
    input: "text",
    inputPlaceholder: "Valor del nodo",
    inputAttributes: {
      maxlength: 5,
    },
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) return "Tienes que escribir un valor!";
      else if (value == "") return "Tienes que escribir un valor!";
    },
  });

  if (valorNodo) {
    console.log("sida");
    nodes.add([
      {
        id: generarNuevoId(),
        label: valorNodo,
      },
    ]);
  }
}

async function editarNodo(nodeData, callback) {
  const { value: valorNodo } = await Swal.fire({
    title: "Ingrese el nuevo valor del nodo:",
    icon: "info",
    input: "text",
    inputPlaceholder: "Valor del nodo",
    inputAttributes: {
      maxlength: 5,
    },
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) return "Tienes que escribir un valor!";
      else if (value == "") return "Tienes que escribir un valor!";
    },
  });
  if (valorNodo) {
    nodeData.label = valorNodo;
    callback(nodeData);
  }
}

async function modalEdge(edgeData, callback) {
  const { value: valorEdge } = await Swal.fire({
    title: "Ingrese el valor de la union:",
    icon: "info",
    input: "number",
    inputPlaceholder: "Valor del nodo",
    confirmButtonColor: "#eeda7c",
    allowOutsideClick: false,
    inputAttributes: {
      maxlength: 5,
    },
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) return "Tienes que escribir un valor!";
      else if (value == "") return "Tienes que escribir un valor!";
    },
  });
  let aux = await valorEdge;

  edgeData.label = await aux;
  callback(edgeData);
}

function añadirEdge(edgeData, callback) {
  if (edgeData.to === edgeData.from) {
    Swal.fire({
      title: "Confirmacion",
      text: "Esta seguro de unir el mismo nodo?",
      icon: "warning",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Si",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        modalEdge(edgeData, callback);
      }
      if (result.isDenied) {
        Swal.fire({
          title: "No se creo la conexion",
          icon: "error",
          timer: 1000,
          timerProgressBar: true,
        });
      }
    });
  } else {
    modalEdge(edgeData, callback);
  }
}

function reiniciar() {
  location.reload();
}

function generarMatriz() {
  let matrix = Array(nodes.length)
    .fill(0)
    .map(() => Array(nodes.length).fill(0));

  edges.forEach((edge) => {
    matrix[parseInt(edge.from)][parseInt(edge.to)] = edge.label;
  });

  let rowList = [];
  let colList = [];

  for (let i = 0; i < matrix.length; i++) {
    let sumRow = 0;
    let sumCol = 0;
    for (let j = 0; j < matrix.length; j++) {
      sumRow += parseFloat(matrix[i][j]);
      sumCol += parseFloat(matrix[j][i]);
    }

    rowList.push(sumRow);
    colList.push(sumCol);
  }

  //MOSTRAR MATRIZ
  let nombresNodos = [];

  let showMatrix = " ,";
  nodes.forEach((node) => {
    showMatrix += node.label + ",";
    nombresNodos.push(node.label);
  });

  showMatrix += "SUMA|";

  for (let i = 0; i < matrix.length; i++) {
    showMatrix += nombresNodos[i] + ",";
    for (let j = 0; j < matrix.length; j++) {
      showMatrix += matrix[i][j] + ",";
    }

    showMatrix += rowList[i] + "|";
  }

  showMatrix += "SUMA,";
  colList.forEach((col) => (showMatrix += col + ","));

  parseArray(showMatrix);
}

function parseArray(matriz) {
  let final = Array(nodes.length + 2)
    .fill(0)
    .map(() => Array(nodes.length + 2).fill(0));

  let rows = matriz.split(["|"]);

  for (let i = 0; i < rows.length; i++) {
    let cols = rows[i].split(",");

    for (let j = 0; j < cols.length; j++) {
      final[i][j] = cols[j];
    }
  }

  crearTabla(final);
}

function crearTabla(datosTabla) {
  let finalTable = document.getElementById("finalTable");

  var cuerpoTabla = document.createElement("tbody");

  finalTable.innerHTML = "";

  datosTabla.forEach(function (datosFilas) {
    var fila = document.createElement("tr");

    datosFilas.forEach(function (datosCeldas) {
      var celda = document.createElement("th");

      celda.appendChild(document.createTextNode(datosCeldas));
      fila.appendChild(celda);
    });

    cuerpoTabla.appendChild(fila);
  });

  finalTable.appendChild(cuerpoTabla);
}

var network = new Network(container, data, options);
