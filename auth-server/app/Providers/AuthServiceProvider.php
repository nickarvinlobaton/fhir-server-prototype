<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Laravel\Passport\Passport;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        //
        Passport::routes();

        // Added duo middleware to check if user is verified, if not redirect to duo 2fa screen
        Route::get('/oauth/authorize', [
            'uses' => '\App\Http\Controllers\AuthorizationController@authorize',
            'as' => 'passport.authorizations.authorize',
            'middleware' => ['web', 'auth', 'duo_verified'],
        ]);

        Passport::setDefaultScope([
            'user/*.*',
        ]);

        Passport::tokensCan([
            'user/*.read' => 'Read all resources.',
            'user/*.*' => 'Access all resources',
        ]);
    }
}
