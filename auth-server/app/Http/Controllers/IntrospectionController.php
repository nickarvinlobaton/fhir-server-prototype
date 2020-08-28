<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class IntrospectionController extends Controller
{
    public function index(Request $request)
    {
        $token = $request->input('token');
        $client_id = $request->input('client_id');
        $client_secret = $request->input('client_secret');

        // bool variable to determine if token is active
        $active = false;

        // Verify client_id and client_secret in DB
        $client = DB::table('oauth_clients')->where([
            ['id', '=', $client_id],
            ['secret', '=', $client_secret],
        ])->get()->toArray();

        // Check if client id & secret is not in DB
        if(count((array)$client) == 0) {
            return response()->json([
                'error' => 'invalid_request',
            ], 400);
        }

        // Decrypt access token
        $tokenParts = explode(".", $token);
        $tokenHeader = json_decode(base64_decode($tokenParts[0]), true);
        $tokenPayload = json_decode(base64_decode($tokenParts[1]), true);

        // Check if token header is invalid
        if (is_null($tokenHeader)) {
            return response()->json([
                'error' => 'invalid_request',
            ], 400);
        }

        // Check token payload jti in DB, if present return result
        $access_token_value = DB::table('oauth_access_tokens')->find($tokenPayload['jti']);

        // Check if access token id is not in DB
        if(count((array)$access_token_value) == 0) {
            return response()->json([
                'error' => 'invalid_request',
            ], 400);
        }

        // Compare client_id from fhir server and client_id in access_token DB doesn't match
        if($client_id != $access_token_value->client_id) {
            return response()->json([
                'error' => 'invalid_request',
            ], 400);
        }

        // if token is not revoked make $active true
        if($access_token_value->revoked == 0) {
            $active = true;
        }

        // convert $access_token_value->scopes array into string and remove unnecessary characters
        $scope = implode(",",(array)$access_token_value->scopes);
        $scope = str_replace('[', "", $scope);
        $scope = str_replace(']', "", $scope);
        $scope = str_replace('"', "", $scope);
        $scope = stripslashes($scope);

        return response()->json([
            'active' => $active,
            'client_id' => $access_token_value->client_id,
            'user_id' => $access_token_value->user_id,
            'scope' => $scope,
        ], 200);
    }
}
