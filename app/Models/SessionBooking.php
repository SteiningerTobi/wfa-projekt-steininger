<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

use Illuminate\Database\Eloquent\Model;

class SessionBooking extends Model
{
    protected $table = 'session_bookings';

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

    public function courseSession()
    {
        return $this->belongsTo(CourseSession::class, 'session_id');
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }
}
