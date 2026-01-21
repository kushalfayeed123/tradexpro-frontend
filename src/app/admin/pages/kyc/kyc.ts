import { Component } from '@angular/core';

@Component({
  selector: 'app-kyc',
  imports: [],
  templateUrl: './kyc.html',
  styleUrl: './kyc.css',
})
export class Kyc {
isLightboxOpen = false;
  selectedUser: any = null; // Set this when a user is clicked
  
  // Mock data for the list
  pendingKycs = [
    { id: 1, name: 'Jane Doe', email: 'jane@example.com', type: 'Passport', status: 'Pending', date: '2h ago', level: 2 },
    { id: 2, name: 'Robert Fox', email: 'robert.f@mail.com', type: 'Driver License', status: 'Pending', date: '5h ago', level: 1 }
  ];

  openReview(user: any) {
    this.selectedUser = user;
  }
}
