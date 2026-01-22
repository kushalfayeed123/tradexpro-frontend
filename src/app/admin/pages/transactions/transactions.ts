import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-transactions',
  imports: [DecimalPipe],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions {
  isDetailOpen = false;
  selectedTrx: any = null;
  // Filters
  selectedStatus = 'All';

  transactions = [
    { id: 'TRX-9901', user: 'Alex Thompson', amount: 25000.00, type: 'Deposit', method: 'Wire Transfer', status: 'Completed', date: 'Jan 20, 2026' },
    { id: 'TRX-9902', user: 'Jane Doe', amount: 1200.00, type: 'Withdrawal', method: 'ACH', status: 'Pending', date: 'Jan 21, 2026' },
    { id: 'TRX-9903', user: 'Michael Wright', amount: 5500.00, type: 'Investment', method: 'Wallet Balance', status: 'Completed', date: 'Jan 19, 2026' },
    { id: 'TRX-9904', user: 'Sarah Jenkins', amount: 450.00, type: 'Dividend', method: 'Internal', status: 'Processing', date: 'Jan 21, 2026' },
  ];

  viewDetails(trx: any) {
    this.selectedTrx = trx;
    this.isDetailOpen = true;
  }
}
