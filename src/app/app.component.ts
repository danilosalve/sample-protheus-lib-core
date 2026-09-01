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
  PoToolbarProfile
} from '@po-ui/ng-components';
import {
  ProAppConfigService,
  ProtheusLibCoreModule,
  ProThreadInfoService,
  ProUserInfo
} from '@totvs/protheus-lib-core';

const USER_NOT_FOUND: ProUserInfo = {
  id: 'Não encontrado',
  userName: 'Usuário não encontrado',
  displayName: 'Usuário não encontrado',
  emails: []
};

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PoToolbarModule, PoMenuModule, PoModalModule, PoInfoModule, ProtheusLibCoreModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  readonly userModal = viewChild.required(PoModalComponent);
  protected readonly menus: PoMenuItem[] = [
    { label: 'Página inicial', shortLabel: 'Inicio', link: './', icon: 'an an-house-line' },
    {
      label: 'Integrações ADVPL',
      shortLabel: 'Integrações',
      icon: 'an an-swap',
      link: 'advpl-integration'
    },
    {
      label: 'Funções',
      shortLabel: 'Funções',
      icon: 'an an-code',
      subItems: [
        {
          label: 'Acessos do usuário',
          subItems: [
            { label: 'Empresas', link: 'protheus-functions/user-companies' },
            { label: 'Filiais', link: 'protheus-functions/user-branches' },
            { label: 'Validar de acessos', link: 'protheus-functions/user-access' }
          ]
        },
        { label: 'Outras', link: 'protheus-functions' }
      ]
    },
    {
      label: 'Serviços',
      shortLabel: 'Serviços',
      icon: 'an an-hard-drives',
      subItems: [
        { label: 'ProUserProfileService', link: 'protheus-services/user-profile' },
        {
          label: 'ProGenericAdapterService',
          subItems: [
            { label: 'List', link: 'protheus-services/generic-adapter/list' },
            { label: 'Query', link: 'protheus-services/generic-adapter/query' }
          ]
        },
        { label: 'ProSessionInfoService', link: 'protheus-services/session-info' },
        { label: 'ProDateService', link: 'protheus-services/pro-date' }
      ]
    },
    { label: 'Sair', shortLabel: 'Sair', action: () => this.onCloseApp(), icon: 'an an-sign-out' }
  ];
  protected isLoading = true;
  protected profile: PoToolbarProfile = {
    title: '',
    subtitle: ''
  };
  protected profileActions: PoToolbarAction[] = [
    { action: this.onOpenUserModal.bind(this), label: 'Visualizar detalhes', icon: 'an an-user-circle' },
    { action: this.onCloseApp.bind(this), label: 'Sair', icon: 'an an-sign-out' }
  ];
  protected user: ProUserInfo = {};

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
      }
    });
  }

  onOpenUserModal(): void {
    this.userModal().open();
  }

  onCloseApp(): void {
    this.proAppConfigService.callAppClose();
  }
}
