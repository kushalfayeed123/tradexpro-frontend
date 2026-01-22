import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  public notify = inject(NotificationService);

  getClasses(type: string) {
    switch (type) {
      case 'success': return 'bg-white border-l-4 border-emerald-500 text-slate-900';
      case 'error': return 'bg-white border-l-4 border-rose-500 text-slate-900';
      case 'warning': return 'bg-white border-l-4 border-amber-500 text-slate-900';
      default: return 'bg-white text-slate-900';
    }
  }
}
