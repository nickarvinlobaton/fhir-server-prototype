<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        if (! $request->expectsJson()) {
            // Check if request is from api login, oauth/authorize
            if ($request->path() === 'oauth/authorize') {
                if (isset($request->query()['client_id'])) {
                    $params = array(
                        'client_id' => $request->query()['client_id'],
                        'return_to' => \Request::getRequestUri(),
                    );
                    // add the request data from oauth/authorize to session not sure if this is best practice
                    $request->session()->put('params', $params);
                    return route('login', $params);
                } else {
                    return route('login');
                }
            }
            // End modified line
            return route('login');
        }
    }
}
