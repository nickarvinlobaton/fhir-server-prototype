<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Duo\Web;
use Illuminate\Support\Facades\Auth;
use App\User;

class AuthController extends Controller
{
    public function duoAuthentication(Request $request)
    {
        $akey = env('DUO_AKEY');
        $skey = env('DUO_SKEY');
        $ikey = env('DUO_IKEY');

        if(isset($request->sig_response)) {
            $userAuthenticated = Web::verifyResponse($ikey, $skey, $akey, $request->sig_response);
            if ($userAuthenticated) {
                $user = User::where('email', $userAuthenticated)->first();
                $user->is_verified = true;
                $user->save();

                // Check if request is to login via api using oauth2, /oauth/authorize
                if ($request->session()->exists('params')) {
                    // Get params if using oauth/authorize to redirect to oauth/authorize route
                    $params = $request->session()->pull('params');
                    return redirect($params['return_to']);
                }
                // if via web just redirect to dashboard
                return redirect()->route('home');
            }
        }

        $username = Auth::user()->email;
        $sig_request = Web::signRequest($ikey, $skey, $akey, $username);

        return view('auth.duo.auth', [
            'host' => "api-12f5031f.duosecurity.com",
            'sig_request' => $sig_request,
            'user_id' => Auth::user()->id,
        ]);
    }
}
