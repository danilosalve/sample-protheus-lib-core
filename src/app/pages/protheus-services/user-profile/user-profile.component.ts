import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoLoadingModule,
  PoContainerModule,
  PoFieldModule,
  PoPageModule,
  PoInfoModule,
  PoDividerModule,
  PoButtonGroupModule,
  PoButtonGroupItem,
  PoBreadcrumbModule,
  PoBreadcrumb,
} from '@po-ui/ng-components';
import { ProUserProfileService } from '@totvs/protheus-lib-core';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  imports: [
    PoFieldModule,
    PoButtonGroupModule,
    PoLoadingModule,
    PoContainerModule,
    FormsModule,
    PoPageModule,
    PoInfoModule,
    PoDividerModule,
    JsonPipe,
    PoBreadcrumbModule,
  ],
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent {
  private readonly proUserProfile = inject(ProUserProfileService);
  readonly breadCrumb: PoBreadcrumb = {
    items: [
      { label: 'Página Inicial', link: '/' },
      { label: 'Serviços', link: '/protheus-services' },
      { label: 'ProUserProfile' },
    ],
  };

  cValue = '';
  lastResponse: unknown;
  lastMethod = '';
  isLoading = false;

  readonly buttons: PoButtonGroupItem[] = [
    { label: 'Criar', action: this.create.bind(this) },
    { label: 'Visualizar', action: this.read.bind(this) },
    { label: 'Atualizar', action: this.update.bind(this) },
    { label: 'Excluir', action: this.delete.bind(this) },
    { label: 'Excluir e Crir novo', action: this.deleteThenCreate.bind(this) },
  ];

  /**
   * Cria um novo registro no profile
   */
  create(): void {
    this.beforeServiceExecution('create');

    this.proUserProfile
      .create(this.cValue)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: apiReturn => {
          this.lastResponse = apiReturn;
        },
      });
  }

  /**
   * Busca o valor de uma chave salva no profile
   */
  read(): void {
    this.beforeServiceExecution('read');

    this.proUserProfile
      .read(this.cValue, 'text')
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: apiReturn => {
          this.lastResponse = apiReturn;
        },
      });
  }

  /**
   * Atualiza um registro no profile
   */
  update(): void {
    this.beforeServiceExecution('update');

    this.proUserProfile
      .update(this.cValue)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: apiReturn => {
          this.lastResponse = apiReturn;
        },
      });
  }

  /**
   * Deleta um registro no profile
   */
  delete(): void {
    this.beforeServiceExecution('delete');

    this.proUserProfile
      .delete()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: apiReturn => {
          this.lastResponse = apiReturn;
        },
      });
  }

  /**
   * Deleta e cria um registro no profile esse metodo pode substituir o uso do metodo create e update em alguns casos
   */
  deleteThenCreate(): void {
    this.beforeServiceExecution('deleteThenCreate');

    this.proUserProfile
      .deleteThenCreate(this.cValue)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: apiReturn => {
          this.lastResponse = apiReturn;
        },
      });
  }

  /**
   * Prepara o estado do componente antes da execução de um serviço.
   * Ativa o indicador de carregamento, registra a origem da chamada e garante o carregamento do perfil.
   * @param {string} method método utilizado
   */
  private beforeServiceExecution(method: string): void {
    this.isLoading = true;
    this.lastMethod = method;
    this.setProfile();
  }

  /**
   * Metodo para definir o profile a ser utilizado
   */
  private setProfile(): void {
    this.proUserProfile.setProfile('sample-lib-core', 'sample', 'samplePref');
  }
}
