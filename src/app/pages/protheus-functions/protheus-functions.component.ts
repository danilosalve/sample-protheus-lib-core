import { finalize } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';
import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  PoBreadcrumb,
  PoBreadcrumbModule,
  PoButtonModule,
  PoContainerModule,
  PoDividerModule,
  PoInfoModule,
  PoLoadingModule,
  PoNotificationService,
  PoPageModule,
  PoTooltipModule
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
    PoButtonModule,
    JsonPipe,
    PoTooltipModule,
    PoTooltipModule
  ],
  templateUrl: './protheus-functions.component.html'
})
export class ProtheusFunctionsComponent {
  protected readonly breadCrumb: PoBreadcrumb = {
    items: [{ label: 'Página Inicial', link: '/' }, { label: 'Funções' }]
  };
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
   * Verificar se está sendo executado dentro do Protheus
   */
  protected isInsideProtheus(): void {
    this.beforeServiceExecution('isInsideProtheus');
    this.data = this.proAppConfigService.insideProtheus() ? 'verdadeiro' : 'falso';
    this.isLoading = false;
  }

  /**
   * Função que fecha a aplicação web
   */
  protected callAppClose(): void {
    this.beforeServiceExecution('callAppClose');
    if (this.checkIfInsideProtheus()) {
      this.proAppConfigService.callAppClose(true);
    }
    this.isLoading = false;
  }

  /**
   * Função que retorna query params (aceitos pela FwAdapterBaseV2) no formato HttpParams.
   */
  protected getHttpParams(): void {
    this.beforeServiceExecution('getHttpParams');
    this.data = this.proAdapterBaseV2.getHttpParams(1, 10, "contains(name, 'TOTVS')", 'id,name', '-id');
    this.isLoading = false;
  }

  /**
   * Retorna id, username, nome e emails do usuário logado
   */
  protected getUserThreadInfo(): void {
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
  protected pswRet(): void {
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
