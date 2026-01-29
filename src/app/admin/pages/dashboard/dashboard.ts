import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { GetDashboardSummary } from './state/dashboard.actions';
import { AdminState } from './state/dashboard.state';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
private store = inject(Store);

  // Observable selectors for the template
  summary$ = this.store.select(AdminState.summary);
  loading$ = this.store.select(AdminState.isLoading);

  ngOnInit() {
    this.store.dispatch(new GetDashboardSummary());
  }

  refreshData() {
    this.store.dispatch(new GetDashboardSummary());
  }
}
