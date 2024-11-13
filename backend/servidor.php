<?php
require __DIR__ . '/backend/vendor/autoload.php';
use Dotenv\Dotenv;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();



$usernamecorreo = $_ENV['CORREO_EMAIL'] ;
$contraseñacorreo =$_ENV['CORREO_CONTRASENA'] ;

$response = ['success' => false, 'message' => ''];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    header('Content-Type: application/json');

    $asunto = $_POST['asunto'] ?? '';
    $editorContent = $_POST['editorContent'] ?? '';
    $mensajeOriginal = $editorContent;

    if (empty($_POST['para'])) {
        $response['message'] = 'No se han seleccionado destinatarios.';
        echo json_encode($response);
        exit;
    }

    $mail = new PHPMailer(true);
    $mail->CharSet = 'UTF-8';
    $mail->SMTPOptions = [
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        ]
    ];
    $mail->SMTPDebug = 0;
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = $usernamecorreo;
    $mail->Password = $contraseñacorreo;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    $successCount = 0;
    foreach ($_POST['para'] as $item) {
        list($nombre, $correo) = explode('|', $item);
        $mensajePersonalizado = str_replace('{estudiante}', '<strong>' . $nombre . '</strong>', $mensajeOriginal);
        $mail->isHTML(true);
        $mail->addAddress($correo, $nombre);
        $mail->Subject = $asunto;
        $mail->Body = $mensajePersonalizado;

        try {
            $mail->send();
            $successCount++;
        } catch (Exception $e) {
            $response['message'] .= "Error al enviar a $nombre: {$mail->ErrorInfo}. ";
        } finally {
            $mail->clearAddresses();
        }
    }

    $response['success'] = $successCount > 0;
    $response['message'] = $successCount > 0 ? "Se enviaron $successCount correos." : "No se enviaron correos.";
    echo json_encode($response);
}
