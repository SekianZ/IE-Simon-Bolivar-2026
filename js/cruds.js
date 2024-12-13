
/*-----------------------------------------------------------------------------------------*/

async function procesarFormulario(accion, tipo, datos, formularioHTML = null, usarSwal = true, paraDatos = false) {
    let respuesta;
    // Crear formulario
    const formulario = await crearFormulario(accion, tipo, datos);

    if (paraDatos) {
        respuesta = await enviarformulario(formulario);
        return respuesta;
    } else {
        // Validar formulario
        const confirmacion = await validarFormulario(formularioHTML, usarSwal);

        if (confirmacion) {
            // Enviar formulario
            respuesta = await enviarformulario(formulario);
            // Retornar respuesta
            const respuesta2 = await retornarRespuesta(respuesta, usarSwal);

            return respuesta2
        }
    }

}

async function enviarformulario(formulario) {
    try {
        const response = await fetch('backend/opciones.php', {
            method: 'POST',
            body: formulario
        });

        const textoRespuesta = await response.text(); // Obtiene la respuesta como texto
        console.log('Respuesta del servidor:', textoRespuesta); // Muestra la respuesta

        let resultado;

        // Intenta parsear la respuesta como JSON
        try {
            resultado = JSON.parse(textoRespuesta);
        } catch (e) {
            // Si hay un error, significa que la respuesta no es un JSON válido
            console.error('La respuesta no es un JSON válido, se tratará como un array:', textoRespuesta);
            resultado = textoRespuesta; // Utiliza la respuesta original si no se puede parsear
        }

        // Verifica si es un array de alumnos
        if (Array.isArray(resultado)) {
            console.log('Se recibió un array');
            return resultado; // Retorna el array de alumnos
        }

        // Verifica si el resultado es un objeto con 'success' y 'mensaje'
        if (typeof resultado === 'object' && resultado !== null && 'success' in resultado) {
            if (resultado.success) {
                console.log('Formulario enviado correctamente');
                return resultado;  // Retorna los datos si fue exitoso
            } else {
                console.error('Error al enviar formulario:', resultado.mensaje);
                return false;  // Retorna false si hubo un error
            }
        }

        // Si no se cumple ninguna de las condiciones anteriores, muestra un error
        console.error('Formato de respuesta inesperado:', resultado);
        return false; // Retorna false si el formato no es esperado

    } catch (error) {
        console.error('Error en la solicitud:', error);
        return false;  // Retorna false si ocurre un error en la solicitud
    }
}


async function validarFormulario(formularioHTML = null, usarSwal = false) {
    const errores = [];

    // Verifica si formularioHTML no es null
    if (formularioHTML !== null) {
        formularioHTML.querySelectorAll('input, textarea, select').forEach(campo => {
            // Validar campos de tipo input, textarea y select
            if (campo.hasAttribute('required')) {
                // Verificar los campos input y textarea
                if (campo.type !== 'select-one' && campo.value.trim() === "") {
                    errores.push(`El campo '${campo.name}' es obligatorio.`);
                }

                // Verificar los campos select
                if (campo.type === 'select-one' && campo.value.trim() === "" || campo.value === "Seleccione...") {
                    errores.push(`El campo '${campo.name}' es obligatorio.`);
                }
            }

            // Validar si el campo es un correo electrónico
            if (campo.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campo.value)) {
                errores.push(`El campo '${campo.name}' debe ser un correo electrónico válido.`);
            }
        });

        // Mostrar errores con Swal si hay errores y usarSwal es verdadero
        if (errores.length > 0 && usarSwal) {
            await Swal.fire({
                icon: "error",
                title: "Errores en el formulario",
                html: `<ul>${errores.map(error => `<li>${error}</li>`).join('')}</ul>`,
                showConfirmButton: true
            });
        }

        // Si hay errores, retornar false
        if (errores.length > 0) return false;
    }

    // Preguntar confirmación para enviar el formulario si se usa Swal
    if (usarSwal) {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Estás a punto de realizar esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, hazla',
            cancelButtonText: 'Cancelar'
        });

        return result.isConfirmed; // Retorna true si se confirma
    }

    return true; // Si no se usan Swal, se puede enviar
}

async function retornarRespuesta(respuesta, usarSwal) {
    if (typeof respuesta === 'object' && respuesta !== null && 'success' in respuesta) {
        if (respuesta.success) {
            if (usarSwal) {
                await Swal.fire({
                    icon: "success",
                    title: "Éxito",
                    text: "Acción completada",
                    showConfirmButton: true
                });
            }
            console.log(respuesta);
            return true;  // Retorna true si fue exitoso
        } else {
            if (usarSwal) {
                await Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: respuesta.mensaje || "Error en la acción",
                    showConfirmButton: true
                });
            }
            return false; // Retorna false si hubo un error
        }
    } else {
        if (usarSwal) {
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error en la acción",
                showConfirmButton: true
            });
        }
        return false; // Retorna false si no es un objeto válido
    }
}


async function crearFormulario(accion, tipo, datos) {
    const formulario = new FormData();

    // Agrega campos comunes
    formulario.append('accion', accion);
    formulario.append('tipo', tipo);

    // Agrega los datos específicos que se pasen
    for (const key in datos) {
        if (datos.hasOwnProperty(key)) {
            // Si el dato es un array, añade cada elemento
            if (Array.isArray(datos[key])) {
                datos[key].forEach(value => {
                    formulario.append(`datos[${key}][]`, value); // Agregar cada día como un elemento separado
                });
            } else {
                formulario.append(`datos[${key}]`, datos[key]);
            }
        }
    }

    return formulario;
}

//*****************************PROCESOS************************* */

async function resetBloques() {
    document.getElementById("formularioagregarBloque").reset();
    document.getElementById("formularioEditarbloque").reset();
    document.getElementById("formularioEliminarbloque").reset();
}

/* *****************************BLOQUES********************** */
// Ejemplo de uso de manejarFormulario para agregar un nuevo bloque
async function btnAgregarBloque() {
    const nameB = document.getElementById("NombreBloque").value; // Obtener el valor
    const selectB = Array.from(document.getElementById("DiasBloque").selectedOptions).map(option => option.value);

    console.log(nameB, selectB); // Verifica que se obtienen los días correctamente

    const formularioHTML = document.getElementById("formularioagregarBloque");
    const respuesta = await procesarFormulario('agregar', 'bloque', { nameB: nameB, dias: selectB }, formularioHTML);
    console.log(respuesta);
    if (respuesta) {
        await colocarbloques();
        await resetBloques();
    }
}

// Ejemplo de uso de btnActualizarBloque para editar un bloque
async function btnActualizarBloque() {
    const id_bloque = document.getElementById("bloqueeditar").value;
    const newnameB = document.getElementById("newNombreBloque").value; // Obtener el nuevo nombre del bloque
    const newSelectB = Array.from(document.getElementById("newDiasBloque").selectedOptions).map(option => option.value); // Obtener los nuevos días seleccionados
    console.log(id_bloque, newnameB, newSelectB); // Imprimir para verificar

    const formularioHTML = document.getElementById("formularioEditarbloque");

    // Procesar el formulario con los nuevos valores
    const respuesta = await procesarFormulario('actualizar', 'bloque', { newnameB: newnameB, id_bloque: id_bloque, newSelectB: newSelectB }, formularioHTML);
    if (respuesta) {
        await colocarbloques();
        await resetBloques();
    }
}

async function btnEliminarBloque() {
    let respuesta2 = false;
    const id_bloque = document.getElementById('selectBloquesE').value;
    const formularioHTML = document.getElementById("formularioEliminarbloque");
    await Swal.fire({
        title: 'Cuidado',
        text: "Eliminaras los alumnos de este bloque,No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, lo sé',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            respuesta2 = true;
        }
    });
    if (respuesta2) {
        const respuesta = await procesarFormulario('eliminar', 'bloque', { id_bloque: id_bloque }, formularioHTML);
        if (respuesta) {
            await colocarbloques();
            await resetBloques();
        }
    }
}

/******************************BLOQUES********************** */

/******************************ESTUDIANTE********************** */
async function btnAgregarEstudiante() {
    const nameE = document.getElementById("NombreEstudiante").value;
    const correo = document.getElementById("CorreoEstudiante").value;
    const bloqueid = document.getElementById("bloqueEstudianteid").value;
    const descripcionEstudiante = document.getElementById("descripcionEstudiante").value;
    const formularioHTML = document.getElementById("formularioAgregarEstudiante");

    const respuesta = await procesarFormulario('agregar', 'estudiante', { nameE: nameE, correo: correo,descripcion: descripcionEstudiante, id_bloque: bloqueid }, formularioHTML);
    if (respuesta) {
        await colocarEstudiantes();
        document.getElementById("formularioAgregarEstudiante").reset();
    }
    await valorbloquesestudiantes();
}

async function btnActualizarEstudiante(id, newnameE, newcorreo, newid_bloque, newdescriptionEstudiante) {
    console.log(id);
    console.log(newnameE);
    console.log(newcorreo);
    console.log(newid_bloque);
    console.log(newdescriptionEstudiante);
    const respuesta = await procesarFormulario('actualizar', 'estudiante', { id_estudiante: id, newnameE: newnameE,newdescripcion: newdescriptionEstudiante, newcorreo: newcorreo, newid_bloque: newid_bloque });
    if (respuesta) {
        await colocarEstudiantes();
        document.getElementById("formularioAgregarEstudiante").reset();
    }
    await valorbloquesestudiantes();
}

async function btnEliminarEstudiante(id) {
    const respuesta = await procesarFormulario('eliminar', 'estudiante', { id_estudiante: id });
    if (respuesta) {
        await colocarEstudiantes();
        document.getElementById("formularioAgregarEstudiante").reset();
    }
    await valorbloquesestudiantes();
}
/*********************************LISTADO******************************* */
