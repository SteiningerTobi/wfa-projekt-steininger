import { Category } from '../classes/category';

export class CategoryFactory {
  static fromJson(json: any): Category {
    return new Category(
      json.id,
      json.name,
    );
  }

  static fromJsonArray(jsonArray: any[] = []): Category[] {
    return jsonArray.map(json => CategoryFactory.fromJson(json));
  }
}
