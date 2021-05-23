import view from "../views/grafo.html";
import { DataSet, Network } from "vis-network/standalone";
import Swal from "sweetalert2";
import firebase from "firebase/app";
import "firebase/database";
import { info } from "autoprefixer";

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

var database = firebase.database();

const shortid = require("shortid");

export default () => {
  const element = document.createElement("div");
  element.innerHTML = view;

  //CODE
  var nodes = new DataSet([]);

  var edges = new DataSet([]);

  var data = {
    nodes: nodes,
    edges: edges,
  };

  var options = {
    width: "",
    height: "700",
    locale: "es",
    physics: {
      enabled: true,
      repulsion: {
        centralGravity: 0.2,
        springLength: 200,
        springConstant: 0.0,
        nodeDistance: 100,
        damping: 0.09,
      },

      solver: "repulsion",
    },
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
      shape: "circle",
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

  
  var btnNuevoNodo = element.querySelector("#btnNuevoNodo");
  var btnReiniciar = element.querySelector("#btnReiniciar");
  var btnDescargar = element.querySelector("#btnDescargar");
  var btnGenerarMatriz = element.querySelector("#btnGenerarMatriz");
  var btnGuardar = element.querySelector("#btnGuardar");
  var btnCargar = element.querySelector("#btnCargar");
  var container = document.querySelector("#mynetwork");
  var projectName = document.querySelector("#projectName");
  
  btnNuevoNodo.addEventListener("click", añadirNodo);
  btnReiniciar.addEventListener("click", reiniciar);
  btnDescargar.addEventListener("click", loadAllFirebase);
  btnGuardar.addEventListener("click", guardarDataset);
  btnCargar.addEventListener("click", cargarDataset);
  btnGenerarMatriz.addEventListener("click", generarMatriz);
  
  var network = new Network(container, data, options);
  async function guardarDataset() {
    //GUARDAR NODOS
    let nodesArray = network.getPositions();
    let nodesTest = [];
    nodes.forEach((node) => {
      let nodeData = {
        label: node.label,
        id: node.id,
      };
      nodesArray[node.id] = Object.assign(nodeData, nodesArray[node.id]);
      nodesTest.push(nodesArray[node.id]);
    });
    //GUARDAR EDGES
    let edgesArray = [];

    edges.forEach((edge) => {
      edgesArray.push(edge);
    });

    let fileName = await modalText(
      "Ingresa un nombre para el archivo",
      "info",
      "text",
      "Nombre del proyecto"
    );
    if (fileName) {
      let project = {
        id: shortid.generate(),
        name: fileName,
        data: {
          nodes: nodesTest,
          edges: edgesArray,
        },
        timestamp: new Date().toLocaleDateString(),
      };

      console.log(project);
      saveFirebase(project);
      Swal.fire({
        title: "Exito al guardar!",
        icon: "success",
        timer: 3000,
        text: "El proyecto a sido guardado exitosamente",
      });
      projectName.innerHTML = project.name;
      localStorage.setItem("project", JSON.stringify(project));
    } else {
      modalError("Error al guardar el archivo");
    }
  }

  function saveFirebase(project) {
    database.ref("projects/" + project.id).set(project);
  }

  function loadAllFirebase(project) {
    const dbRef = database.ref("projects/");
    dbRef
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
        } else {
          modalError("No existen proyectos");
        }
      })
      .catch((error) => {
        modalError("Error al cargar \n Ref:" + error);
      });
  }

  function cargarDataset() {
    nodes.clear();
    edges.clear();

    let nodesArray = JSON.parse(localStorage.getItem("nodes"));
    let edgesArray = JSON.parse(localStorage.getItem("edges"));

    nodesArray.forEach((nodeSaved) => {
      nodes.add({
        id: nodeSaved.id,
        label: nodeSaved.label,
      });
      network.moveNode(nodeSaved.id, nodeSaved.x, nodeSaved.y);
    });

    edgesArray.forEach((edgeSaved) => {
      edges.add(edgeSaved);
    });

    console.log(edges);
    network.redraw();
  }

  async function modalText(title, icon, input, place) {
    const { value: valorEdge } = await Swal.fire({
      title: title,
      icon: icon,
      input: input,
      inputPlaceholder: place,
      confirmButtonColor: "#eeda7c",
      allowOutsideClick: false,
      timerProgressBar: true,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "Tienes que escribir un parametro valido!";
        else if (value == "") return "Tienes que escribir un parametro valido!";
      },
    });
    let aux = await valorEdge;

    return await aux;
  }

  function modalError(title) {
    Swal.fire({
      title: title,
      icon: "error",
      showCancelButton: true,
      timer: 3000,
      currentProgressStep: "s",
    });
  }

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
      // console.log("sida");
      nodes.add([
        {
          id: shortid.generate(),
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

    console.log("Hasta aqui ");
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
    console.log(final);
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

  cargarDataset();
  return element;
};
