import {Component, ElementRef, HostListener, ViewChild, inject, signal, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { toSignal } from '@angular/core/rxjs-interop';

import { CategorySystem } from '../shared/category-service';

@Component({
  selector: 'bs-search',
  standalone: true,
  imports: [],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search implements OnInit{
  private router = inject(Router);
  private categorySystem = inject(CategorySystem);
  private route = inject(ActivatedRoute);


  @ViewChild('categoryDropdown') categoryDropdown?: ElementRef<HTMLElement>;

  isCategoryDropdownOpen = false;

  categories = toSignal(this.categorySystem.getAll(), {
    initialValue: []
  });

  searchTerm = signal('');
  selectedCategoryIds = signal<number[]>([]);

  updateSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  toggleCategoryDropdown(): void {
    this.isCategoryDropdownOpen = !this.isCategoryDropdownOpen;
  }

  toggleCategory(categoryId: number): void {
    const selected = this.selectedCategoryIds();

    if (selected.includes(categoryId)) {
      this.selectedCategoryIds.set(selected.filter(id => id !== categoryId));
    } else {
      this.selectedCategoryIds.set([...selected, categoryId]);
    }
  }

  isCategorySelected(categoryId: number): boolean {
    return this.selectedCategoryIds().includes(categoryId);
  }

  resetCategories(): void {
    this.selectedCategoryIds.set([]);
  }

  applyCategories(): void {
    this.isCategoryDropdownOpen = false;
  }

  searchCourses(): void {
    const queryParams: any = {};

    const search = this.searchTerm().trim();
    const categories = this.selectedCategoryIds();

    if (search.length > 0) {
      queryParams.search = search;
    }

    if (categories.length > 0) {
      queryParams.categories = categories.join(',');
    }

    this.router.navigate(['/courses'], {
      queryParams
    });

    this.isCategoryDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  closeDropdownOnOutsideClick(event: MouseEvent): void {
    if (!this.isCategoryDropdownOpen) {
      return;
    }

    const clickedElement = event.target as Node;
    const dropdownElement = this.categoryDropdown?.nativeElement;

    if (dropdownElement && !dropdownElement.contains(clickedElement)) {
      this.isCategoryDropdownOpen = false;
    }
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const categoriesParam = params.get('categories');
      const searchParam = params.get('search');

      if (searchParam) {
        this.searchTerm.set(searchParam);
      } else {
        this.searchTerm.set('');
      }

      if (categoriesParam) {
        const ids = categoriesParam
          .split(',')
          .map(id => Number(id))
          .filter(id => !Number.isNaN(id));

        this.selectedCategoryIds.set(ids);
      } else {
        this.selectedCategoryIds.set([]);
      }
    });
  }
}
