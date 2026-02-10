import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { LoadAdminPromoData } from './state/promotion.action';
import { AdminPromoState } from './state/promotion.state';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promotion',
  imports: [CommonModule],
  templateUrl: './promotion.html',
  styleUrl: './promotion.css',
})
export class Promotion {
  private store = inject(Store);

  // Selectors from NGXS
  stats$ = this.store.select(AdminPromoState.stats);
  referrals$ = this.store.select(AdminPromoState.referrals);

  ngOnInit() {
    this.store.dispatch(new LoadAdminPromoData());
  }

  // Helper for status badge styling
  getStatusClass(status: string) {
    return status === 'rewarded'
      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
      : 'bg-amber-100 text-amber-700 border-amber-200';
  }
}
