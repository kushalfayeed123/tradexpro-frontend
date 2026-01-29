import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetUserKyc, InitiateKyc, SubmitKycDocument, ViewKycDocument } from './state/kyc.actions';
import { KycState } from './state/kyc.state';

@Component({
  selector: 'app-kyc',
  imports: [CommonModule],
  templateUrl: './kyc.html',
  styleUrl: './kyc.css',
})
export class Kyc implements OnInit {

  private location = inject(Location)
  private router = inject(Router)
  private store = inject(Store)
  kyc$ = this.store.select(KycState.getKycRecord);
  loading$ = this.store.select(KycState.loading);

  goBack(): void {
    // If there is a history, go back
    if (window.history.length > 1) {
      this.location.back();
    } else {
      // Fallback: If they opened the link directly, send them to the dashboard
      this.router.navigate(['/dashboard']);
    }
  }




  ngOnInit() {
    this.store.dispatch(new GetUserKyc());
  }

  onUpgrade() {
    // Logic to open a modal or navigate to a multi-step upload form
    this.store.dispatch(new InitiateKyc(2));
  }


  onFileSelected(event: any, selectedDocType: string) {
    const file = event.target.files[0];
    if (file) {
      this.store.dispatch(new SubmitKycDocument(file, selectedDocType));
    }
  }

  viewDocument(path: string) {
    this.store.dispatch(new ViewKycDocument(path));
  }

}
