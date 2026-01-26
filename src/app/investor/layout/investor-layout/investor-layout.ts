import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Topnav } from '../topnav/topnav';

@Component({
  selector: 'app-investor-layout',
  imports: [CommonModule, RouterOutlet, Sidebar, Topnav],
  templateUrl: './investor-layout.html',
  styleUrl: './investor-layout.css',
})
export class InvestorLayout {

}
