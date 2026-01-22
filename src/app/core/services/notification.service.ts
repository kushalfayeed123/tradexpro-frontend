import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ModalConfig {
    title: string;
    message: string;
    confirmText: string;
    resolve?: (value: boolean) => void;
}

export interface Toast {
    message: string;
    type: 'success' | 'error' | 'warning';
    id: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private toastsSubject = new BehaviorSubject<Toast[]>([]);
    toasts$ = this.toastsSubject.asObservable();

    private modalSubject = new BehaviorSubject<ModalConfig | null>(null);
    modal$ = this.modalSubject.asObservable();

    show(message: string, type: 'success' | 'error' | 'warning' = 'success') {
        const id = Date.now();
        const currentToasts = this.toastsSubject.value;
        this.toastsSubject.next([...currentToasts, { id, message, type }]);

        // Auto-remove after 4 seconds
        setTimeout(() => this.remove(id), 4000);
    }

    remove(id: number) {
        const filtered = this.toastsSubject.value.filter(t => t.id !== id);
        this.toastsSubject.next(filtered);
    }


    confirm(title: string, message: string, confirmText: string = 'Confirm'): Promise<boolean> {
        return new Promise((resolve) => {
            this.modalSubject.next({ title, message, confirmText, resolve });
        });
    }

    closeModal(result: boolean) {
        const config = this.modalSubject.value;
        if (config?.resolve) {
            config.resolve(result);
        }
        this.modalSubject.next(null);
    }
}