<?php
require __DIR__ . '\vendor\motor\autoload.php';
use Dotenv\Dotenv;



$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$host = $_ENV['CORREO_EMAIL'] ?? 'no_cargado';
echo $host; // Muestra "localhost" si la variable se cargó correctamente
