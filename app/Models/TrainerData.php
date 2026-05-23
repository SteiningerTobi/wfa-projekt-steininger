<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainerData extends Model
{
    use HasFactory;

    protected $table = 'trainer_data';

    protected $fillable = [
        'user_id',
        'bio',
        'phone',
        'contact_mail',
        'profile_image',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
