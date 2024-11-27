// Función para enviar el correo
async function enviarCorreo(event) {
    event.preventDefault();

    const form = document.getElementById('correoForm');
    const formData = new FormData(form);
    const button = document.getElementById('enviarCorreo');
    const editorContent = document.getElementById('mensaje').innerHTML;
    formData.append('editorContent', editorContent);

    if (!validarFormularioCorreo()) return;

    deshabilitarBoton(button);

    const destinatarios = Array.from(document.getElementById('para').selectedOptions).map(option => option.value);
    const total = destinatarios.length;


    // Inicializar SweetAlert y mantener la instancia
    let swalInstance = Swal.fire({
        icon: "info",
        title: 'Enviando correos...',
        html: `
            <img src="multimedia/cargar.gif" alt="Cargando..." style="width: 1px; height: 1px;">
            <div>Enviando a <b>0 de ${total}</b> destinatarios</div>
        `,
        allowOutsideClick: false,
        showConfirmButton: false,
    });



    let enviados = 0;

    // Enviar correos de manera secuencial
    for (let destinatario of destinatarios) {
        const dataToSend = new FormData();
        formData.forEach((value, key) => dataToSend.append(key, value));
        dataToSend.set('para[]', destinatario);

        try {
            const response = await fetch('../IESimonBolivar2026-Version1.0/backend/servidor.php', {
                method: 'POST',
                body: dataToSend
            });
            const data = await response.json();

            if (data.success) {
                enviados++;
                // Actualizar el contenido del SweetAlert con el GIF
                await swalInstance.update({
                    html: `
                        <img src="multimedia/cargar.gif" alt="Cargando..." style="width: 100px; height: 100px;">
                        <div>Enviando a <b>${enviados} de ${total}</b> destinatarios</div>
                    `,
                    allowOutsideClick: false,
                    showConfirmButton: false,
                });
            } else {
                console.error(`Error al enviar a ${destinatario}: ${data.message}`);
            }
        } catch (error) {
            console.error('Error al procesar la respuesta:', error.message);
        }
    }

    habilitarBoton(button);

    // Mostrar mensaje final de éxito
    await Swal.fire({
        icon: 'success',
        title: '¡Correos enviados!',
        text: `Se enviaron ${enviados} correos exitosamente`,
        showConfirmButton: true // Mostrar el botón de confirmación
    });

    window.location.reload(); // Recargar la página después de mostrar el mensaje
}





document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('enviarCorreo').addEventListener('click', enviarCorreo);
});

//Validacion
function validarFormularioCorreo() {
    const contenttext = document.getElementById('mensaje').innerHTML.trim();
    const alumno = document.getElementById('para').selectedOptions; // Para obtener las opciones seleccionadas del select

    // Validar que el contenido del mensaje no esté vacío
    if (!contenttext) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo enviar el correo, falta colocar el mensaje",
            showConfirmButton: true
        }).then(result => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        });
        return false; // Evita el envío del formulario
    }

    // Validar que al menos un alumno esté seleccionado
    if (alumno.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo enviar el correo, falta seleccionar un alumno minimo",
            showConfirmButton: true
        }).then(result => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        });
        return false; // Evita el envío del formulario
    }

    return true; // Si todo es válido
}

function deshabilitarBoton(button) {
    // Deshabilitar el botón y cambiar el texto
    button.disabled = true;
    button.textContent = 'Enviando...';

    // Cambiar el cursor a "cargando"
    button.style.cursor = 'progress';

    // Mantener el color del botón en gris
    button.style.backgroundColor = 'gray';
    button.style.color = 'white'; // Cambiar el color del texto a blanco para contraste
}

function habilitarBoton(button) {
    button.disabled = false;
    button.textContent = 'Enviar'; // Restaurar el texto del botón
}

function manejarRespuesta(data) {
    if (data.success) {
        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Correo enviado exitosamente.",
            allowOutsideClick: false,
            showConfirmButton: true
        }).then(result => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo enviar el correo, faltan datos por llenar",
            showConfirmButton: true
        }).then(result => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        });
    }
}

function manejarError(error) {
    console.error('Error:', error);
    Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error de logica",
        showConfirmButton: true
    }).then(result => {
        if (result.isConfirmed) {
            window.location.reload();
        }
    });
}
//Busqueda de alumnos
function filtrarAlumnos() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const selectElement = document.getElementById('para');
    const options = selectElement.getElementsByTagName('option');

    for (let i = 0; i < options.length; i++) {
        const optionText = options[i].textContent.toLowerCase();
        options[i].style.display = optionText.includes(searchInput) ? '' : 'none';
    }
}

function actualizarPrevisualizacion() {
    const editor = document.getElementById('mensaje');
    const preview = document.getElementById('preview');

    // Obtener el contenido del editor
    let contenido = editor.innerHTML;

    // Reemplazar {estudiante} por <strong>Estudiante</strong>
    contenido = contenido.replace(/{estudiante}/g, '<strong>Estudiante</strong>');

    // Actualizar el contenido de previsualización
    preview.innerHTML = contenido;
}

// Maneja el checkbox de seleccionar todos los estudiantes
function manejarSeleccionTodos() {
    const seleccionarTodosCheckbox = document.getElementById('seleccionar-todos');
    const selectElement = document.getElementById('para');

    seleccionarTodosCheckbox.addEventListener('change', function () {
        const opciones = selectElement.querySelectorAll('option');
        const estaSeleccionado = this.checked;
        opciones.forEach(opcion => {
            opcion.selected = estaSeleccionado;
            opcion.style.backgroundColor = estaSeleccionado ? '#22475f' : ''; // Cambia el color de fondo
            opcion.style.color = estaSeleccionado ? 'white' : ''; // Cambia el color del texto
        });
    });
}

// Actualiza colores y checkboxes, etc.
function actualizarOpciones() {
    const checkboxes = document.querySelectorAll('#bloques input[type="checkbox"]:checked');
    const bloquesSeleccionados = Array.from(checkboxes).map(checkbox => checkbox.value);
    const para = document.getElementById('para'); // Definir la variable `para`

    // Si no hay bloques seleccionados, limpiar el select
    if (bloquesSeleccionados.length === 0) {
        para.innerHTML = '';
        return;
    }

    const formData = new FormData();
    formData.append('accion', 'listarpB');
    formData.append('tipo', 'estudiante');
    formData.append('datos[bloques]', bloquesSeleccionados.join(',')); // Directamente como JSON

    fetch('backend/opciones.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            para.innerHTML = ''; // Limpiar el select antes de agregar nuevas opciones
            data.forEach(alumno => {
                const optionElement = document.createElement('option');
                optionElement.value = `${alumno.nombre}|${alumno.correo}`;
                optionElement.textContent = alumno.nombre;
                para.appendChild(optionElement);
            });

            // Aplicar estilos personalizados a las opciones seleccionadas
            para.addEventListener('change', function () {
                const opciones = para.querySelectorAll('option');
                opciones.forEach(opcion => {
                    if (opcion.selected) {
                        opcion.style.backgroundColor = '#22475f'; // Color de fondo para opción seleccionada
                        opcion.style.color = 'white'; // Color del texto para opción seleccionada
                    } else {
                        opcion.style.backgroundColor = ''; // Restablecer color de fondo
                        opcion.style.color = ''; // Restablecer color del texto
                    }
                });
            });

            // Llamar a `manejarSeleccionTodos` para inicializar el manejo del checkbox de seleccionar todos
            manejarSeleccionTodos();
        })
        .catch(error => {
            console.error('Error al obtener los datos del estudiante:', error);
        });
}

// Actualiza la previsualización


function manejarCambioPredefinido(selectElement, editorElement) {
    const selectedOption = selectElement.value;

    if (selectedOption !== 'default') {
        editorElement.innerHTML = selectedOption; // Inserta el mensaje en el div editable
    } else {
        limpiarTextArea(editorElement); // Limpia el contenido del div editable
    }

    // Actualizar la previsualización después de cambiar el mensaje predefinido
    actualizarPrevisualizacion();
}

// Función para cargar los mensajes predefinidos en el select
function cargarMensajesPredefinidos(selectElement) {
    fetch('backend/opciones.php?accion=listar&tipo=mensajes')
        .then(response => response.json())
        .then(data => {
            console.log("Datos recibidos del servidor:", data);
            data.forEach(mensaje => {
                agregarOpcionAlSelect(selectElement, mensaje);
            });
        })
        .catch(error => console.error('Error al cargar los mensajes predefinidos:', error));
}
// Función para agregar una opción al select
function agregarOpcionAlSelect(selectElement, mensaje) {
    const option = document.createElement('option');
    option.value = mensaje.msgP;
    option.text = mensaje.nombreM;
    selectElement.appendChild(option);
}


// Función para limpiar el textarea y permitir la edición
function limpiarTextArea(textAreaElement) {
    textAreaElement.value = ''; // Limpia el contenido
    textAreaElement.disabled = false; // Habilita el textarea
}

let optionsButtons = document.querySelectorAll(".option-button");
let advancedOptionButton = document.querySelectorAll(".adv-option-button");
let fontName = document.getElementById("fontName");
let fontSizeRef = document.getElementById("fontSize");
let fontName2 = document.getElementById("fontName2");
let fontSizeRef2 = document.getElementById("fontSize2");
let writingArea = document.getElementById("text-input");
let linkButton = document.getElementById("createLink");
let alignButtons = document.querySelectorAll(".align");
let spacingButtons = document.querySelectorAll(".spacing");
let formatButtons = document.querySelectorAll(".format");
let scriptButtons = document.querySelectorAll(".script");

//List of fontlist
let fontList = [
    "Arial",
    "Verdana",
    "Times New Roman",
    "Garamond",
    "Georgia",
    "Courier New",
    "cursive",
];

const setupEventListeners = (editor, fontName, fontSize) => {
    // Para las opciones básicas como negrita, cursiva, etc.
    optionsButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault(); // Evitar acciones predeterminadas
            modifyText(editor, button.id, false, null); // Asegúrate de que `editor` esté pasando correctamente
        });
    });

    // Cambiar la fuente
    fontName.addEventListener("change", () => {
        editor.focus(); // Asegurarse de que el editor esté enfocado antes de aplicar cambios
        document.execCommand("fontName", false, fontName.value);
    });

    // Cambiar el tamaño de fuente
    fontSize.addEventListener("change", () => {
        editor.focus(); // Enfoca el editor
        document.execCommand("fontSize", false, fontSize.value);
    });
};

//Initial Settings
const initializer = () => {
    // Poblar las opciones de tipo de letra
    fontList.forEach((value) => {
        let option1 = document.createElement("option");
        let option2 = document.createElement("option");
        option1.value = option2.value = value;
        option1.innerHTML = option2.innerHTML = value;
        fontName.appendChild(option1);
        fontName2.appendChild(option2);
    });

    // Poblar las opciones de tamaño de letra
    for (let i = 1; i <= 7; i++) {
        let option1 = document.createElement("option");
        let option2 = document.createElement("option");
        option1.value = option2.value = i;
        option1.innerHTML = option2.innerHTML = i;
        fontSizeRef.appendChild(option1);
        fontSizeRef2.appendChild(option2);
    }

    // Establecer fuente y tamaño predeterminado
    fontName.value = fontName2.value = "Arial";
    fontSizeRef.value = fontSizeRef2.value = 3;

    // Configurar los event listeners para ambas áreas de texto
    setupEventListeners(document.getElementById("mensaje"), fontName, fontSizeRef);
    setupEventListeners(document.getElementById("mensajeP"), fontName2, fontSizeRef2);
};
//main logic
const modifyText = (command, defaultUi, value) => {
    //execCommand executes command on selected text
    document.execCommand(command, defaultUi, value);
};

//For basic operations which don't need value parameter
optionsButtons.forEach((button) => {
    button.addEventListener("click", () => {
        modifyText(button.id, false, null);
    });
});

//options that require value parameter (e.g colors, fonts)
advancedOptionButton.forEach((button) => {
    button.addEventListener("change", () => {
        modifyText(button.id, false, button.value);
    });
});

//link
linkButton.addEventListener("click", () => {
    let userLink = prompt("Enter a URL");
    //if link has http then pass directly else add https
    if (/http/i.test(userLink)) {
        modifyText(linkButton.id, false, userLink);
    } else {
        userLink = "http://" + userLink;
        modifyText(linkButton.id, false, userLink);
    }
});

//Highlight clicked button
const highlighter = (className, needsRemoval) => {
    className.forEach((button) => {
        button.addEventListener("click", () => {
            //needsRemoval = true means only one button should be highlight and other would be normal
            if (needsRemoval) {
                let alreadyActive = false;

                //If currently clicked button is already active
                if (button.classList.contains("active")) {
                    alreadyActive = true;
                }

                //Remove highlight from other buttons
                highlighterRemover(className);
                if (!alreadyActive) {
                    //highlight clicked button
                    button.classList.add("active");
                }
            } else {
                //if other buttons can be highlighted
                button.classList.toggle("active");
            }
        });
    });
};

const highlighterRemover = (className) => {
    className.forEach((button) => {
        button.classList.remove("active");
    });
};

window.onload = initializer();
document.getElementById("resetEditorButton").addEventListener("click", resetEditor);


function resetEditor() {
    // Limpiar el contenido del editor
    document.getElementById("mensaje").innerHTML = "";

    // También limpiar la previsualización del mensaje
    document.getElementById("preview").innerHTML = "";

    // Restablecer el archivo seleccionado, si es necesario
    document.getElementById("archivo").value = "";
    document.getElementById("file-name").textContent = "No se ha seleccionado ningún archivo";
}

function reseteditor2() {
    // Limpiar el contenido del editor
    document.getElementById("mensajeP").innerHTML = "";
}
