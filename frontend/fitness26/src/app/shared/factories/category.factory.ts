import { Category } from '../classes/category';

// Factory zum Umwandeln von Category-JSON in Category-Objekte.
export class CategoryFactory {
  // Erstellt ein einzelnes Category-Objekt aus Backend-JSON.
  static fromJson(json: any): Category {
    return new Category(
      json.id,
      json.name,
    );
  }

  // Erstellt mehrere Category-Objekte aus einem JSON-Array.
  static fromJsonArray(jsonArray: any[] = []): Category[] {
    return jsonArray.map(json => CategoryFactory.fromJson(json));
  }
}
