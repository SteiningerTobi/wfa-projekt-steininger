<?php
//
//use App\Http\Controllers\AuthController;
//use App\Http\Controllers\BookingController;
//use App\Http\Controllers\CategoryController;
//use App\Http\Controllers\CourseController;
//use App\Http\Controllers\CourseSessionController;
//use Illuminate\Support\Facades\Route;
//
//// Public
//Route::get('/courses', [CourseController::class, 'index']);
//Route::get('/courses/{id}', [CourseController::class, 'show']);
//
//Route::get('/categories', [CategoryController::class, 'index']);
//Route::get('/categories/{id}', [CategoryController::class, 'show']);
//
//// Auth
//Route::post('auth/register', [AuthController::class, 'register']);
//Route::post('auth/login', [AuthController::class, 'login']);
//
//Route::middleware('auth:api')->group(function () {
//
//    Route::post('auth//logout', [AuthController::class, 'logout']);
//    Route::get('auth/me', [AuthController::class, 'me']);
//
//    // Trainer: Kurse
//    Route::post('/courses', [CourseController::class, 'store']);
//    Route::put('/courses/{id}', [CourseController::class, 'update']);
//    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);
//
//    Route::get('/my-courses', [CourseController::class, 'myCourses']);
//    Route::post('/courses/{id}/categories', [CourseController::class, 'syncCategories']);
//
//    // Trainer: Termine
//    Route::post('/sessions', [CourseSessionController::class, 'store']);
//    Route::put('/sessions/{id}', [CourseSessionController::class, 'update']);
//    Route::delete('/sessions/{id}', [CourseSessionController::class, 'destroy']);
//
//    // User: Buchungen
//    Route::post('/bookings', [BookingController::class, 'store']);
//    Route::get('/my-bookings', [BookingController::class, 'myBookings']);
//    Route::put('/bookings/{id}/cancel', [BookingController::class, 'cancel']);
//
//    // Einzelnen Termin einer Buchung stornieren
//    Route::put('/session-bookings/{bookingId}/{sessionId}/cancel', [BookingController::class, 'cancelSession']);
//});









use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseSessionController;
use Illuminate\Support\Facades\Route;

// Public
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{id}', [CourseController::class, 'show']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);

// Auth
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:api')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

Route::middleware('auth:api')->group(function () {

    // User: Buchungen
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/my-bookings', [BookingController::class, 'myBookings']);
    Route::put('/bookings/{id}/cancel', [BookingController::class, 'cancel']);

    // Einzelnen Termin einer Buchung stornieren
    Route::put('/session-bookings/{bookingId}/{sessionId}/cancel', [BookingController::class, 'cancelSession']);
});

Route::middleware(['auth:api', 'trainer'])->group(function () {

    // Trainer: Kurse
    Route::post('/courses', [CourseController::class, 'store']);
    Route::put('/courses/{id}', [CourseController::class, 'update']);
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);

    Route::get('/my-courses', [CourseController::class, 'myCourses']);
    Route::post('/courses/{id}/categories', [CourseController::class, 'syncCategories']);

    // Trainer: Termine
    Route::get('/courses/{id}/sessions', [CourseSessionController::class, 'index']);
    Route::post('/sessions', [CourseSessionController::class, 'store']);
    Route::put('/sessions/{id}', [CourseSessionController::class, 'update']);
    Route::delete('/sessions/{id}', [CourseSessionController::class, 'destroy']);

    Route::get(
        '/courses/{courseId}/sessions/{sessionId}/participants',
        [CourseSessionController::class, 'participants']
    );
});
