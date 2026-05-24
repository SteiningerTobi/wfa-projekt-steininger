<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Model für einen Fitnesskurs.
 */
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

    /**
     * Verknüpft den Kurs mit dem zugehörigen Trainer.
     */
    public function trainer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'trainer_id');
    }

    /**
     * Verknüpft den Kurs mit seinen Kategorien.
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(
            Category::class,
            'course_category',
            'course_id',
            'category_id'
        );
    }

    /**
     * Verknüpft den Kurs mit seinen Kursterminen.
     */
    public function sessions(): HasMany
    {
        return $this->hasMany(CourseSession::class);
    }
}
