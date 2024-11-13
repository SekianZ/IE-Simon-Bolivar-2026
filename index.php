<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="multimedia/logoSimonBolivar.png">
    <title>I.E Simón Bolívar 2026</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
    <!--Carpeta de Styles-->
    <link rel="stylesheet" href="styles/barralateral.css">
    <link rel="stylesheet" href="styles/cuenta.css">
    <link rel="stylesheet" href="styles/formulario.css">
    <link rel="stylesheet" href="styles/mensaje.css">
    <link rel="stylesheet" href="styles/asistencia.css">


</head>

<body>
    <video muted autoplay loop>
        <source src="./multimedia/cielo.mp4">
    </video>
    <div class="contenedor">
        <div class="barra-lateral"><!--BARRA-LATERAL-->
            <ul class="listado-principal">
                <li><img src="./multimedia/logoSimonBolivar.png" alt="Logo Simon Bolivar"></li>
                <li><a href="#" class="mostrarS" onclick="mostrarSeccion('cuenta')">CUENTA</a></li>
                <li><a href="#" class="mostrarS" onclick="mostrarSeccion('formulario')">FORMULARIO</a></li>
                <li><a href="#" class="mostrarS" onclick="mostrarSeccion('msjpredefinido')">MENSAJES</a></li>
                <li><a href="#" class="mostrarS" onclick="mostrarSeccion('asistencia')">ASISTENCIA</a></li>
                <li><a href="Administracion.php" class="mostrarS">CRUD</a></li>
            </ul>
        </div>
        <div class="barra-lateral2">
            <header>
                <div class="menu-icon" onclick="toggleMenu()">☰</div>
                <p>SIMON BOLIVAR 2026</p>
            </header>
            <nav id="listadoP">
                <div class="close-icon" onclick="toggleMenu()">CERRAR ✖</div>
                <img src="./multimedia/logoSimonBolivar.png" alt="Logo Simon Bolivar">
                <a href="#" class="mostrarS" onclick="mostrarSeccion('cuenta')">CUENTA</a>
                <a href="#" class="mostrarS" onclick="mostrarSeccion('formulario')">FORMULARIO</a>
                <a href="#" class="mostrarS" onclick="mostrarSeccion('msjpredefinido')">MENSAJES</a>
                <a href="#" class="mostrarS" onclick="mostrarSeccion('asistencia')">ASISTENCIA</a>
                <a href="Administracion.php" class="mostrarS">CRUD</a>
            </nav>
        </div>
        <div class="contenido-principal">
            <div id="cuenta" class="seccion-contenido"><!--CUENTA-->
                <h1 style="
                font-family: Calibri;
                font-size: 1.5em;
                background: #00386de8;
                color: white;
                text-align: center;
                border-radius: 5px;
                padding: 10px;
                box-sizing: border-box;
            ">PERFIL DE USUARIO</h1>
                <div class="form-cuenta">
                    <div class="seccion-perfil">
                        <div class="informacion-perfil">
                            <input type="hidden" id="ID" name="ID">
                            <h2 style="display: flex;justify-content: center;">Información Básica:</h2>
                            <p><strong class="nombreC">Nombre del docente</strong></p>
                            <div id="btn-nombreD">
                                <input type="text" id="nombre" disabled>
                                <button class="editar-nombre" id="editar-nombre" onclick="alternarEdicion('nombre')"
                                    required>Editar</button>
                            </div>
                            <p><strong class="correoE">Email</strong></p>
                            <div id="btn-correo">
                                <input type="email" id="correo" disabled>
                                <button class="editar-correo" id="editar-correo" onclick="alternarEdicion('correo')"
                                    required>Editar</button>
                            </div>
                        </div>
                        <button class="guardar-cambios" id="guardar" onclick="guardarCambios()">Guardar Cambios</button>
                    </div>
                </div>
            </div>
            <div id="formulario" class="seccion-contenido" style="display: none;"><!-- FORMULARIO -->
                <h3 style="
                font-family: Calibri;
                font-size: 1.5em;
                background: #00386de8;
                color: white;
                text-align: center;
                border-radius: 5px;
                padding: 10px;
                box-sizing: border-box;
            ">REDACCIÓN DEL CORREO</h3>
                <div id="correogod">
                    <form id="correoForm" action="/backend/servidor.php" method="POST" enctype="multipart/form-data">
                        <div class="form-container">
                            <label for="de"><strong class="remitente">Remitente:</strong></label>
                            <input type="email" id="de" name="de" required disabled>
                            <strong class="seleccion-bloque">Selecciona Bloques:</strong>
                            <div id="bloques"></div>
                            <div class="buscarAlum">
                                <label for="para" id="paraA"><strong class="destinatario">Destinatario:</strong></label>
                                <label for="search" id="buscarL"></label>
                                <input type="text" id="search" placeholder="Buscador..." onkeyup="filtrarAlumnos()">
                            </div>
                            <div class="select-all">
                                <label>
                                    <input type="checkbox" id="seleccionar-todos">
                                    <span class="checkbox"></span>
                                </label>
                                <strong class="seleccionT">Seleccionar todos</strong>
                            </div>
                            <select id="para" name="para[]" multiple required></select>
                            <div class="asunto-correo">
                                <label for="asunto" id="asuntO"><strong class="asuntoA">Asunto:</strong></label>
                                <input type="text" id="asunto" name="asunto" required>
                            </div>
                            <div class="mensajes-predefinidos">
                                <strong class="mensaje-p">Mensaje predefinido:</strong>
                                <select name="mpredefinido" id="mpredefinido">
                                    <option value="default">Ninguno</option>
                                </select>
                            </div>
                            <div class="editor-container">
                                <div class="editor-mensaje1">
                                    <div class="cabeza">
                                        <strong class="menu-opciones">Menú de opciones-fuente:</strong>
                                    </div>
                                    <div class="cuerpo">
                                        <select id="fontName" class="adv-option-button"></select><!--Fuente-->
                                        <select id="fontSize" class="adv-option-button"></select><!--Tamaño-->
                                        <div class="input-wrapper1"><!--Color-->
                                            <input type="color" id="foreColor" class="adv-option-button" />
                                            <label for="foreColor" class="colortexto">Color del texto</label>
                                        </div>
                                        <button type="button" id="bold" class="option-button format"><!--Negrita-->
                                            <i class="fa-solid fa-bold"></i>
                                        </button>
                                        <button type="button" id="italic" class="option-button format"><!--Cursiva-->
                                            <i class="fa-solid fa-italic"></i>
                                        </button>
                                        <button type="button" id="underline"
                                            class="option-button format"><!--Subrayado-->
                                            <i class="fa-solid fa-underline"></i>
                                        </button>
                                        <button type="button" id="strikethrough"
                                            class="option-button format"><!--Tachado-->
                                            <i class="fa-solid fa-strikethrough"></i>
                                        </button>
                                        <button type="button" id="subscript"
                                            class="option-button script"><!--Subíndice-->
                                            <i class="fa-solid fa-subscript"></i>
                                        </button>
                                        <button type="button" id="superscript"
                                            class="option-button script"><!--Superíndice-->
                                            <i class="fa-solid fa-superscript"></i>
                                        </button>
                                        <div class="input-wrapper2"><!--Resaltar-->
                                            <input type="color" id="backColor" class="adv-option-button" />
                                            <label for="backColor" class="resaltartexto">Resaltar texto</label>
                                        </div>
                                        <button type="button" id="insertUnorderedList"
                                            class="option-button"><!--Viñetas-->
                                            <i class="fa-solid fa-list"></i>
                                        </button>
                                        <button type="button" id="insertOrderedList"
                                            class="option-button"><!--Numeración-->
                                            <div class="fa-solid fa-list-ol"></div>
                                        </button>
                                        <button type="button" id="outdent"
                                            class="option-button spacing"><!--Disminuir sangría-->
                                            <i class="fa-solid fa-outdent"></i>
                                        </button>
                                        <button type="button" id="indent"
                                            class="option-button spacing"><!--Aumentar sangría-->
                                            <i class="fa-solid fa-indent"></i>
                                        </button>
                                        <button type="button" id="createLink" class="adv-option-button"><!--Crear URL-->
                                            <i class="fa fa-link"></i>
                                        </button>
                                        <button type="button" id="unlink" class="option-button"><!--Deshacer URL-->
                                            <i class="fa fa-unlink"></i>
                                        </button>
                                        <select id="formatBlock" class="adv-option-button"><!--Encabezado-->
                                            <option value="H1">H1</option>
                                            <option value="H2">H2</option>
                                            <option value="H3">H3</option>
                                            <option value="H4">H4</option>
                                            <option value="H5">H5</option>
                                            <option value="H6">H6</option>
                                        </select>
                                        <button type="button" id="justifyLeft"
                                            class="option-button align"><!--Alinear a la izquierda-->
                                            <i class="fa-solid fa-align-left"></i>
                                        </button>
                                        <button type="button" id="justifyCenter"
                                            class="option-button align"><!--Alinear al centro-->
                                            <i class="fa-solid fa-align-center"></i>
                                        </button>
                                        <button type="button" id="justifyRight"
                                            class="option-button align"><!--Alinear a la derecha-->
                                            <i class="fa-solid fa-align-right"></i>
                                        </button>
                                        <button type="button" id="justifyFull"
                                            class="option-button align"><!--Justificar-->
                                            <i class="fa-solid fa-align-justify"></i>
                                        </button>
                                        <button type="button" id="undo" class="option-button"><!--Deshacer-->
                                            <i class="fa-solid fa-rotate-left"></i>
                                        </button>
                                        <button type="button" id="redo" class="option-button"><!--Repetir-->
                                            <i class="fa-solid fa-rotate-right"></i>
                                        </button>
                                        <button type="button" id="resetEditorButton" class="option-button reset-button"
                                            style="background-color: red;"
                                            onclick="resetEditor()"><!--Reestablecer mensaje-->
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                <strong class="redactar-correo">Redactar Correo electrónico:</strong>

                                <div id="mensaje" contenteditable="true" class="message-box"></div>
                            </div>
                            <strong class="previsualizar">Previsualización</strong>
                            <div id="preview"></div>
                            <div class="archivos-documento">
                                <label id="archivo-label" for="archivo">Archivos adjuntos</label>
                                <input type="file" id="archivo" name="archivo">
                                <span id="file-name">No se ha seleccionado ningún archivo</span>
                            </div>
                            <button type="button" id="enviarCorreo">Enviar Correo</button>
                        </div>
                    </form>
                </div>
            </div>
            <div id="msjpredefinido" class="seccion-contenido" style="display: none;"><!--MENSAJES-->
                <h4 style="
                font-family: Calibri;
                font-size: 1.5em;
                background: #00386de8;
                color: white;
                text-align: center;
                border-radius: 5px;
                padding: 10px;
                box-sizing: border-box;
            ">CREAR MENSAJE PERSONALIZADO</h4>
                <form id="formmensaje" action="" method="post">
                    <div class="form-mensaje">
                        <div class="form-group">
                            <div class="msg-pre">
                                <label for="nombreM"><strong id="Nombre-mensaje">Nombre del mensaje
                                        predefinido:</strong></label>
                                <input id="nombreM" name="nombreM" type="text" required>
                            </div>
                            <div class="container">
                                <div class="cabeza">
                                    <strong class="menu-opciones">Menú de opciones-fuente:</strong>
                                </div>
                                <div class="editortexto-fuente">
                                    <select id="fontName2" class="adv-option-button"></select><!--Tipo de Fuente-->
                                    <select id="fontSize2" class="adv-option-button"></select><!--Tamaño de Fuente-->
                                    <div class="input-wrapper3"><!--Color del Texto-->
                                        <input type="color" id="foreColor" class="adv-option-button" />
                                        <label for="foreColor" class="colortexto">Color del texto</label>
                                    </div>
                                    <button id="bold" class="option-button format"><!--Negrita-->
                                        <i class="fa-solid fa-bold"></i>
                                    </button>
                                    <button id="italic" class="option-button format"><!--Cursiva-->
                                        <i class="fa-solid fa-italic"></i>
                                    </button>
                                    <button id="underline" class="option-button format"><!--Subrayado-->
                                        <i class="fa-solid fa-underline"></i>
                                    </button>
                                    <button id="strikethrough" class="option-button format"><!--Tachado-->
                                        <i class="fa-solid fa-strikethrough"></i>
                                    </button>
                                    <button id="subscript" class="option-button script"><!--Subíndice-->
                                        <i class="fa-solid fa-subscript"></i>
                                    </button>
                                    <button id="superscript" class="option-button script"><!--Superíndice-->
                                        <i class="fa-solid fa-superscript"></i>
                                    </button>
                                    <div class="input-wrapper4"><!--Resaltar Texto-->
                                        <input type="color" id="backColor" class="adv-option-button" />
                                        <label for="backColor" class="resaltartexto">Resaltar texto</label>
                                    </div>
                                    <button id="insertUnorderedList" class="option-button"><!--Viñetas-->
                                        <i class="fa-solid fa-list"></i>
                                    </button>
                                    <button id="insertOrderedList" class="option-button"><!--Numeración-->
                                        <div class="fa-solid fa-list-ol"></div>
                                    </button>
                                    <button id="outdent" class="option-button spacing"><!--Disminuir sangría-->
                                        <i class="fa-solid fa-outdent"></i>
                                    </button>
                                    <button id="indent" class="option-button spacing"><!--Aumentar sangría-->
                                        <i class="fa-solid fa-indent"></i>
                                    </button>
                                    <button type="button" id="createLink" class="adv-option-button"><!--Crear URL-->
                                        <i class="fa fa-link"></i>
                                    </button>
                                    <button type="button" id="unlink" class="option-button"><!--Deshacer URL-->
                                        <i class="fa fa-unlink"></i>
                                    </button>
                                    <select id="formatBlock" class="adv-option-button"><!--Encabezado-->
                                        <option value="H1">H1</option>
                                        <option value="H2">H2</option>
                                        <option value="H3">H3</option>
                                        <option value="H4">H4</option>
                                        <option value="H5">H5</option>
                                        <option value="H6">H6</option>
                                    </select>
                                    <button id="justifyLeft" class="option-button align"><!--Alinear a la izquierda-->
                                        <i class="fa-solid fa-align-left"></i>
                                    </button>
                                    <button id="justifyCenter" class="option-button align"><!--Alinear al centro-->
                                        <i class="fa-solid fa-align-center"></i>
                                    </button>
                                    <button id="justifyRight" class="option-button align"><!--Alinear a la derecha-->
                                        <i class="fa-solid fa-align-right"></i>
                                    </button>
                                    <button id="justifyFull" class="option-button align"><!--Justificar-->
                                        <i class="fa-solid fa-align-justify"></i>
                                    </button>
                                    <button id="undo" class="option-button"><!--Desahacer-->
                                        <i class="fa-solid fa-rotate-left"></i>
                                    </button>
                                    <button id="redo" class="option-button"><!--Repetir-->
                                        <i class="fa-solid fa-rotate-right"></i>
                                    </button>
                                    <button type="button" id="resetEditorButton" class="option-button reset-button"
                                        style="background-color: red;"
                                        onclick="reseteditor2()"><!--Reestablecer mensaje-->
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                            <strong id="mensajepredefinido">Mensaje:</strong>
                            <div id="mensajeP" contenteditable="true" class="editor" required></div>
                            <button type="button" id="btnregistrar" onclick="registrarmsgp()"><strong>Registrar Mensaje</strong></button>
                        </div>
                    </div>
                </form>
                <h5
                    style="font-family: Calibri; font-size: 1.5em; background: #00386de8; color: white;text-align: center; border-radius: 5px; padding: 10px;">
                    LISTA DE MENSAJES GUARDADOS</h5>
                <div id="mensaje-lista"></div>
            </div>
            <div id="asistencia" class="seccion-contenido"><!--ASISTENCIA-->
                <h6
                    style="font-family: Calibri; font-size: 1.5em; background: #00386de8;color: white; text-align: center; border-radius: 5px; padding: 10px;">
                    ASISTENCIA</h6>
                <div class="conteinerasis">
                    <div class="options-asistencia">
                        <div id="asistencia-controls">
                            <div class="S-bloque">
                                <strong id="bloque">Seleccione Bloque:</strong>
                                <select name="bloqueasis" id="bloqueasis">
                                    <option value="default">--Seleccione un bloque--</option>
                                </select>
                            </div>
                            <div class="fecha-Bloque">
                                <label for="fechaasistencia"><strong>Fecha:</strong></label>
                                <input type="date" id="fechaasistencia" name="fechaasistencia">
                            </div>
                            <div class="botones">
                                <button id="prev-month" onclick="cambiarMes(-1)"><strong>« Mes
                                        Anterior</strong></button>
                                <button id="next-month" onclick="cambiarMes(1)"><strong>Mes Siguiente
                                        »</strong></button>
                            </div>
                        </div>
                        <!-- Tabla de Asistencia -->
                        <div id="asistencia-lista">
                            <table border="1">
                                <thead>
                                    <tr>
                                        <!-- Aumentar el colspan para cubrir las columnas de días, Tardanzas, Faltas, Asistencias, y Porcentaje de asistencias -->
                                        <th id="asistencia-mes" colspan="37" style="padding: 1%;">Asistencia del Mes
                                            (septiembre 2024)</th>
                                    </tr>
                                </thead>
                                <thead>
                                    <tr id="encabezado-dias">
                                        <th>Nombre</th>
                                        <!-- Aquí se llenarán dinámicamente los días del mes como encabezados -->
                                        <th>Tardanzas</th>
                                        <th>Faltas</th>
                                        <th>Asistencias</th>
                                        <th>Porcentaje de asistencias</th>
                                    </tr>
                                </thead>
                                <tbody id="asistencia-data">
                                    <!-- Aquí se llenarán dinámicamente los datos de los estudiantes y su asistencia -->
                                </tbody>
                            </table>
                        </div>

                        <!-- Tabla de Estadísticas -->
                        <div id="estadsAsistencia">
                            <table>
                                <thead>
                                    <tr>
                                        <!-- Ajustar colspan para cubrir todas las columnas de estadísticas -->
                                        <th colspan="3" style="background-color: #13304e;">
                                            Estadísticas</th>
                                    </tr>
                                    <tr>
                                        <th>Alumno más impuntual del mes</th>
                                        <th>Alumno más puntual del mes</th>
                                        <th>Alumno con más tardanzas del mes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td id="impuntual-mes"></td>
                                        <td id="puntual-mes"></td>
                                        <td id="tardanzas-mes"></td>
                                    </tr>
                                </tbody>
                                <thead>
                                    <tr>
                                        <th>Alumno más impuntual del año</th>
                                        <th>Alumno más puntual del año</th>
                                        <th>Alumno con más tardanzas del año</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td id="impuntual-ano"></td>
                                        <td id="puntual-ano"></td>
                                        <td id="tardanzas-ano"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--Carpeta de Js-->
    <script src="backend/vendor/motor/plugins/sweetalert2.all.min.js"></script>
    <script src="js/asistencias.js"></script>
    <script src="js/formulario.js"></script>
    <script src="js/mensajes.js"></script>
    <script src="js/cuenta.js"></script>
    <script src="js/barralateral.js"></script>
    <footer>
        <label id="Creditos">Hecho por Sebastian Bruno y Jose Mondoñedo - v1.0</label>
    </footer>
</body>

</html>