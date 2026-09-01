import { finalize } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';
import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  PoBreadcrumb,
  PoBreadcrumbModule,
  PoButtonGroupItem,
  PoButtonGroupModule,
  PoContainerModule,
  PoDividerModule,
  PoInfoModule,
  PoLoadingModule,
  PoNotificationService,
  PoPageModule
} from '@po-ui/ng-components';
import {
  ProAdapterBaseV2Service,
  ProAppConfigService,
  ProThreadInfoService,
  ProUserInfoService
} from '@totvs/protheus-lib-core';
import { take } from 'rxjs';

@Component({
  selector: 'app-protheus-functions',
  imports: [
    PoPageModule,
    PoContainerModule,
    PoLoadingModule,
    PoBreadcrumbModule,
    PoDividerModule,
    PoInfoModule,
    PoButtonGroupModule,
    JsonPipe
  ],
  templateUrl: './protheus-functions.component.html'
})
export class ProtheusFunctionsComponent {
  protected readonly breadCrumb: PoBreadcrumb = {
    items: [{ label: 'Página Inicial', link: '/' }, { label: 'Funções' }]
  };
  protected readonly buttons: PoButtonGroupItem[] = [
    {
      label: 'callAppClose',
      action: this.callAppClose.bind(this),
      tooltip: 'Função que fecha a aplicação web',
      icon: 'an an-sign-out'
    },
    {
      label: 'GetHttpParams',
      action: this.getHttpParams.bind(this),
      tooltip: 'Função que retorna query params (aceitos pela FwAdapterBaseV2) no formato HttpParams.',
      icon: 'an an-code-simple'
    },
    {
      label: 'GetUserThreadInfo',
      action: this.getUserThreadInfo.bind(this),
      tooltip: 'Retorna id, username, nome e emails do usuário logado',
      icon: 'an an-info'
    },
    {
      label: 'PswRet',
      action: this.pswRet.bind(this),
      tooltip: 'Retorna informações adicionais do usuário logado',
      icon: 'an an-user'
    }
  ];
  protected data: unknown;
  protected isLoading = false;
  protected lastMethod = '';

  private readonly destroyRef = inject(DestroyRef);
  private readonly proAppConfigService = inject(ProAppConfigService);
  private readonly proAdapterBaseV2 = inject(ProAdapterBaseV2Service);
  private readonly proUserInfo = inject(ProUserInfoService);
  private readonly proThreadInfo = inject(ProThreadInfoService);
  private readonly poNotification = inject(PoNotificationService);

  /**
   * Função que fecha a aplicação web
  */
 private callAppClose(): void {
   this.beforeServiceExecution('callAppClose');
   if (this.checkIfInsideProtheus()) {
     this.proAppConfigService.callAppClose(true);
    }
    this.isLoading = false;
  }

  /**
   * Função que retorna query params (aceitos pela FwAdapterBaseV2) no formato HttpParams.
   */
  private getHttpParams(): void {
    this.beforeServiceExecution('getHttpParams');
    this.data = this.proAdapterBaseV2.getHttpParams(1, 10, "contains(name, 'TOTVS')", 'id,name', '-id');
    this.isLoading = false;
  }

  /**
   * Retorna id, username, nome e emails do usuário logado
   */
  private getUserThreadInfo(): void {
    this.beforeServiceExecution('getUserThreadInfo');

    if (this.checkIfInsideProtheus()) {
      this.proThreadInfo
        .getUserInfoThread()
        .pipe(
          take(1),
          takeUntilDestroyed(this.destroyRef),
          finalize(() => (this.isLoading = false))
        )
        .subscribe({
          next: res => (this.data = res),
          error: () => this.poNotification.error('Falha ao tentar obter informações do usuário')
        });
    } else {
      this.isLoading = false;
    }
  }

  /**
   * Retorna informações adicionais do usuário logado
   */
  private pswRet(): void {
    this.beforeServiceExecution('pswRet');

    this.proUserInfo
      .pswRet()
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: res => (this.data = res),
        error: () => this.poNotification.error('Falha ao tentar obter informações do usuário')
      });
  }

  private beforeServiceExecution(method: string): void {
    this.isLoading = true;
    this.lastMethod = method;
    this.data = '';
  }

  private checkIfInsideProtheus(): boolean {
    const isInsideProtheus = this.proAppConfigService.insideProtheus();
    if (!isInsideProtheus) {
      this.poNotification.information(
        'Ops, para utilizar está função é necessario utilizar o aplicativo dentro do Protheus. Para prosseguir, abra o aplicativo pelo Protheus.'
      );
    }
    return isInsideProtheus;
  }
}
