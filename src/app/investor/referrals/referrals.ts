import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { AuthState } from '../../auth/state/auth.state';
import { UiService } from '../../core/services/ui.service';
import { LoadReferralStats } from './state/referrals.actions';
import { ReferralState } from './state/referrals.state';

@Component({
  selector: 'app-referrals',
  imports: [CommonModule],
  templateUrl: './referrals.html',
  styleUrl: './referrals.css',
})
export class Referrals implements OnInit {
  private store = inject(Store);
  private ui = inject(UiService);

  // Bind to NGXS Selectors
  stats$ = this.store.select(ReferralState.stats);
  loading$ = this.store.select(ReferralState.loading);

  ngOnInit() {
    const user = this.store.selectSnapshot(AuthState.user);
    if (user) {
      this.store.dispatch(new LoadReferralStats(user.id));
    }
  }

  copyLink(code: string) {
    const link = `${window.location.origin}/register?ref=${code}`;
    navigator.clipboard.writeText(link);
    this.ui.showModal('Referral link copied!', 'success');
  }
}
