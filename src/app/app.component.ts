import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { PoMenuItem, PoMenuModule, PoPageModule, PoToolbarModule } from '@po-ui/ng-components';

@Component({
  selector: 'app-root',
  imports: [CommonModule, PoToolbarModule, PoMenuModule, PoPageModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  readonly menus: PoMenuItem[] = [
    { label: 'Página inicial', shortLabel: 'Inicio', link: './', icon: 'an an-house-line' },
    { label: 'Outros exemplos', shortLabel: 'Exemplos', link: 'examples', icon: 'an an-grid-four' }
  ];

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(): void {
    console.log(`teste`)
  }
}
