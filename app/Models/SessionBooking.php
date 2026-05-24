<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SessionBooking extends Model
{
    protected $table = 'session_bookings';

    // Die Pivot-Tabelle verwendet keinen eigenen Auto-Increment-Primary-Key.
    protected $primaryKey = null;
    public $incrementing = false;

    protected $fillable = [
        'session_id',
        'booking_id',
        'status',
        'cancelled_at',
    ];

    protected $casts = [
        'cancelled_at' => 'datetime',
        'status' => 'string',
    ];

    /**
     * Verknüpft die Terminbuchung mit dem zugehörigen Kurstermin.
     */
    public function courseSession()
    {
        return $this->belongsTo(CourseSession::class, 'session_id');
    }

    /**
     * Verknüpft die Terminbuchung mit der zugehörigen Buchung.
     */
    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }
}
