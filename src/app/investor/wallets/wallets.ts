import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { LoadOverviewData, OverviewState } from '../dashboard/state/overview.state';
import { Subscription, take, timer, map } from 'rxjs';
import { LoadActiveDepositMethods, LoadDepositMethods } from '../../admin/pages/settings/state/settings.action';
import { SettingsState } from '../../admin/pages/settings/state/settings.state';
import { AuthState } from '../../auth/state/auth.state';
import { NotificationService } from '../../core/services/notification.service';
import { CreateTransaction, FetchUserTransactions } from './state/transactions/transactions.actions';
import { InvestorTransactionState } from './state/transactions/transactions.state';

@Component({
  selector: 'app-wallets',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './wallets.html',
  styleUrl: './wallets.css',
})
export class Wallets {
  private store = inject(Store);
  balance$ = this.store.select(OverviewState.getStats);

  currentPage = 1;
  pageSize = 10;


  private fb = inject(FormBuilder);
  private notify = inject(NotificationService);

  // Selecting the entire stats object as an observable
  user$ = this.store.select(AuthState.user)
  treasuryMethods$ = this.store.select(SettingsState.getActiveMethods);
  transactions$ = this.store.select(InvestorTransactionState.getTransactions)

  depositStep = 1;
  isDepositModalOpen = false;
  selectedWallet: any = null;
  depositAmount: number = 0; userPaymentHash: string = '';
  userSenderAddress: string = '';

  // Timer logic
  remainingTime = '';
  private timerSub?: Subscription;


  isWithdrawModalOpen = false;
  withdrawForm = this.fb.group({
    amount: [0, [Validators.required, Validators.min(10)]],
    wallet_address: ['', [Validators.required, Validators.minLength(10)]],
    method: ['Bitcoin', Validators.required]
  });

  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectMethod(method: any) {
    this.selectedWallet = method;
    this.isDropdownOpen = false;
  }



  openWithdrawModal() {
    this.isWithdrawModalOpen = true;
  }

  onWithdrawSubmit() {
    if (this.withdrawForm.invalid) return;

    // Get the current balance from the store synchronously
    const currentBalance = this.store.selectSnapshot(OverviewState.getStats)?.ledger_balance || 0;
    const amount = this.withdrawForm.value.amount!;

    if (amount > currentBalance) {
      this.notify.show('Insufficient funds in ledger balance', 'error');
      return;
    }

    let userWalletId = '';
    this.user$.pipe(take(1)).subscribe((e) => {
      userWalletId = e?.wallet?.id ?? '';
    });

    this.store.dispatch(new CreateTransaction({
      amount: amount,
      type: 'withdrawal',
      reference: this.generateReference('with'),
      description: `Funds withdrawal via ${this.withdrawForm.value.method}`,
      beneficiary_address: this.withdrawForm.value.wallet_address, // User's destination
      payment_method: this.withdrawForm.value.method,
      sender_address: userWalletId, // Internal source
      txn_hash: '',
      wallet_id: userWalletId
    })).subscribe(() => this.isWithdrawModalOpen = false);
  }

  startDeposit() {
    this.depositStep = 1;
    this.isDepositModalOpen = true;
    this.store.dispatch(new LoadActiveDepositMethods());
    this.startCountdown();
  }

  startCountdown() {
    const tenMinutes = 10 * 60;
    this.timerSub?.unsubscribe();

    this.timerSub = timer(0, 1000).pipe(
      take(tenMinutes + 1),
      map(seconds => tenMinutes - seconds)
    ).subscribe({
      next: (secondsLeft) => {
        const mins = Math.floor(secondsLeft / 60);
        const secs = secondsLeft % 60;
        this.remainingTime = `${mins}:${secs.toString().padStart(2, '0')}`;
        if (secondsLeft === 0) this.closeDepositModal();
      }
    });
  }

  generateReference(type: string) {
    return `${type}-${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`;
  }

  copyAddress(address: string) { }

  confirmDeposit() {
    let userWalletId = ''
    this.user$.pipe(take(1)).subscribe((e) => {
      userWalletId = e?.wallet?.id ?? '';
    });
    const payload = {
      amount: this.depositAmount,
      type: 'deposit',
      reference: this.generateReference('dep'),
      description: `Funds deposit via ${this.selectedWallet.asset_name}`,
      wallet_id: userWalletId,
      beneficiary_address: this.selectedWallet.wallet_address,
      payment_method: this.selectedWallet.asset_name,
      sender_address: this.userSenderAddress, // New field
      txn_hash: this.userPaymentHash,
    };

    this.store.dispatch(new CreateTransaction(payload)).subscribe(() => {
      this.closeDepositModal();
      this.userPaymentHash = ''; // Reset trackers
      this.userSenderAddress = '';
      this.store.dispatch(new LoadOverviewData());
    });
  }

  closeDepositModal() {
    this.isDepositModalOpen = false;
    this.timerSub?.unsubscribe();
  }

  ngOnInit() {

    this.loadTransactions();
  }


  loadTransactions(page: number = 1) {
    this.currentPage = page;
    this.store.dispatch(new FetchUserTransactions({
      page: this.currentPage,
      limit: this.pageSize
    }));
  }

  nextPage(totalData: any) {
    // Logic to prevent going past the last page
    if (this.currentPage * this.pageSize < totalData.total) {
      this.loadTransactions(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.loadTransactions(this.currentPage - 1);
    }
  }
}
