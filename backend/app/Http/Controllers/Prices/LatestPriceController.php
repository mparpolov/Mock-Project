<?php

namespace App\Http\Controllers\Prices;

use App\Http\Controllers\Controller;

use App\Http\Services;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\LatestPriceRequest;

class LatestPriceController extends Controller {

    const TAG = 'AlphaAdvantageApi';

    public function latestPrice(LatestPriceRequest $request) {

        extract($request->all());
            
        $response = [];
        $status = 200;
        
        try {
            $client = new Services\AlphaAdvantageApi();
            $apiResponse = $client->getLatestPrice($symbol);

            if ( $apiResponse->ok() ) {
                $body = $apiResponse->getBody();
                if ( !isset($body['Error Message']) ) { // Alpha api returns errors with 200 status code
                    $response['data'] = $body['Global Quote'];
                } else {
                    $status = 503;
                    $response['error'] = 'Service Unavailable.';

                    Log::error(self::TAG.': '.$body['Error Message']);
                }
            }
        } catch (\Exception $e) {
            $status = 503;
            $response['error'] = 'Service Unavailable.';

            Log::error($e->getMessage());
        }
        return response()->json($response, $status);   
    }  
}
