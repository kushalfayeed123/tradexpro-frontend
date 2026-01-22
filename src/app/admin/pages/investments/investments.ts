import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-investments',
  imports: [CommonModule],
  templateUrl: './investments.html',
  styleUrl: './investments.css',
})
export class Investments {
  // Filter state
  activeFilter = 'all';

  // Mock data based on your schema
  investments = [
    {
      id: 'INV-001',
      user: { name: 'Alex Thompson', email: 'alex.t@finmail.com' },
      plan: { name: 'Real Estate Pro' },
      principal: 50000.00,
      accrued_return: 1250.40,
      status: 'active',
      start_date: '2025-11-01',
      end_date: '2026-11-01'
    },
    {
      id: 'INV-002',
      user: { name: 'Sarah Jenkins', email: 's.jenkins@provider.com' },
      plan: { name: 'Starter Equity' },
      principal: 5000.00,
      accrued_return: 0,
      status: 'pending',
      start_date: '2026-01-20',
      end_date: '2026-04-20'
    }
  ];

  calculateProgress(start: string, end: string): number {
    const total = new Date(end).getTime() - new Date(start).getTime();
    const current = new Date().getTime() - new Date(start).getTime();
    return Math.min(Math.max(Math.round((current / total) * 100), 0), 100);
  }
}
