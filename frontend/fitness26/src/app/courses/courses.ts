import { Component } from '@angular/core';
import {CourseList} from './course-list/course-list';

//Page-Component für die Seite der Kurse
@Component({
  selector: 'bs-courses',
  imports: [
    CourseList
  ],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses {}
