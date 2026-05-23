import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, retry, throwError } from 'rxjs';

import { Course } from './classes/course';
import { CourseFactory } from './factories/course.factory';

export interface CategoryOption {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CourseSystem {
  private api = 'http://fitness26.s2310456022.student.kwmhgb.at/api';

  private http = inject(HttpClient);

  getAll(): Observable<Course[]> {
    return this.http.get<any[]>(`${this.api}/courses`).pipe(
      map(json => CourseFactory.fromJsonArray(json)),
      retry(3),
      catchError(this.errorHandler)
    );
  }

  getSingle(id: number): Observable<Course> {
    return this.http.get<any>(`${this.api}/courses/${id}`).pipe(
      map(json => CourseFactory.fromJson(json)),
      retry(3),
      catchError(this.errorHandler)
    );
  }

  getCategories(): Observable<CategoryOption[]> {
    return this.http.get<CategoryOption[]>(`${this.api}/categories`).pipe(
      retry(3),
      catchError(this.errorHandler)
    );
  }

  create(course: unknown): Observable<unknown> {
    return this.http.post(`${this.api}/courses`, course).pipe(
      catchError(this.errorHandler)
    );
  }

  destroy(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/courses/${id}`);
  }

  update(id: number, course: unknown): Observable<unknown> {
    return this.http.put(`${this.api}/courses/${id}`, course).pipe(
      catchError(this.errorHandler)
    );
  }

  private errorHandler(error: Error | any): Observable<never> {
    return throwError(() => error);
  }

  getCourseSessions(courseId: number) {
    return this.http.get<any[]>(`${this.api}/courses/${courseId}/sessions`);
  }

  createCourseSession(courseId: number, payload: {
    start_date: string;
    duration: number;
  }) {
    return this.http.post<any>(`${this.api}/sessions`, {
      ...payload,
      course_id: courseId
    });
  }

  updateCourseSession(sessionId: number, payload: {
    start_date: string;
    duration: number;
  }) {
    return this.http.put<any>(`${this.api}/sessions/${sessionId}`, payload);
  }

  deleteCourseSession(sessionId: number) {
    return this.http.delete<void>(`${this.api}/sessions/${sessionId}`);
  }

  getSessionParticipants(courseId: number, sessionId: number) {
    return this.http.get<{
      course: {
        id: number;
        title: string;
      };
      session: {
        id: number;
        start_date: string;
        duration: number;
        status: string | null;
      };
      participants: {
        booking_id: number;
        booking_status: string;
        participant_status: string | null;
        booked_at: string;
        user: {
          id: number;
          user_name: string;
          email: string;
        };
      }[];
    }>(`${this.api}/courses/${courseId}/sessions/${sessionId}/participants`);
  }
}
