import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, retry, throwError } from 'rxjs';

import { Course } from './classes/course';
import { CourseFactory } from './factories/course.factory';

export interface CategoryOption {
  id: number;
  name: string;
}

// Service für Kursdaten, Kurstermine, Kategorien und Teilnehmerlisten.
@Injectable({
  providedIn: 'root',
})
export class CourseSystem {
  private api = 'http://fitness26.s2310456022.student.kwmhgb.at/api';

  private http = inject(HttpClient);

  // Lädt alle Kurse und wandelt JSON-Daten in Course-Objekte um.
  getAll(): Observable<Course[]> {
    return this.http.get<any[]>(`${this.api}/courses`).pipe(
      map(json => CourseFactory.fromJsonArray(json)),
      retry(3),
      catchError(this.errorHandler)
    );
  }

  // Lädt einen einzelnen Kurs anhand seiner ID.
  getSingle(id: number): Observable<Course> {
    return this.http.get<any>(`${this.api}/courses/${id}`).pipe(
      map(json => CourseFactory.fromJson(json)),
      retry(3),
      catchError(this.errorHandler)
    );
  }

  // Lädt Kategorien für Kursformulare.
  getCategories(): Observable<CategoryOption[]> {
    return this.http.get<CategoryOption[]>(`${this.api}/categories`).pipe(
      retry(3),
      catchError(this.errorHandler)
    );
  }

  // Erstellt einen neuen Kurs.
  create(course: unknown): Observable<unknown> {
    return this.http.post(`${this.api}/courses`, course).pipe(
      catchError(this.errorHandler)
    );
  }

  // Löscht einen Kurs.
  destroy(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/courses/${id}`);
  }

  // Aktualisiert einen bestehenden Kurs.
  update(id: number, course: unknown): Observable<unknown> {
    return this.http.put(`${this.api}/courses/${id}`, course).pipe(
      catchError(this.errorHandler)
    );
  }

  // Gibt Fehler an die aufrufende Komponente weiter.
  private errorHandler(error: Error | any): Observable<never> {
    return throwError(() => error);
  }

  // Lädt alle Termine eines Kurses.
  getCourseSessions(courseId: number) {
    return this.http.get<any[]>(`${this.api}/courses/${courseId}/sessions`);
  }

  // Erstellt einen neuen Termin für einen Kurs.
  createCourseSession(courseId: number, payload: {
    start_date: string;
    duration: number;
  }) {
    return this.http.post<any>(`${this.api}/sessions`, {
      ...payload,
      course_id: courseId
    });
  }

  // Aktualisiert einen bestehenden Kurstermin.
  updateCourseSession(sessionId: number, payload: {
    start_date: string;
    duration: number;
  }) {
    return this.http.put<any>(`${this.api}/sessions/${sessionId}`, payload);
  }

  // Löscht einen Kurstermin.
  deleteCourseSession(sessionId: number) {
    return this.http.delete<void>(`${this.api}/sessions/${sessionId}`);
  }

  // Lädt die Teilnehmer:innen eines bestimmten Kurstermins.
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
