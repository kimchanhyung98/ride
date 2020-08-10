<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', 'Auth\AuthController@login');

Route::get('rides', 'RideController@index');
Route::get('ride/{ride}', 'RideController@show');

Route::middleware('auth:sanctum')->get('user', function (Request $request) {
    // sanctum user test
    return $request->user();
});
