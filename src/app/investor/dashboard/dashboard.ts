import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { LoadOverviewData } from './state/overview.actions';
import { OverviewState } from './state/overview.state';
import { map, Subscription, take, timer } from 'rxjs';
import { LoadActiveDepositMethods, LoadDepositMethods } from '../../admin/pages/settings/state/settings.action';
import { UsersState } from '../../admin/pages/users/state/users.state';
import { AuthState } from '../../auth/state/auth.state';
import { SettingsState } from '../../admin/pages/settings/state/settings.state';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateTransaction } from '../wallets/state/transactions/transactions.actions';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private notify = inject(NotificationService);

  // Selecting the entire stats object as an observable
  stats$ = this.store.select(OverviewState.getStats);
  user$ = this.store.select(AuthState.user)
  treasuryMethods$ = this.store.select(SettingsState.getActiveMethods);

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
    this.withdrawForm.value.method = method;
    this.selectedWallet = method
    this.isDropdownOpen = false;
  }


  openWithdrawModal() {
    this.store.dispatch(new LoadActiveDepositMethods());

    this.isWithdrawModalOpen = true;
  }

  onWithdrawSubmit(currentBalance: number) {
    if (this.withdrawForm.invalid) return;
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
      description: `Funds withdrawal via ${this.selectedWallet.asset_name}`,
      beneficiary_address: this.withdrawForm.value.wallet_address, // User's destination
      payment_method: this.selectedWallet.asset_name,
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
      this.store.dispatch(new LoadOverviewData()); // Refresh balances
    });
  }

  closeDepositModal() {
    this.isDepositModalOpen = false;
    this.timerSub?.unsubscribe();
  }

  ngOnInit() {
    this.store.dispatch(new LoadOverviewData());
  }
}
