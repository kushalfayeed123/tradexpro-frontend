import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Table } from '../../../common/components/table/table';
import { Store } from '@ngxs/store';
import { BehaviorSubject } from 'rxjs';
import { ApproveTransaction, ClearSelectedTransaction, FetchTransactions, RejectTransaction, ReverseTransaction, SelectTransaction } from './state/transaction.action';
import { TransactionsState } from './state/transaction.state';
import { NotificationService } from '../../../core/services/notification.service';
import { SetLoading } from '../../../auth/state/auth.actions';

@Component({
  selector: 'app-transactions',
  standalone: true, // Assuming standalone based on imports
  imports: [DecimalPipe, Table, CommonModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions {
  private store = inject(Store);
  private notify = inject(NotificationService);

  isDetailOpen = false;
  currentFilter = 'all'; // Added this to track UI state

  // NGXS Selectors
  transactions$ = this.store.select(TransactionsState.list);
  selectedTrx$ = this.store.select(TransactionsState.selected);
  loading$ = this.store.select(TransactionsState.loading);
  meta$ = this.store.select(TransactionsState.meta);
  stats$ = this.store.select(TransactionsState.stats);

  ngOnInit() {
    this.store.dispatch(new FetchTransactions());
  }


  // Filter Logic
  setFilter(type: string) {
    this.currentFilter = type;
    this.store.dispatch(new FetchTransactions({ type, page: 1 }));
  }

  onSearch(event: any) {
    const query = event.target.value;
    this.store.dispatch(new FetchTransactions({ search: query, page: 1 }));
  }

  onPageChange(page: number) {
    this.store.dispatch(new FetchTransactions({ page }));
  }

  // UI Helpers
  getAmountClass(type: string | undefined): string {
    return type === 'withdrawal' || type === 'fee' ? 'text-rose-600' : 'text-emerald-600';
  }

  getStatusColor(status: string | undefined): string {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'failed': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'reversed': return 'bg-slate-50 text-slate-500 border-slate-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  }

  viewDetails(trx: any) {
    this.store.dispatch(new SelectTransaction(trx));
    this.isDetailOpen = true;
  }

  closeDrawer() {
    this.isDetailOpen = false;
    this.store.dispatch(new ClearSelectedTransaction());
  }

  approveTrx(id: string) {
    // Optional: Add a confirmation dialog for safety
    this.store.dispatch(new ApproveTransaction(id)).subscribe(() => {
      this.closeDrawer();
    });
  }

  async rejectTrx(id: string) {
    const confirmed = await this.notify.confirm(
      'Deny Transaction?',
      'Are you sure you want to deny this transaction?',
      'OK'
    );

    if (confirmed) {
      this.store.dispatch(new RejectTransaction(id)).subscribe(() => {
        this.closeDrawer();
      });
    }


  }

  async reverseTrx(id: string) {
    const confirmed = await this.notify.confirm(
      'Reverse Transaction?',
      'Are you sure? This will move funds back and mark this record as reversed.',
      'OK'
    );

    if (confirmed) {
      this.store.dispatch(new ReverseTransaction(id)).subscribe(() => {
        this.closeDrawer();
      });
    }

  }
}