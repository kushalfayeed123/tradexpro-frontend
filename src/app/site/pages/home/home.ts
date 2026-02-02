import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  downloadPDF() {
    const link = document.createElement('a');
    link.href = 'prospera_whitepaper_v5.pdf';
    link.download = 'prospera_whitepaper_v5.pdf';
    link.click();
  }
}
