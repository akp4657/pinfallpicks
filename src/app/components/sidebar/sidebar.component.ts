import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface SidebarItem {
  name: string;
  url: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{

  // Default Items which will show 'Loading...'
  sidebarItems: SidebarItem[] = [{
    name: 'Loading...',
    url: ''
  }];

  constructor(public router: Router) {
  }

  ngOnInit(): void {
  }

  // Move to a specific user's page
  navigateToTeam(url: string) {
  }
}