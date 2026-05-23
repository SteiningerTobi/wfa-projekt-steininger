<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'difficulty',
        'max_capacity',
        'image_path',
        'address',
        'trainer_id',
    ];

    protected $casts = [
        'difficulty' => 'string',
        'max_capacity' => 'integer',
    ];

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'trainer_id');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(
            Category::class,
            'course_category',
            'course_id',
            'category_id'
        );
    }

    public function sessions(): HasMany
    {
        return $this->hasMany(CourseSession::class);
    }
}
