import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast { message: string; type: 'success' | 'error' | 'info'; id: number; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();
  private counter = 0;

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3500): void {
    const id = ++this.counter;
    const toast: Toast = { message, type, id };
    this.toastsSubject.next([...this.toastsSubject.value, toast]);
    setTimeout(() => this.dismiss(id), duration);
  }

  success(message: string): void { this.show(message, 'success'); }
  error(message: string): void { this.show(message, 'error'); }
  info(message: string): void { this.show(message, 'info'); }

  dismiss(id: number): void {
    this.toastsSubject.next(this.toastsSubject.value.filter(t => t.id !== id));
  }
}
