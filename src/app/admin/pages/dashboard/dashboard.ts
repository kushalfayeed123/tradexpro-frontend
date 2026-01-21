import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
stats = [
    { label: 'Total Users', value: 1280 },
    { label: 'Active Investments', value: 342 },
    { label: 'Total Revenue', value: '₦84.5M' },
    { label: 'Pending Requests', value: 19 },
  ];

  recentActivities = [
    { user: 'John Doe', action: 'Created investment', date: '2025-01-12' },
    { user: 'Jane Smith', action: 'Withdrawal request', date: '2025-01-12' },
    { user: 'Michael Lee', action: 'Updated profile', date: '2025-01-11' },
    { user: 'Sarah Brown', action: 'New registration', date: '2025-01-11' },
  ];
}
