//Alternar el editar a editando y vicerversa y ocultar el boton de guardar
function alternarEdicion(campo) {
    const input = document.getElementById(campo);
    const boton = document.getElementById('editar-' + campo);
    const guardar = document.getElementById('guardar');
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"]');

    // Alternar habilitación del campo
    if (input.disabled) {
        input.disabled = false;
        boton.textContent = 'Cancelar';
    } else {
        input.disabled = true;
        boton.textContent = 'Editar';
    }

    // Verificar si al menos un campo está habilitado para edición
    let algunoEditable = Array.from(inputs).some(input => !input.disabled);

    // Mostrar u ocultar el botón de guardar según el estado del botón de edición
    if (boton.textContent === 'Cancelar') {
        guardar.style.display = algunoEditable ? 'inline' : 'none';
    } else {
        guardar.style.display = 'none';
    }
}

//guarda los cambios del profesor actualizado
function guardarCambios() {
    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const id = document.getElementById("ID").value;

    function VerificarCorreo(correo) {
        var stringcorreo = correo;
        var regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexCorreo.test(stringcorreo);
    }

    // Verificar si el correo es válido
    if (!VerificarCorreo(correo)) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Correo inválido",
            showConfirmButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Salir de la función guardarCambios
                return;
            }
        });
        return; // Asegúrate de que la función no continúe si el correo es inválido
    }

    const formData = new FormData();
    formData.append('accion', 'actualizar');
    formData.append('tipo', 'profesor');
    formData.append('datos[nombre]', nombre);
    formData.append('datos[correo]', correo);
    formData.append('datos[id]', id);

    fetch('backend/opciones.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(data => {
            console.log('Respuesta del servidor:', data);
            Swal.fire({
                icon: "success",
                title: "Éxito",
                text: "Datos actualizados correctamente",
                allowOutsideClick: false,
                showConfirmButton: true
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
            });

            // Deshabilitar campos después de guardar
            document.querySelectorAll('input[type="text"], input[type="email"]').forEach(function (input) {
                // Asegúrate de que el campo 'asunto' no se deshabilite
                if (input.id !== 'asunto') {
                    input.disabled = true;
                }
            });

            // Cambiar el texto del botón a 'Editar'
            document.querySelectorAll('button[id^="editar-"]').forEach(function (button) {
                button.textContent = 'Editar';
            });

            // Ocultar el botón de guardar
            document.getElementById('guardar').style.display = 'none';
        })
        .catch(error => console.error('Error:', error));

    actualizarDeCampo();
}

/* COLOCAR DATOS DEL PROFESOR Y ACTUALIZAR*/
//funcion para listar profesores
function listarprofesor() {
    fetch("backend/opciones.php?accion=listar&tipo=profesor")
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const profesor = data[0];
                document.getElementById('ID').value = profesor.id_profesor;
                document.getElementById('nombre').value = profesor.nombre;
                document.getElementById('correo').value = profesor.correo;
                actualizarDeCampo();
            }
        })
        .catch(error => console.error('Error al obtener los datos del profesor:', error));
}
//Actualizar el campo "de" donde aparece el gmail
function actualizarDeCampo() {
    const correo = document.getElementById('correo').value;
    document.getElementById('de').value = correo;
}

document.addEventListener('DOMContentLoaded', () => {
    listarprofesor();
    actualizarDeCampo();
});