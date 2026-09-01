import {
  PoBreadcrumb,
  PoBreadcrumbModule,
  PoPageModule,
  PoToasterModule,
  PoToasterType,
  PoContainerModule,
  PoSelectOption,
  PoWidgetModule,
  PoFieldModule,
  PoButtonModule,
} from '@po-ui/ng-components';
import { Component, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { ProSessionInfoService } from '@totvs/protheus-lib-core';
import { PRO_SESSION_INFO_METHODS } from './helpers/pro-session-info-methods';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-session-info',
  imports: [
    FormsModule,
    PoPageModule,
    PoBreadcrumbModule,
    PoToasterModule,
    PoContainerModule,
    JsonPipe,
    PoFieldModule,
    PoWidgetModule,
    PoButtonModule,
  ],
  templateUrl: './session-info.component.html',
})
export class SessionInfoComponent {
  protected readonly toasterType = PoToasterType.Information;
  protected readonly breadCrumb: PoBreadcrumb = {
    items: [
      { label: 'Página Inicial', link: '/' },
      { label: 'Serviços', link: '/protheus-services' },
      { label: 'ProSessionInfo' },
    ],
  };
  protected selectedMethod = '';
  protected response: unknown;
  protected lastMethod = '';
  protected readonly methodOptions: PoSelectOption[] = PRO_SESSION_INFO_METHODS;
  private readonly proSessionInfo = inject(ProSessionInfoService);

  onMethodChange(value: string): void {
    this.selectedMethod = value;
    this.executeSelectedMethod();
  }

  /**
   * Executa dinamicamente o método selecionado no PoSelect/PoCombo
   */
  executeSelectedMethod(): void {
    if (!this.selectedMethod) {
      return;
    }

    this.beforeServiceExecution(this.selectedMethod);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serviceInstance = this.proSessionInfo as any;

    if (typeof serviceInstance[this.selectedMethod] === 'function') {
      this.response = serviceInstance[this.selectedMethod]();
    } else {
      this.response = `Método '${this.selectedMethod}' não foi encontrado no ProSessionInfoService.`;
    }
  }

  /**
   * Retorna o objeto com todas as informações completas da sessão
   */
  getSessionInfo(): void {
    this.beforeServiceExecution('getSessionInfo');
    this.response = this.proSessionInfo.getSessionInfo();
  }

  /**
   * Retorna o código da empresa logada
   */
  getCompany(): void {
    this.beforeServiceExecution('getCompany');
    this.response = this.proSessionInfo.getCompany();
  }

  /**
   * Retorna o código da filial logada
   */
  getBranch(): void {
    this.beforeServiceExecution('getBranch');
    this.response = this.proSessionInfo.getBranch();
  }

  /**
   * Retorna o código/nome do módulo em execução
   */
  getModule(): void {
    this.beforeServiceExecution('getModule');
    this.response = this.proSessionInfo.getModule();
  }

  /**
   * Retorna o nome da aplicação
   */
  getAppName(): void {
    this.beforeServiceExecution('getAppName');
    this.response = this.proSessionInfo.getAppName();
  }

  /**
   * Retorna as informações do módulo logado
   */
  getSystemModule(): void {
    this.beforeServiceExecution('getSystemModule');
    this.response = this.proSessionInfo.getSystemModule();
  }

  /**
   * Retorna a database informada no login
   */
  getDataBase(): void {
    this.beforeServiceExecution('getDataBase');
    this.response = this.proSessionInfo.getDataBase();
  }

  /**
   * Retorna o tipo de conexão remota (ex: SmartClient, HTML, Web)
   */
  getRemoteType(): void {
    this.beforeServiceExecution('getRemoteType');
    this.response = this.proSessionInfo.getRemoteType();
  }

  /**
   * Retorna a porta de socket da conexão
   */
  getSocketPort(): void {
    this.beforeServiceExecution('getSocketPort');
    this.response = this.proSessionInfo.getSocketPort();
  }

  /**
   * Retorna as informações do aplicativo
   */
  getAppConfig(): void {
    this.beforeServiceExecution('getAppConfig');
    this.response = this.proSessionInfo.getAppConfig();
  }

  /**
   * Retorna o idioma informado no login
   */
  getIdiom(): void {
    this.beforeServiceExecution('getIdiom');
    this.response = this.proSessionInfo.getIdiom();
  }

  /**
   * Retorna as informações do aplicativo
   */
  getErpAppConfig(): void {
    this.beforeServiceExecution('getErpAppConfig');
    this.response = this.proSessionInfo.getErpAppConfig();
  }

  /**
   * Retorna as informações do usuário
   */
  getUser(): void {
    this.beforeServiceExecution('getUser');
    this.response = this.proSessionInfo.getUser();
  }

  /**
   * Retorna as informações do papel de trabalho do usuário
   */
  getRole(): void {
    this.beforeServiceExecution('getRole');
    this.response = this.proSessionInfo.getRole();
  }

  /**
   * Retorna se a nova home está ativa.
   */
  getNewHome(): void {
    this.beforeServiceExecution('getNewHome');
    this.response = this.proSessionInfo.getNewHome();
  }

  /**
   * Retorna o tipo e descrição do tipo de ambiente. Tipos de ambiente: 1=Produção / 2=Homologação / 3=Desenvolvimento.
   */
  getProEnvironment(): void {
    this.beforeServiceExecution('getProEnvironment');
    this.response = this.proSessionInfo.getProEnvironment();
  }

  /**
   * Retorna o programa inicial, utilizado pelo usuário. Exemplos: SIGAMDI, SIGAADV, SIGACFG, etc.
   */
  getProgramStart(): void {
    this.beforeServiceExecution('getProgramStart');
    this.response = this.proSessionInfo.getProgramStart();
  }

  /**
   * Retorna o horário que o usuário realizou login no sistema
   */
  getStartTime(): void {
    this.beforeServiceExecution('getStartTime');
    this.response = this.proSessionInfo.getStartTime();
  }

  private beforeServiceExecution(method: string): void {
    this.lastMethod = method;
    this.response = '';
  }
}
