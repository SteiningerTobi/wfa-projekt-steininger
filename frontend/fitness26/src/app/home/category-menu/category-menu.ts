import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type CategoryMenuItem = {
  id: number;
  name: string;
  image: string;
};

@Component({
  selector: 'bs-category-menu',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './category-menu.html',
  styleUrl: './category-menu.css'
})
export class CategoryMenu {
  categories: CategoryMenuItem[] = [
    {
      id: 1,
      name: 'Yoga',
      image: '/category-imgs/yoga.jpg'
    },
    {
      id: 2,
      name: 'Krafttraining',
      image: '/category-imgs/krafttraining.jpg'
    },
    {
      id: 3,
      name: 'Ausdauer',
      image: '/category-imgs/ausdauer.jpg'
    },
    {
      id: 4,
      name: 'Pilates',
      image: '/category-imgs/pilates.jpg'
    },
    {
      id: 5,
      name: 'HIIT',
      image: '/category-imgs/hiit.jpg'
    }
  ];
}
