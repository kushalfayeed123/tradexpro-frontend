import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-investment-plans',
  imports: [CommonModule, FormsModule],
  templateUrl: './investment-plans.html',
  styleUrl: './investment-plans.css',
})
export class InvestmentPlans {
  isEditorOpen = false;
  selectedPlan: any = {
    name: '',
    min_amount: 0,
    max_amount: 0,
    interest_rate: 0,
    duration_days: 0,
    description: ''
  };
  plans = [
    {
      name: 'Starter Equity',
      min_amount: 1000,
      max_amount: 10000,
      duration_days: 90,
      interest_rate: 5.5,
      status: 'active',
      description: 'Entry-level plan for retail investors focusing on blue-chip stocks.'
    },
    {
      name: 'Real Estate Pro',
      min_amount: 25000,
      max_amount: 500000,
      duration_days: 365,
      interest_rate: 12.0,
      status: 'active',
      description: 'High-yield commercial real estate portfolio with annual maturation.'
    }
  ];

  openEditor(plan: any = null) {
    this.selectedPlan = plan ? { ...plan } : { status: 'active' };
    this.isEditorOpen = true;
  }
}
