<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    protected function authenticated(Request $request, $user)
    {
//        if(!$user->is_verified) {
//            return redirect()->route('duo');
//        }
//        return redirect()->route('home');
        $user = User::where('email', $user->email)->first();
        $user->is_verified = false;
        $user->save();
        return redirect()->route('duo');
    }

    protected function logout(Request $request)
    {
        $user = User::where('email', Auth::user()->email)->first();
        $user->is_verified = false;
        $user->save();
        Auth::logout();
        return redirect('/login');
    }
}
