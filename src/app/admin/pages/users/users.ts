import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { FetchUsers, SelectUser, ClearSelectedUser } from './state/users.action';
import { UsersState } from './state/users.state';
import { User } from '../../../common/models/user.model';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  private store = inject(Store);
  isUserDrawerOpen = false

  users$ = this.store.select(UsersState.list);
  selectedUser$ = this.store.select(UsersState.selected);
  loading$ = this.store.select(UsersState.loading);
  meta$ = this.store.select(UsersState.meta);




  ngOnInit() {
    this.store.dispatch(new FetchUsers());
  }

  // Track current filter for UI highlights
  currentFilter: string = 'all';


  // Helper to calculate the "Showing X to Y" numbers
  getRangeStart(meta: any): number {
    return (meta.page - 1) * meta.limit + 1;
  }

  getRangeEnd(meta: any): number {
    return Math.min(meta.page * meta.limit, meta.total);
  }

  // Action to trigger a page change
  onPageChange(page: number) {
    if (page < 1) return;
    this.store.dispatch(new FetchUsers({ page: page, limit: 10 }));
  }

  // Mapping for Status Badge Colors
  getStatusColor(status: string | undefined): string {
    switch (status) {
      case 'investor': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'admin': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  }

  setFilter(filter: string) {
    this.currentFilter = filter;
    const kyc_status = filter === 'all' ? undefined : filter;
    this.store.dispatch(new FetchUsers({ kyc_status: kyc_status }));
  }

  openDetails(user: User) {
    this.store.dispatch(new SelectUser(user));
    this.isUserDrawerOpen = true;
  }

  closeDrawer() {
    this.isUserDrawerOpen = false;
    this.store.dispatch(new ClearSelectedUser());
  }

  getInitials(fullName: string | null | undefined): string {
    // 1. Guard against null, undefined, or empty strings
    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      return '??';
    }

    const cleanName = fullName.trim();
    const parts = cleanName.split(/\s+/); // Splits by any whitespace

    // 2. Handle single name
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }

    // 3. Handle multiple names (First + Last)
    const firstInitial = parts[0][0];
    const lastInitial = parts[parts.length - 1][0];

    return (firstInitial + lastInitial).toUpperCase();
  }

  // user-directory.component.ts

  getVisiblePages(current: number, total: number): number[] {
    const maxVisible = 5; // How many buttons to show
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + maxVisible - 1);

    // Adjust start if we are near the end
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  suspendUser(userId: string) { }
}
