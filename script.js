// Obtener los elementos del DOM
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const submitButton = document.getElementById("submit");
const messageParagraph = document.getElementById("message");
const formDiv = document.querySelector(".form");
const gridDiv = document.querySelector(".grid");
const counterParagraph = document.getElementById("counter");
const cells = document.querySelectorAll(".cell");

// Definir algunas variables globales
let name = "";
let email = "";
let attempts = 3;
let winner = false;

// Definir una función para leer el archivo CSV
function readCSV() {
  // Crear un objeto XMLHttpRequest para hacer una petición al servidor
  const xhr = new XMLHttpRequest();
  // Abrir la petición con el método GET y la ruta del archivo CSV
  xhr.open("GET", "data.csv");
  // Enviar la petición
  xhr.send();
  // Escuchar el evento load que se dispara cuando la petición se completa
  xhr.onload = function () {
    // Si el estado de la petición es 200 (OK)
    if (xhr.status === 200) {
      // Obtener el texto de la respuesta
      const response = xhr.responseText;
      // Dividir el texto por saltos de línea para obtener un array de filas
      const rows = response.split("\n");
      // Recorrer el array de filas
      for (let i = 0; i < rows.length; i++) {
        // Dividir cada fila por comas para obtener un array de columnas
        const columns = rows[i].split(",");
        // Obtener el nombre y el correo de cada fila
        const rowName = columns[0];
        const rowEmail = columns[1];
        // Si el nombre y el correo coinciden con los del usuario
        if (rowName === name && rowEmail === email) {
          // Mostrar un mensaje de que ya participó y no puede volver a participar
          messageParagraph.textContent =
            "Ya participaste y no puedes volver a participar.";
          // Deshabilitar el botón de enviar
          submitButton.disabled = true;
          // Salir del bucle
          break;
        }
      }
    }
  };
}

// Definir una función para escribir en el archivo CSV
function writeCSV() {
  // Crear un objeto XMLHttpRequest para hacer una petición al servidor
  const xhr = new XMLHttpRequest();
  // Abrir la petición con el método POST y la ruta del archivo PHP que se encarga de escribir en el CSV
  xhr.open("POST", "write.php");
  // Establecer el tipo de contenido de la petición como application/x-www-form-urlencoded
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  // Crear una cadena con los datos del usuario separados por comas y codificados para URL
  const data = encodeURIComponent(
    name + "," + email + "," + winner + "," + !winner
  );
  // Enviar la petición con los datos como cuerpo
  xhr.send(data);
}

// Definir una función para mostrar la cuadrícula y ocultar el formulario
function showGrid() {
  // Añadir una clase de animación al formulario
  formDiv.classList.add("fade-out");
  // Escuchar el evento de transición que se dispara cuando termina la animación
  formDiv.addEventListener("transitionend", function () {
    // Ocultar el formulario
    formDiv.hidden = true;
    // Mostrar la cuadrícula con un efecto de transición dinámica
    gridDiv.hidden = false;
    gridDiv.classList.add("fade-in");
  });
}

// Definir una función para actualizar el contador de oportunidades
function updateCounter() {
  // Restar uno al número de intentos
  attempts--;
  // Si quedan intentos
  if (attempts > 0) {
    // Mostrar el número de intentos que quedan en el párrafo del contador
    counterParagraph.textContent = "Te quedan " + attempts + " oportunidades.";
  } else {
    // Mostrar un mensaje de que se acabaron los intentos en el párrafo del contador
    counterParagraph.textContent = "Se acabaron tus oportunidades.";
    // Deshabilitar todos los cuadros para que no se puedan clicar más
    for (let i = 0; i < cells.length; i++) {
      cells[i].disabled = true;
    }
    // Escribir en el archivo CSV los datos del usuario y el resultado del juego
    writeCSV();
  }
}

// Definir una función para manejar el clic en un cuadro
function handleClick(event) {
  // Obtener el cuadro que se ha clicado
  const cell = event.target;
  // Generar un número aleatorio entre 0 y 100
  const random = Math.floor(Math.random() * 100);
  // Si el número es menor que 5 (5% de probabilidad)
  if (random < 5) {
    // Añadir una clase de ganador al cuadro
    cell.classList.add("winner");
    // Mostrar el texto de "Ganaste" en el cuadro
    cell.textContent = "Ganaste";
    // Establecer la variable de ganador a true
    winner = true;
    // Deshabilitar todos los cuadros para que no se puedan clicar más
    for (let i = 0; i < cells.length; i++) {
      cells[i].disabled = true;
    }
    // Escribir en el archivo CSV los datos del usuario y el resultado del juego
    writeCSV();
  } else {
    // Añadir una clase de perdedor al cuadro
    cell.classList.add("loser");
    // Mostrar el texto de "Perdiste" en el cuadro
    cell.textContent = "Perdiste";
    // Actualizar el contador de oportunidades
    updateCounter();
  }
}

// Escuchar el evento de clic en el botón de enviar
submitButton.addEventListener("click", function () {
  // Obtener el valor de los campos de nombre y correo
  name = nameInput.value;
  email = emailInput.value;
  // Si el nombre y el correo no están vacíos
  if (name && email) {
    // Leer el archivo CSV para comprobar si el usuario ya participó
    readCSV();
    // Mostrar la cuadrícula y ocultar el formulario
    showGrid();
  } else {
    // Mostrar un mensaje de que se deben rellenar los campos
    messageParagraph.textContent =
      "Debes rellenar los campos de nombre y correo.";
  }
});

// Escuchar el evento de clic en cada cuadro de la cuadrícula
for (let i = 0; i < cells.length; i++) {
  cells[i].addEventListener("click", handleClick);
}