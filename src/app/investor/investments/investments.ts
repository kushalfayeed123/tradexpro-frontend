import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { FetchMyInvestments } from './state/user-investment.actions';
import { MyInvestmentsState } from './state/user-investment.state';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-investments',
  imports: [CommonModule, FormsModule],
  templateUrl: './investments.html',
  styleUrl: './investments.css',
})
export class Investments implements OnInit {
  private store = inject(Store);

  investments$ = this.store.select(MyInvestmentsState.getInvestments);
  loading$ = this.store.select(MyInvestmentsState.isLoading);

  getTotalPrincipal(items: any[]): number {
    return items.reduce((acc, curr) => acc + Number(curr.principal), 0);
  }

  getTotalReturns(items: any[]): number {
    return items.reduce((acc, curr) => acc + Number(curr.accrued_return), 0);
  }

  ngOnInit() {
    this.store.dispatch(new FetchMyInvestments());
  }
}
