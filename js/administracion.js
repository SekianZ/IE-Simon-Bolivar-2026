function colocarEstads() {
    const bloquesCant = document.getElementById("totalBloques");
    const estudiantesCant = document.getElementById("totalEstudiantes");
    const asistenciasCant = document.getElementById("totalAsistencias");

    const arrayConsultas = ['bloque', 'estudiantes', 'asistencia'];

    arrayConsultas.forEach(element => {
        fetch(`backend/opciones.php?accion=conseguirEstads&tipo=${element}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(`Error en la consulta de ${element}: ${data.error}`);
                    return;
                }

                const cantidad = data[`total_${element}`];
                
                if (element === 'bloque') {
                    bloquesCant.textContent = cantidad;
                } else if (element === 'estudiantes') {
                    estudiantesCant.textContent = cantidad;
                } else if (element === 'asistencia') {
                    asistenciasCant.textContent = cantidad;
                }
            })
            .catch(error => {
                console.error("Error en la solicitud fetch:", error);
            });
    });
}



document.addEventListener('DOMContentLoaded', () => {
    colocarEstads();
});
