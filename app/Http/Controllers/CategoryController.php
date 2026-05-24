<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Controller für das Abrufen von Kategorien.
 */
class CategoryController extends Controller
{
    /**
     * Gibt alle Kategorien zurück.
     */
    public function index(): JsonResponse
    {
        return response()->json(Category::all());
    }

    /**
     * Gibt eine einzelne Kategorie anhand ihrer ID zurück.
     */
    public function show($id): JsonResponse
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'message' => 'Category not found'
            ], 404);
        }

        return response()->json($category);
    }
}
