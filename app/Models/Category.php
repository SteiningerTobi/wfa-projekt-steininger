<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Model für eine Kurskategorie.
 */
class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    /**
     * Verknüpft eine Kategorie mit mehreren Kursen.
     */
    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(
            Course::class,
            'course_category'
        );
    }
}
