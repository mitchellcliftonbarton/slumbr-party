<?php

header('Access-Control-Allow-Origin: http://localhost:3000');

return [
    'debug' => true,
    'api' => [
        'basicAuth' => false,
        'allowInsecure' => true
    ],
    'kql' => [
        'auth' => false
    ]
];