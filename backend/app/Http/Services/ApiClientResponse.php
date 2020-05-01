<?php

namespace App\Http\Services;

use GuzzleHttp\Psr7\Response;

class ApiClientResponse {

    private $response;

    function __construct(Response $response) {
        $this->response = $response;
    }

    public function ok(): bool {
        return $this->response->getStatusCode() === 200;
    }

    public function getStatusCode() {
        return $this->response->getStatusCode();
    }

    public function getBody() {
        return json_decode($this->response->getBody(), true);
    }
}
