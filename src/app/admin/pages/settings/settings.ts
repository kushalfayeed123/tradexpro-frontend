import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepositMethod, SettingsService } from '../../../core/services/settings.service';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LoadDepositMethods, UpdateDepositMethod, AddDepositMethod, DeleteDepositMethod } from './state/settings.action';
import { SettingsState } from './state/settings.state';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private notify = inject(NotificationService);

  depositForm: FormGroup;
  isModalOpen = false;
  editingId: string | null = null;

  activeCount$ = this.store.select(SettingsState.activeCount);
  methods$ = this.store.select(SettingsState.getMethods);

  constructor() {
    this.depositForm = this.fb.group({
      asset_name: ['', Validators.required],
      network: ['', Validators.required],
      wallet_address: ['', Validators.required],
      instructions: [''],
      is_active: [true]
    });
  }

  ngOnInit() {
    this.store.dispatch(new LoadDepositMethods());
  }

  onSubmit() {
    if (this.depositForm.invalid) return;
    const data = this.depositForm.value;

    if (this.editingId) {
      this.store.dispatch(new UpdateDepositMethod({ ...data, id: this.editingId }))
        .subscribe(() => this.closeModal());
    } else {
      this.store.dispatch(new AddDepositMethod(data))
        .subscribe(() => this.closeModal());
    }
  }

  toggleStatus(method: any) {
    const updated = { ...method, is_active: !method.is_active };
    this.store.dispatch(new UpdateDepositMethod(updated));
  }

  async deleteMethod(id: string) {
    const confirm = await this.notify.confirm('Delete Payment Method', 'Permanently delete this deposit gateway?')
    if (confirm) {
      this.store.dispatch(new DeleteDepositMethod(id));
    }
  }

  openFormModal(method?: any) {
    this.editingId = method?.id || null;
    method ? this.depositForm.patchValue(method) : this.depositForm.reset({ is_active: true });
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.depositForm.reset({ is_active: true });
  }
}