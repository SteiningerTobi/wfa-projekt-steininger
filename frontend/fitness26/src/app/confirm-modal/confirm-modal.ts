import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'bs-confirm-modal',
  standalone: true,
  templateUrl: './confirm-modal.html'
})
export class ConfirmModal {
  @Input() isOpen = false;
  @Input() title = 'Bist du sicher?';
  @Input() message = 'Diese Aktion kann nicht rückgängig gemacht werden.';
  @Input() confirmText = 'Bestätigen';
  @Input() cancelText = 'Abbrechen';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  confirm(): void {
    this.confirmed.emit();
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
