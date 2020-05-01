<?php

namespace App\Http\Services;

use GuzzleHttp\Client;

class AlphaAdvantageApi {
  
    private $client;
    private $apiKey;

	function __construct() {   
        $this->apiKey = env('ALPHAVANTAGE_API_KEY');  
        $this->client = new Client([
          'base_uri' => env('ALPHAVANTAGE_BASE_URL'),
          'timeout'=> 15
        ]);
    }

    public function getSymbol(string $symbol) {
        return $this->endpoint('GET', 'SYMBOL_SEARCH', 'keywords='.$symbol);
    }

    public function getLatestPrice(string $symbol) {
        return $this->endpoint('GET', 'GLOBAL_QUOTE', 'symbol='.$symbol);
    }

    private function endpoint(string $method, string $functionName, string $params) {
        $response = $this->client->request($method, 'query?function='.$functionName.'&'.$params.'&apikey='.$this->apiKey);
        return new ApiClientResponse($response);
    }

}