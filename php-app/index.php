<?php

ini_set('display_errors', 1);

require_once __DIR__.'/vendor/autoload.php';

use Curl\HttpClient;

for ($i=1; $i <= 10; $i++) { 
    try {
        sleep(3);
        throw new Exception("Uncaught Exception: Env file not found ".$i, 1);
    } catch (\Exception $e) {
        $response = HttpClient::post(
            'http://localhost:8000/save-error', 
            [
                "loggerId"  => 1,
                "error"     => $e->getMessage()
            ]
        )
        ->headers([
            'Content-Type : application/json'
        ])
        ->send();
    }
}