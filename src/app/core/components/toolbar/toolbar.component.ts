import { Component, inject, OnInit, output, viewChild } from '@angular/core';
import {
  PoInfoModule,
  PoModalComponent,
  PoModalModule,
  PoToolbarAction,
  PoToolbarModule,
  PoToolbarProfile
} from '@po-ui/ng-components';
import { ProAppConfigService, ProThreadInfoService, ProUserInfo } from '@totvs/protheus-lib-core';

const USER_NOT_FOUND: ProUserInfo = {
  id: 'Não encontrado',
  userName: 'Usuário não encontrado',
  displayName: 'Usuário não encontrado',
  emails: []
};

@Component({
  selector: 'app-toolbar',
  imports: [PoToolbarModule, PoModalModule, PoInfoModule],
  templateUrl: './toolbar.component.html'
})
export class ToolbarComponent implements OnInit {
  readonly userModal = viewChild.required(PoModalComponent);
  readonly closeAction = output<void>();

  private readonly proAppConfigService = inject(ProAppConfigService);
  private readonly proThreadInfoService = inject(ProThreadInfoService);

  protected profile: PoToolbarProfile = {
    title: '',
    subtitle: ''
  };
  protected profileActions: PoToolbarAction[] = [
    { action: this.onOpenUserModal.bind(this), label: 'Visualizar detalhes', icon: 'an an-user-circle' },
    { action: this.onCloseApp.bind(this), label: 'Sair', icon: 'an an-sign-out' }
  ];
  protected user: ProUserInfo = {};

  ngOnInit(): void {
    this.getUserInfo();
  }

  private getUserInfo(): void {
    if (this.proAppConfigService.insideProtheus()) {
      this.getUserInfoFromProtheus();
    } else {
      this.user = USER_NOT_FOUND;
      this.profile.title = this.user.displayName!;
      this.profile.subtitle = 'Empresa - Filial';
    }
  }

  private getUserInfoFromProtheus(): void {
    this.proThreadInfoService.getUserInfoThread().subscribe({
      next: (user: ProUserInfo) => {
        this.user = user;
        this.profile.title = this.user.displayName!;
        this.profile.subtitle = `${JSON.parse(sessionStorage['ProBranch']).CompanyCode} - ${JSON.parse(sessionStorage['ProBranch']).Description}`;
      },
      error: () => {
        this.user = USER_NOT_FOUND;
      }
    });
  }

  private onOpenUserModal(): void {
    this.userModal().open();
  }

  private onCloseApp(): void {
    this.closeAction.emit();
  }
}
