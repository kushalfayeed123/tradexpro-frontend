import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kyc',
  imports: [],
  templateUrl: './kyc.html',
  styleUrl: './kyc.css',
})
export class Kyc {

  private location = inject(Location)
  private router = inject(Router)
  goBack(): void {
    // If there is a history, go back
    if (window.history.length > 1) {
      this.location.back();
    } else {
      // Fallback: If they opened the link directly, send them to the dashboard
      this.router.navigate(['/dashboard']);
    }
  }
}
