import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ModalState {
  show: boolean;
  title: string;
  message: string;
  success: boolean;
}

@Injectable({ providedIn: 'root' })
export class UiService {
  private modalSubject = new BehaviorSubject<ModalState>({
    show: false, title: '', message: '', success: true
  });

  modal$ = this.modalSubject.asObservable();

  showModal(title: string, message: string, success: boolean = true) {
    this.modalSubject.next({ show: true, title, message, success });
  }

  hideModal() {
    this.modalSubject.next({ ...this.modalSubject.value, show: false });
  }
}