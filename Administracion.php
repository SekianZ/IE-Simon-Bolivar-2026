<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administracion DataBase</title>
    <link rel="stylesheet" href="styles/administracion.css">
    <link rel="stylesheet" href="styles/crud-bloques.css">
    <link rel="stylesheet" href="styles/crud-alumnos.css">
    <link rel="stylesheet" href="styles/crud-asistencia.css">
</head>

<body>
        <div class="header">
            <img src="multimedia/logoSimonBolivar.png" alt="logo" class="logo">

            <nav id="navbar" class="navbar">
                <ul class="menu">
                    <li><a href="#" onclick="mostrarContenido('Inicio')">INICIO</li>
                    <li><a href="#" onclick="mostrarContenido('Bloques')">BLOQUES</a></li>
                    <li><a href="#" onclick="mostrarContenido('Estudiantes')">ALUMNOS</a></li>
                </ul>
            </nav>
            <button type="button" id="regresar" class="regresar" onclick="window.location.href='index.php'">Regresar</button>

        </div>
    <div class="contenido-principal">
        <section id="Inicio" style="display: block;">
            <div class="shooting-star"></div>
            <div class="shooting-star"></div>
            <div class="shooting-star"></div>
            <div class="shooting-star"></div>
            <div class="light-top-right"></div>
            <h1>Bienvenido a la Administración de Base de Datos</h1>
            <p>Aquí puedes gestionar bloques, estudiantes y asistencias.</p>
            <div id="resumen">
                <h3>Estadísticas Rápidas:</h3>
                <ul>
                    <li>Total de Bloques: <span id="totalBloques">0</span></li>
                    <li>Total de Estudiantes: <span id="totalEstudiantes">0</span></li>
                    <li>Total de Asistencias Registradas: <span id="totalAsistencias">0</span></li>
                </ul>
            </div>
            <button class="boton-Inicio boton-1" onclick="mostrarContenido('Bloques')"><span>Ir a Gestión de Bloques</span></button>
            <button class="boton-Inicio boton-2" onclick="mostrarContenido('Estudiantes')">Ir a Gestión de Estudiantes</button>

            <section id="noticias" style="display: block;">
                <h2>Noticias Recientes</h2>
                <ul>
                    <li><a href="#">Nuevo bloque agregado: 'Matemáticas Avanzadas'</a></li>
                    <li><a href="#">Se registraron 10 nuevos estudiantes</a></li>
                    <li><a href="#">Actualización en el sistema de asistencia</a></li>
                </ul>
            </section>


        </section>

        <section id="Bloques">
            <div class="raya-izquierda-2"></div>
            <div class="raya-derecha-2"></div>
            <h1>CRUD BLOQUES</h1>
        
            <div class="contenido-principal">
                <div class="contenido-izquierda">
                    <!-- Formularios de Agregar y Actualizar Bloques -->
                    <h2>Agregar Bloque</h2>
                    <form id="formularioagregarBloque" onsubmit="event.preventDefault()">
                        <label>Escriba el nombre del bloque:</label>
                        <input type="text" id="NombreBloque" name="NombreBloque" placeholder="Nombre del Bloque" required><br>
                        <select id="DiasBloque" name="DiasBloque" multiple></select><br>
                        <button type="button" onclick="btnAgregarBloque()">Agregar Bloque</button>
                    </form>
        
                    <h2>Actualizar Bloque</h2>
                    <form id="formularioEditarbloque" onsubmit="event.preventDefault();">
                        <select id="bloqueeditar" name="bloqueeditar"></select>
                        <input type="text" id="newNombreBloque" name="newNombreBloque" placeholder="Nuevo Nombre del Bloque" required>
                        <select id="newDiasBloque" name="newDiasBloque" multiple></select>
                        <button type="button" onclick="btnActualizarBloque()">Actualizar Bloque</button>
                    </form>
                </div>
        
                <div class="contenido-derecha">
                    <div class="tablabloques">
                        <h2>Lista de Bloques</h2>
                        <table id="tablaBloques">
                            <thead>
                                <tr>
                                    <th>Nombre del Bloque</th>
                                    <th>Días del Bloque</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Aquí se llenará la tabla automáticamente -->
                            </tbody>
                        </table>
                    </div>
        
                    <!-- Formulario de eliminación de bloque -->
                    <div class="eliminar-bloque">
                        <h2>Eliminar Bloque</h2>
                        <form id="formularioEliminarbloque" onsubmit="event.preventDefault();">
                            <select id="selectBloquesE" name="selectBloquesE"></select>
                            <button type="button" onclick="btnEliminarBloque()">Eliminar Bloque</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
        
        <section id="Estudiantes" style="display: none;">
            <h1>CRUD ESTUDIANTES</h1>
        
            <!-- Contenedor superior con formulario y tabla -->
            <div class="superior-container">
                <!-- Formulario de agregar estudiante (parte superior izquierda) -->
                <div class="formulario-container">
                    <h2>Agregar Estudiante</h2>
                    <form id="formularioAgregarEstudiante" onsubmit="event.preventDefault();">
                        <input type="text" id="NombreEstudiante" name="NombreEstudiante" placeholder="Nombre del Estudiante" required>
                        <input type="email" id="CorreoEstudiante" name="CorreoEstudiante" placeholder="Correo del Estudiante" required>
                        <select id="bloqueEstudianteid" name="bloqueEstudianteid">
                            <!-- Opciones de bloques -->
                        </select>
                        <button type="button" onclick="btnAgregarEstudiante()"><strong><span>Agregar Estudiante</span></strong></button>
                    </form>
                </div>
        
                <!-- Tabla de estudiantes (parte superior derecha) -->
                <div class="tabla-estudiantes-container">
                    <h2>Lista de Estudiantes</h2>
                    <table id="tablaEstudiantes">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Actualizar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Se llenará dinámicamente -->
                        </tbody>
                    </table>
                </div>
            </div>
        
            <!-- Contenedor de bloque y asistencia -->
            <div class="bloque-asistencia-container">
                <label for="bloque">Seleccione un bloque:</label>
                <select name="bloqueEstudiantes" id="bloqueEstudiantes">
                    <option value="">Seleccione...</option>
                    <!-- Opciones de bloques -->
                </select>
                <button type="button" onclick="menuasistencia()">Mostrar Asistencia</button>
            </div>
        
            <!-- Relleno de estadísticas (parte inferior) -->
            <div class="estadisticas-container">
                <h2>Estadísticas de <span id="nombre-estudiante"></span></h2>
                <div class="estadisticas-box">
                    <div class="estadistica-item">
                        <h4>Asistencias</h4>
                        <p id="asistencias">0</p>
                    </div>
                    <div class="estadistica-item">
                        <h4>Faltas</h4>
                        <p id="faltas">0</p>
                    </div>
                    <div class="estadistica-item">
                        <h4>Tardanzas</h4>
                        <p id="tardanzas">0</p>
                    </div>
                </div>
                <div class="detalles-adicionales">
                    <h4>Detalles adicionales</h4>
                    <p>Correo: <span id="correo"></span></p>
                    <p>Bloque: <span id="bloque"></span></p>
                </div>
            </div>
        </section>
        

        <section id="asistencia" style="display: none;">
            <h1>Registro de Asistencias</h1>
            <button type="button" onclick="regresar()">Regresar</button>

            <div id="contenedorControles"></div>
            <!-- Selector de meses -->
            <label for="month">Seleccionar Mes:</label>
            <select id="month" multiple>
                <option value="enero">Enero</option>
                <option value="febrero">Febrero</option>
                <option value="marzo">Marzo</option>
                <!-- Agregar más meses según sea necesario -->
            </select>
            <button onclick="mostrarAsistencias()">Mostrar Asistencias</button>
            <button onclick="imprimirAsistencias()">Imprimir</button>

            <div id="contenedorAsistencias"></div>
        </section>

    </div>


    <script src="./js/estadisticas_estudiantes.js"></script>
    <script src="backend/jslibrerias/sweetalert2.all.min.js"></script>
    <script src="./js/cruds_acciones.js"></script>
    <script src="./js/cruds.js"></script> <!-- Asegúrate de cambiar la ruta según tu estructura -->
    <script src="./js/administracion.js"></script>
</body>

</html>