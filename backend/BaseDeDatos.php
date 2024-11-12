<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
class BaseDeDatos
{
    private $conn;

    public function __construct($host, $usuario, $contraseña, $nombreBaseDatos)
    {
        $this->conn = new mysqli($host, $usuario, $contraseña, $nombreBaseDatos);

        // Verificar la conexión
        if ($this->conn->connect_error) {
            throw new Exception("Conexión fallida: " . $this->conn->connect_error);
        }
    }

    public function obtenerTodos($tabla)
    {
        $sql = "SELECT * FROM `$tabla`";
        if ($resultado = $this->conn->query($sql)) {
            $datos = $resultado->fetch_all(MYSQLI_ASSOC);
            $resultado->free(); // Liberar resultados
            return $datos;
        } else {
            throw new Exception("Error en la consulta: " . $this->conn->error);
        }
    }

    public function obtenerlistasistencia($id_bloque, $mes, $anio)
    {
        // Crear la consulta para obtener la lista de asistencia de un mes y año específicos para un id_bloque específico
        $sql = "
            SELECT a.*
            FROM asistencia a
            JOIN estudiantes e ON a.id_estudiante = e.id_estudiante
            WHERE e.id_bloque = ? 
              AND MONTH(a.fecha) = ? 
              AND YEAR(a.fecha) = ?
        ";

        try {
            if ($stmt = $this->conn->prepare($sql)) {
                // Enlazar los parámetros id_bloque, mes y año a la consulta
                $stmt->bind_param("sii", $id_bloque, $mes, $anio);
                $stmt->execute();

                // Obtener el resultado
                $resultado = $stmt->get_result();
                $datos = $resultado->fetch_all(MYSQLI_ASSOC);

                // Cerrar la declaración
                $stmt->close();

                // Devolver los datos obtenidos
                return $datos;
            } else {
                throw new Exception("Error en la consulta: " . $this->conn->error);
            }
        } catch (Exception $e) {
            // Manejar el error y devolver un mensaje de error apropiado
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
            exit;
        }
    }



    public function obtenerPorId($tabla, $id)
    {
        $sql = "SELECT * FROM `$tabla` WHERE id_estudiante = ?";
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $resultado = $stmt->get_result();
            $datos = $resultado->fetch_assoc();
            $stmt->close(); // Cerrar declaración
            return $datos;
        } else {
            throw new Exception("Error en la consulta: " . $this->conn->error);
        }
    }

    public function insertar($tabla, $datos)
    {
        $columnas = implode(", ", array_map(function ($col) {
            return "`$col`";
        }, array_keys($datos)));
        $valores = implode(", ", array_fill(0, count($datos), '?'));
        $sql = "INSERT INTO `$tabla` ($columnas) VALUES ($valores)";

        if ($stmt = $this->conn->prepare($sql)) {
            $tipos = str_repeat("s", count($datos));
            $stmt->bind_param($tipos, ...array_values($datos));
            $resultado = $stmt->execute();
            $stmt->close(); // Cerrar declaración
            return $resultado;
        } else {
            throw new Exception("Error en la consulta: " . $this->conn->error);
        }
    }

    public function conseguirEstads($tipo){
        switch ($tipo) {
            case "bloque":
                $nombreID="id_bloque";
                break;
            case "estudiantes":
                $nombreID= "id_estudiante";
                break;
            case "asistencia":
                $nombreID= "id_asistencia";
                break;
            default:
                throw new Exception("Tipo no valido");
        }
        $sql = "SELECT COUNT($nombreID) AS total_$tipo FROM $tipo";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->execute();
            $resultado = $stmt->get_result();
            $datos = $resultado->fetch_assoc();
            $stmt->close(); // Cerrar declaración
            return $datos;
        } else {
            throw new Exception("Error en la consulta: " . $this->conn->error);
        }
    }

    public function actualizar($tabla, $datos, $id, $nombre_id)
    {
        $sets = implode(", ", array_map(function ($col) {
            return "`$col` = ?";
        }, array_keys($datos)));
        $sql = "UPDATE `$tabla` SET $sets WHERE `$nombre_id` = ?";

        if ($stmt = $this->conn->prepare($sql)) {
            $tipos = str_repeat("s", count($datos)) . "i";
            $valores = array_values($datos);
            $valores[] = $id;
            $stmt->bind_param($tipos, ...$valores);
            $resultado = $stmt->execute();
            $stmt->close(); // Cerrar declaración
            return $resultado;
        } else {
            throw new Exception("Error en la consulta: " . $this->conn->error);
        }
    }

    public function buscaralumnosporbloque($id_bloque)
    {
        $sql = "SELECT * FROM estudiantes WHERE id_bloque = ? ORDER BY nombre ASC";
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $id_bloque);
            $stmt->execute();
            $resultado = $stmt->get_result();
            $datos = $resultado->fetch_all(MYSQLI_ASSOC);
            $stmt->close(); // Cerrar declaración
            return $datos;
        } else {
            throw new Exception("Error en la consulta: " . $this->conn->error);
        }
    }

    public function eliminarVacios()
    {
        // La consulta elimina los registros donde el estado está vacío o es NULL
        $sql = "DELETE FROM asistencia WHERE estado = '' OR estado IS NULL";

        if ($stmt = $this->conn->prepare($sql)) {
            // Ejecutar la consulta
            if ($stmt->execute()) {
                // Comprobar cuántas filas fueron afectadas
                $filasAfectadas = $stmt->affected_rows;
                $stmt->close(); // Cerrar declaración

                // Devolver el número de filas eliminadas
                return $filasAfectadas;
            } else {
                // Si la ejecución falla
                throw new Exception("Error al ejecutar la consulta: " . $stmt->error);
            }
        } else {
            // Si la preparación de la consulta falla
            throw new Exception("Error en la consulta: " . $this->conn->error);
        }
    }




    public function eliminar($tabla, $id, $nomid)
    {
        $sql = "DELETE FROM `$tabla` WHERE `$nomid` = ?";
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("i", $id);
            $resultado = $stmt->execute();
            $stmt->close(); // Cerrar declaración
            return $resultado;
        } else {
            throw new Exception("Error en la consulta: " . $this->conn->error);
        }
    }

    public function obtenerAsistenciaPorFecha($id_estudiante, $fecha)
    {
        $sql = "SELECT * FROM asistencia WHERE id_estudiante = ? AND fecha = ?";
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("is", $id_estudiante, $fecha);
            $stmt->execute();
            $resultado = $stmt->get_result();
            $datos = $resultado->fetch_assoc();
            $stmt->close(); // Cerrar declaración
            return $datos;
        } else {
            throw new Exception("Error en la consulta: " . $this->conn->error);
        }
    }

    public function registrarOActualizarAsistencia($id_estudiante, $fecha, $estado)
    {
        // Verificar si ya existe un registro de asistencia para el estudiante y la fecha
        $registroExistente = $this->obtenerAsistenciaPorFecha($id_estudiante, $fecha);

        if ($registroExistente) {
            // Si existe, actualizar el estado de asistencia
            $datos = ['estado' => $estado];
            return $this->actualizar('asistencia', $datos, $registroExistente['id_asistencia'], 'id_asistencia');
        } else {
            // Si no existe, insertar un nuevo registro
            $datos = [
                'id_estudiante' => $id_estudiante,
                'fecha' => $fecha,
                'estado' => $estado
            ];
            return $this->insertar('asistencia', $datos);
        }
    }


    public function datosanuales($anio, $id_bloque)
    {
        // Consultas SQL
        $sql_asistencias = "
            SELECT e.id_estudiante, e.nombre, COUNT(*) as asistencias
            FROM asistencia a
            JOIN estudiantes e ON a.id_estudiante = e.id_estudiante
            WHERE YEAR(a.fecha) = ? 
            AND e.id_bloque = ? 
            AND a.estado = 'Presente'
            GROUP BY e.id_estudiante, e.nombre
            ORDER BY asistencias DESC
            LIMIT 1
        ";

        $sql_faltas = "
            SELECT e.id_estudiante, e.nombre, COUNT(*) as faltas
            FROM asistencia a
            JOIN estudiantes e ON a.id_estudiante = e.id_estudiante
            WHERE YEAR(a.fecha) = ? 
            AND e.id_bloque = ?  
            AND a.estado = 'Ausente'
            GROUP BY e.id_estudiante, e.nombre
            ORDER BY faltas DESC
            LIMIT 1
        ";

        $sql_tardanzas = "
            SELECT e.id_estudiante, e.nombre, COUNT(*) as tardanzas
            FROM asistencia a
            JOIN estudiantes e ON a.id_estudiante = e.id_estudiante
            WHERE YEAR(a.fecha) = ? 
            AND e.id_bloque = ? 
            AND a.estado = 'Tarde'
            GROUP BY e.id_estudiante, e.nombre
            ORDER BY tardanzas DESC
            LIMIT 1
        ";

        try {
            // Preparar y ejecutar consulta de asistencias
            if ($stmt_asistencias = $this->conn->prepare($sql_asistencias)) {
                $stmt_asistencias->bind_param("is", $anio, $id_bloque);
                $stmt_asistencias->execute();
                $resultado_asistencias = $stmt_asistencias->get_result()->fetch_assoc();
                $stmt_asistencias->close();
            } else {
                throw new Exception("Error en la consulta de asistencias: " . $this->conn->error);
            }

            // Preparar y ejecutar consulta de faltas
            if ($stmt_faltas = $this->conn->prepare($sql_faltas)) {
                $stmt_faltas->bind_param("is", $anio, $id_bloque);
                $stmt_faltas->execute();
                $resultado_faltas = $stmt_faltas->get_result()->fetch_assoc();
                $stmt_faltas->close();
            } else {
                throw new Exception("Error en la consulta de faltas: " . $this->conn->error);
            }

            // Preparar y ejecutar consulta de tardanzas
            if ($stmt_tardanzas = $this->conn->prepare($sql_tardanzas)) {
                $stmt_tardanzas->bind_param("is", $anio, $id_bloque);
                $stmt_tardanzas->execute();
                $resultado_tardanzas = $stmt_tardanzas->get_result()->fetch_assoc();
                $stmt_tardanzas->close();
            } else {
                throw new Exception("Error en la consulta de tardanzas: " . $this->conn->error);
            }

            // Combinar los resultados en un array
            $resultado = [
                'asistencias' => [
                    'id_estudiante' => $resultado_asistencias['id_estudiante'] ?? null,
                    'nombre' => $resultado_asistencias['nombre'] ?? 'No disponible',
                    'asistencias' => $resultado_asistencias['asistencias'] ?? 0
                ],
                'faltas' => [
                    'id_estudiante' => $resultado_faltas['id_estudiante'] ?? null,
                    'nombre' => $resultado_faltas['nombre'] ?? 'No disponible',
                    'faltas' => $resultado_faltas['faltas'] ?? 0
                ],
                'tardanzas' => [
                    'id_estudiante' => $resultado_tardanzas['id_estudiante'] ?? null,
                    'nombre' => $resultado_tardanzas['nombre'] ?? 'No disponible',
                    'tardanzas' => $resultado_tardanzas['tardanzas'] ?? 0
                ]
            ];

            return $resultado;
        } catch (Exception $e) {
            // Manejar el error
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
            exit;
        }
    }

    // Método para agregar un estudiante
    public function agregarEstudiante($nombre, $correo, $bloque_id)
    {

        $query = "INSERT INTO estudiantes (nombre, correo, id_bloque) VALUES ('$nombre', '$correo', $bloque_id)";
        return $this->ejecutarConsulta($query);
    }

    // Método para agregar un bloque
    public function agregarBloque($nombreB, $dias)
    {
        // Verificar si $dias es un array antes de usar implode
        if (!is_array($dias)) {
            throw new InvalidArgumentException('El argumento debe ser un array.');
        }

        // Convertir el array de días a una cadena separada por comas
        $diasEstudio = implode(',', $dias); // 'Lunes,Martes' etc.

        // Preparar la consulta de inserción
        $query = "INSERT INTO bloque (nombreB, dias_estudio) VALUES ('$nombreB', '$diasEstudio')";
        return $this->ejecutarConsulta($query);
    }



    // Método para actualizar un estudiante
    public function actualizarEstudiante($nombre, $correo, $bloque_id, $id_estudiante)
    {

        $query = "UPDATE estudiantes SET nombre = '$nombre', correo = '$correo', id_bloque = $bloque_id WHERE id_estudiante = $id_estudiante";
        return $this->ejecutarConsulta($query);
    }

    // Método para actualizar un bloque
    public function actualizarBloque($nombre, $id, $dias)
    {
        // Convertir el array de días a una cadena separada por comas
        $diasEstudio = implode(',', $dias); // 'Lunes,Martes' etc.

        // Preparar la consulta de actualización
        $query = "UPDATE bloque SET nombreB = '$nombre', dias_estudio = '$diasEstudio' WHERE id_bloque = $id";
        return $this->ejecutarConsulta($query);
    }

    // Método para eliminar un estudiante
    public function eliminarEstudiante($id)
    {
        $id = (int) $id;  // Asegurarse de que el ID sea un entero
        $query = "DELETE FROM estudiantes WHERE id_estudiante = $id";
        return $this->ejecutarConsulta($query);
    }

    // Método para eliminar un bloque
    public function eliminarBloque($id)
    {
        $query = "DELETE FROM bloque WHERE id_bloque = $id";
        return $this->ejecutarConsulta($query);
    }

    // Método genérico para ejecutar una consulta
    private function ejecutarConsulta($query)
    {
        if ($this->conn->query($query)) {
            return ['success' => true, 'mensaje' => 'Operación exitosa'];
        } else {
            return ['success' => false, 'mensaje' => 'Error en la operación'];
        }
    }

    public function obtenerEstadisticasYAsistencias($idEstudiante)
    {
        $query = "SELECT e.nombre, 
                             e.correo,  -- Agregamos el correo
                             b.nombreB AS bloque, -- Agregamos el nombre del bloque
                             COUNT(CASE WHEN a.estado = 'presente' THEN 1 END) AS asistencias,
                             COUNT(CASE WHEN a.estado = 'ausente' THEN 1 END) AS faltas,
                             COUNT(CASE WHEN a.estado = 'tarde' THEN 1 END) AS tardanzas
                      FROM estudiantes e
                      LEFT JOIN asistencia a ON a.id_estudiante = e.id_estudiante
                      LEFT JOIN bloque b ON b.id_bloque = e.id_bloque  -- Suponiendo que 'id_bloque' está en 'estudiantes'
                      WHERE e.id_estudiante = ?
                      GROUP BY e.id_estudiante, b.nombreB";  // Agrupamos también por el nombre del bloque

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $idEstudiante);
        $stmt->execute();
        $resultado = $stmt->get_result();

        if ($resultado->num_rows > 0) {
            return $resultado->fetch_assoc();
        } else {
            return null; // No se encontró el estudiante
        }
    }

    public function __destruct()
    {
        $this->conn->close();
    }
}
