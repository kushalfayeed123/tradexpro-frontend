import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-investor-layout',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './investor-layout.html',
  styleUrl: './investor-layout.css',
})
export class InvestorLayout {

}
