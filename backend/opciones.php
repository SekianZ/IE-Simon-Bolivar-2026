<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once __DIR__ . '/BaseDeDatos.php'; // Cambié la barra invertida a diagonal
require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$nomDB = $_ENV['DATABASE_NAME'] ;
$User =$_ENV['DATABASE_USER'] ;
$host = $_ENV['DATABASE_HOST'] ;
$contraseña =$_ENV['DATABASE_PASSWORD'] ;
$port = $_ENV['DATABASE_PORT'] ;


header('Content-Type: application/json');


$db = new BaseDeDatos($host, $User, $contraseña, $nomDB, $port);

// Implementación de las funciones CRUD
function agregarEstudiante($datos)
{
    global $db;  // Accede a la instancia de $db
    return $db->agregarEstudiante($datos['nameE'], $datos['correo'], $datos['id_bloque']);
}

function agregarBloque($datos)
{
    global $db;  // Accede a la instancia de $db
    return $db->agregarBloque($datos['nameB'], $datos['dias']); // Acceder a 'dias' en lugar de 'selectB'
}


function actualizarEstudiante($datos)
{
    global $db;  // Accede a la instancia de $db
    return $db->actualizarEstudiante($datos['newnameE'], $datos['newcorreo'], $datos['newid_bloque'], $datos['id_estudiante']);
}

function actualizarBloque($datos)
{
    global $db;  // Accede a la instancia de $db
    return $db->actualizarBloque($datos['newnameB'], $datos['id_bloque'], $datos['newSelectB']);
}

function eliminarEstudiante($datos)
{
    global $db;  // Accede a la instancia de $db
    return $db->eliminarEstudiante($datos['id_estudiante']);
}

function eliminarBloque($datos)
{
    global $db;  // Accede a la instancia de $db
    return $db->eliminarBloque($datos['id_bloque']);
}
//CRUD

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {

        error_log(print_r($_POST, true));
        $accion = $_POST['accion'] ?? '';
        $tipo = $_POST['tipo'] ?? '';
        $datos = $_POST['datos'] ?? [];


        //CRUD
        switch ($accion) {
            case 'agregar':
                switch ($tipo) {
                    case 'estudiante':
                        echo json_encode(agregarEstudiante($datos));
                        exit;
                    case 'bloque':
                        echo json_encode(agregarBloque($datos));
                        exit;
                    default:
                        echo json_encode(['success' => false, 'mensaje' => 'Tipo no reconocido']);
                }
                break;

            case 'actualizar':
                switch ($tipo) {
                    case 'estudiante':
                        echo json_encode(actualizarEstudiante($datos));
                        exit;
                    case 'bloque':
                        echo json_encode(actualizarBloque($datos));
                        exit;
                    default:
                        echo json_encode(['success' => false, 'mensaje' => 'Tipo no reconocido']);
                }
                break;

            case 'eliminar':
                switch ($tipo) {
                    case 'estudiante':
                        echo json_encode(eliminarEstudiante($datos));
                        exit;
                    case 'bloque':
                        echo json_encode(eliminarBloque($datos));
                        exit;
                    default:
                        echo json_encode(['success' => false, 'mensaje' => 'Tipo no reconocido']);
                }
                break;

            default:
                break;
        }



        if ($tipo === 'estudiante' && $accion === 'buscar') {
            $id = $datos['id'] ?? '';
            unset($datos['id']); // Eliminamos el ID de los datos para no actualizarlo por error
            $archivos = $db->obtenerPorId('estudiantes', $id);
            echo json_encode($archivos);
            exit;
        }


        if ($tipo === 'asistencia' && $accion === 'listar') {
            $mes = $datos['mes'];
            $anio = $datos['anio'];
            $bloque = $datos['bloqueE'];

            $registros = $db->obtenerlistasistencia($bloque, $mes, $anio);

            echo json_encode($registros);
            exit;
        }

        if ($tipo === 'asistencia' && $accion === 'estadsanuales') {
            $anio = $datos['anio'];
            $bloque = $datos['bloque'];
            error_log("Año: $anio, Bloque: $bloque");


            // Verifica que los datos se estén recibiendo correctamente
            if (empty($anio) || empty($bloque)) {
                echo json_encode(['error' => 'Año o bloque no proporcionado']);
                exit;
            }

            try {
                // Asumiendo que $resultado es el array de datos que quieres devolver
                $resultado = $db->datosanuales($anio, $bloque);

                // Verifica si $resultado es un array y no está vacío
                if ($resultado) {
                    echo json_encode($resultado);
                } else {
                    echo json_encode(['error' => 'No se encontraron datos']);
                }
            } catch (Exception $e) {
                echo json_encode(['error' => $e->getMessage()]);
            }
            exit;
        }


        if ($tipo === 'profesor' && $accion === 'actualizar') {
            $id = $datos['id'] ?? '';
            unset($datos['id']); // Eliminamos el ID de los datos para no actualizarlo por error
            $db->actualizar("profesor", $datos, $id, "id_profesor");
            echo json_encode(['status' => 'success', 'message' => 'Datos actualizados']);
            exit;
        }
        // Asegúrate de que la respuesta sea JSON
        if ($_POST['accion'] === 'actualizar_asistencia') {
            $id_estudiante = $_POST['id_estudiante'];
            $fecha = $_POST['fecha'];
            $estado = $_POST['estado'];

            try {
                $resultado = $db->registrarOActualizarAsistencia($id_estudiante, $fecha, $estado);
                echo json_encode(['success' => true, 'mensaje' => 'Asistencia registrada o actualizada con éxito']);
                exit;  // Asegura que no haya más salida
            } catch (Exception $e) {
                echo json_encode(['success' => false, 'mensaje' => $e->getMessage()]);
                exit;  // Asegura que no haya más salida
            }
        }

        if ($tipo === 'estudiante' && $accion === 'listarpB') {
            $bloques = isset($_POST['datos']['bloques']) ? explode(',', $_POST['datos']['bloques']) : [];
            $alumnos = [];

            foreach ($bloques as $bloque) {
                $alumnosDelBloque = $db->buscaralumnosporbloque($bloque);
                $alumnos = array_merge($alumnos, $alumnosDelBloque);
            }

            echo json_encode($alumnos);
            exit;
        }

        if ($tipo === 'mensajes' && $accion === 'eliminar') {
            $id = $datos['id'] ?? '';
            unset($datos['id']); // Eliminamos el ID de los datos para no actualizarlo por error
            $db->eliminar("mensajes_predefinidos", $id, "id_mp");
            echo json_encode(['status' => 'success', 'message' => 'Dato eliminado', 'signo' => true]);
            exit;
        }

        if ($tipo === 'mensajes' && $accion === 'actualizar') {
            $id = $datos['id'] ?? '';
            unset($datos['id']); // Eliminamos el ID de los datos para no actualizarlo por error
            $db->actualizar("mensajes_predefinidos", $datos, $id, "id_mp");
            echo json_encode(['status' => 'success', 'message' => 'Dato actualizado', 'signo' => true]);
            exit;
        }

        if ($tipo === 'mensajes' && $accion === 'agregar') {

            $db->insertar("mensajes_predefinidos", $datos);
            echo json_encode(['status' => 'success', 'message' => 'Dato actualizado', 'signo' => true]);
            exit;
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $accion = $_GET['accion'] ?? '';
        $tipo = $_GET['tipo'] ?? '';


        if ($accion === 'listar' && $tipo === 'bloque') {
            $registros = $db->obtenerTodos("bloque");
            echo json_encode($registros);
            exit;
        }

        if ($accion === 'eliminar_vacio') {
            try {
                // Llamar a la función eliminarVacios
                $filasEliminadas = $db->eliminarVacios();

                // Asegurar que se envíe JSON
                header('Content-Type: application/json');

                // Responder con un mensaje de éxito y el número de filas eliminadas
                echo json_encode([
                    "status" => "success",
                    "message" => "Registros vacíos eliminados",
                    "filasEliminadas" => $filasEliminadas
                ]);
                exit; // Asegúrate de que no se imprima nada más
            } catch (Exception $e) {
                http_response_code(500);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Error interno del servidor',
                    'error' => $e->getMessage()
                ]);
                exit; // Asegúrate de que no se imprima nada más
            }
        }

        if ($tipo === 'profesor' && $accion === 'listar') {
            $registros = $db->obtenerTodos("profesor");
            echo json_encode($registros);
            exit;
        }

        if ($tipo === 'estudiante' && $accion === 'listar') {
            $registros = $db->obtenerTodos("estudiantes");
            echo json_encode($registros);
            exit;
        }

        if ($tipo === 'mensajes' && $accion === 'listar') {
            $registros = $db->obtenerTodos("mensajes_predefinidos");
            echo json_encode($registros);
            exit;
        }

        if ($_GET['accion'] === 'obtener_estadisticas' && isset($_GET['id_estudiante'])) {
            $idEstudiante = $_GET['id_estudiante'];

            // Realiza la consulta en la base de datos para obtener las estadísticas del estudiante
            $datosEstudiante = $db->obtenerEstadisticasYAsistencias($idEstudiante);

            if ($datosEstudiante) {
                echo json_encode([
                    'success' => true,
                    'nombre' => $datosEstudiante['nombre'],
                    'correo' => $datosEstudiante['correo'],  // Agregamos el correo
                    'bloque' => $datosEstudiante['bloque'],
                    'asistencias' => $datosEstudiante['asistencias'],
                    'faltas' => $datosEstudiante['faltas'],
                    'tardanzas' => $datosEstudiante['tardanzas'],
                ]);
            } else {
                echo json_encode(['success' => false, 'mensaje' => 'No se encontraron datos']);
            }

            exit;
        }

        if ($_GET['accion'] =='conseguirEstads'){
            $tipo = $_GET['tipo'];

            $cant= $db->conseguirEstads( $tipo);

            echo json_encode($cant);

            exit;
        } 

    }

    // Manejo de errores por solicitud no válida
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Solicitud no válida']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error interno del servidor', 'error' => $e->getMessage()]);
}
exit;
