import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  PoInfoModule,
  PoMenuItem,
  PoMenuModule,
  PoModalComponent,
  PoModalModule,
  PoToolbarAction,
  PoToolbarModule,
  PoToolbarProfile,
} from '@po-ui/ng-components';
import {
  ProAppConfigService,
  ProtheusLibCoreModule,
  ProThreadInfoService,
  ProUserInfo,
} from '@totvs/protheus-lib-core';

const USER_NOT_FOUND: ProUserInfo = {
  id: 'Não encontrado',
  userName: 'Usuário não encontrado',
  displayName: 'Usuário não encontrado',
  emails: [],
};

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    PoToolbarModule,
    PoMenuModule,
    PoModalModule,
    PoInfoModule,
    ProtheusLibCoreModule,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  userModal = viewChild.required(PoModalComponent);
  readonly menus: PoMenuItem[] = [
    { label: 'Página inicial', shortLabel: 'Inicio', link: './', icon: 'an an-house-line' },
    { label: 'Outros exemplos', shortLabel: 'Exemplos', link: 'examples', icon: 'an an-grid-four' },
  ];
  isLoading = true;
  profile: PoToolbarProfile = {
    title: '',
    subtitle: '',
  };
  profileActions: PoToolbarAction[] = [
    { action: this.onOpenUserModal.bind(this), label: 'Visualizar detalhes', icon: 'an an-eye' },
    { action: this.onCloseApp.bind(this), label: 'Sair', icon: 'an an-menu-close' },
  ];
  user: ProUserInfo = {};

  private readonly proAppConfigService = inject(ProAppConfigService);
  private readonly proThreadInfoService = inject(ProThreadInfoService);

  constructor() {
    this.proAppConfigService.loadAppConfig();
  }

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(): void {
    if (this.proAppConfigService.insideProtheus()) {
      this.getUserInfoFromProtheus();
    } else {
      this.user = USER_NOT_FOUND;
      this.profile.title = this.user.displayName!;
      this.profile.subtitle = 'Empresa - Filial';
      this.isLoading = false;
    }
  }

  getUserInfoFromProtheus(): void {
    this.proThreadInfoService.getUserInfoThread().subscribe({
      next: (user: ProUserInfo) => {
        this.user = user;
        this.profile.title = this.user.displayName!;
        this.profile.subtitle = `${JSON.parse(sessionStorage['ProBranch']).CompanyCode} - ${JSON.parse(sessionStorage['ProBranch']).Description}`;
        this.isLoading = false;
      },
      error: () => {
        this.user = USER_NOT_FOUND;
        this.isLoading = false;
      },
    });
  }

  onOpenUserModal(): void {
    this.userModal().open();
  }

  onCloseApp(): void {
    this.proAppConfigService.callAppClose();
  }
}
