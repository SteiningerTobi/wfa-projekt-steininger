import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, retry, throwError } from 'rxjs';

import { Category } from './classes/category';
import { CategoryFactory } from './factories/category.factory';

@Injectable({
  providedIn: 'root',
})
export class CategorySystem {
  private api = 'http://fitness26.s2310456022.student.kwmhgb.at/api';

  private http = inject(HttpClient);

  getAll(): Observable<Category[]> {
    return this.http.get<any[]>(`${this.api}/categories`).pipe(
      map(json => CategoryFactory.fromJsonArray(json)),
      retry(3),
      catchError(this.errorHandler)
    );
  }

  getSingle(id: number): Observable<Category> {
    return this.http.get<any>(`${this.api}/categories/${id}`).pipe(
      map(json => CategoryFactory.fromJson(json)),
      retry(3),
      catchError(this.errorHandler)
    );
  }

  private errorHandler(error: Error | any): Observable<never> {
    return throwError(() => error);
  }
}
