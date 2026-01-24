import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { FetchPlans, SavePlan, TogglePlanStatus } from './state/investment-plans.actions';
import { InvestmentPlansState } from './state/investment-plans.state';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-investment-plans',
  imports: [CommonModule, FormsModule],
  templateUrl: './investment-plans.html',
  styleUrl: './investment-plans.css',
})
export class InvestmentPlans {
  private store = inject(Store);
  private notify = inject(NotificationService);

  plans$ = this.store.select(InvestmentPlansState.plans);
  isEditorOpen = false;
  selectedPlan: any = {};

  ngOnInit() {
    this.store.dispatch(new FetchPlans());
  }

  openEditor(plan?: any) {
    console.log(plan)
    // If plan exists, we clone it to avoid mutating state directly
    this.selectedPlan = plan ? { ...plan } : {
      name: '',
      min_amount: 100,
      max_amount: 10000,
      duration_days: 30,
      interest_rate: 5,
      description: '',
      status: 'active'
    };
    this.isEditorOpen = true;
  }

  savePlan() {
    if (!this.selectedPlan.name) return;

    this.store.dispatch(new SavePlan(this.selectedPlan)).subscribe({
      next: () => {
        this.notify.show(`Plan was updated successfully`, 'success');

        this.isEditorOpen = false;
      },
      error: (err) => this.notify.show(err.error.message, 'error')
    });
  }


  togglePlan(plan: any) {
    // 1. Create a copy to avoid immediate UI flickering before the API confirms
    const updatedPlan = { ...this.selectedPlan };

    // 2. Toggle logic (Ensure it matches your DB lowercase 'active'/'inactive')
    updatedPlan.status = this.selectedPlan.status === 'active' ? 'inactive' : 'active';

    // 3. Dispatch the save action
    this.store.dispatch(new SavePlan(updatedPlan)).subscribe({
      next: () => {
        this.notify.show(`Plan marked as ${updatedPlan.status}`, 'success');
        this.isEditorOpen = false;
      },
      error: (err) => {
        // If backend fails (e.g., validation error), show the message
        const msg = Array.isArray(err.error.message) ? err.error.message[0] : err.error.message;
        this.notify.show(msg, 'error');
      }
    });
  }
}
