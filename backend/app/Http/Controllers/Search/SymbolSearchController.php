<?php

namespace App\Http\Controllers\Search;

use App\Http\Controllers\Controller;

use App\Http\Services;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\SymbolSearchRequest;

class SymbolSearchController extends Controller {

    const CACHE_EXPIRY_MINUTES = 5;
    const TAG = 'AlphaAdvantageApi';

    public function search(SymbolSearchRequest $request) {
        extract($request->all());
        
        $response = [];
        $status = 200;
        
        try {
            if ( $cachedSymbol = $this->getCachedSymbol($symbol) ) { // Respose already cached
                $response['data'] = $cachedSymbol;
            } else {
                $client = new Services\AlphaAdvantageApi();
                $apiResponse = $client->getSymbol($symbol);

                if ( $apiResponse->ok() ) {
                    $body = $apiResponse->getBody();
                    if ( !isset($body['Error Message']) ) { // Alpha api returns errors with 200 status code
                        Redis::set($symbol, json_encode($body['bestMatches']));
                        Redis::expire($symbol, (self::CACHE_EXPIRY_MINUTES * 60));
                        $response['data'] = $body['bestMatches'];
                    } else {
                        $status = 503;
                        $response['error'] = 'Service Unavailable.';

                        Log::error(self::TAG.': '.$body['Error Message']);
                    }
                }
            }
        } catch (\Exception $e) {
            $status = 503;
            $response['error'] = 'Service Unavailable.';

            Log::error($e->getMessage());
        }
        return response()->json($response, $status);     
    }

    private function getCachedSymbol(string $symbol) {
        $cachedSymbol = Redis::get($symbol);
        return $cachedSymbol ? json_decode($cachedSymbol) : null;
    }
}
