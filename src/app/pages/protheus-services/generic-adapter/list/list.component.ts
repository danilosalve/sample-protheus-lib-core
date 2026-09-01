import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoPageModule,
  PoContainerModule,
  PoBreadcrumbModule,
  PoLoadingModule,
  PoBreadcrumb,
  PoSelectOption,
  PoNotificationService,
  PoTableModule,
  PoFieldModule,
  PoTableColumn
} from '@po-ui/ng-components';
import { ProGenericAdapterService } from '@totvs/protheus-lib-core';
import { take, finalize } from 'rxjs';
import { FieldAlias, FIELDS } from '../helpers/fields';
import { COLUMNS } from '../helpers/columns';

@Component({
  selector: 'app-list',
  imports: [
    PoPageModule,
    PoContainerModule,
    PoBreadcrumbModule,
    PoLoadingModule,
    PoTableModule,
    PoFieldModule,
    FormsModule
  ],
  templateUrl: './list.component.html'
})
export class ListComponent {
  protected readonly breadCrumb: PoBreadcrumb = {
    items: [
      { label: 'Página Inicial', link: '/' },
      { label: 'Serviços', link: '/protheus-services' },
      {
        label: 'ProGenericAdapter',
        link: '/protheus-services/generic-adapter'
      },
      { label: 'List' }
    ]
  };
  protected readonly options: PoSelectOption[] = [
    { label: 'Bancos', value: 'SA6' },
    { label: 'Clientes', value: 'SA1' },
    { label: 'Fornecedores', value: 'SA2' },
    { label: 'Vendedores', value: 'SA3' }
  ];
  protected isLoading = false;
  protected items: unknown[] = [];
  protected columns: PoTableColumn[] = [];

  private readonly proGenericAdapter = inject(ProGenericAdapterService);
  private readonly poNotification = inject(PoNotificationService);

  protected onChangeTable(alias: string): void {
    this.setColumnsByAlias(alias as FieldAlias);
    this.isLoading = true;
    this.proGenericAdapter
      .list({
        alias: alias as FieldAlias,
        fields: this.getFieldsByAlias(alias as FieldAlias)
      })
      .pipe(
        take(1),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: res => (this.items = res.items),
        error: () => this.poNotification.error('Não foi possível consultar a tabela selecionada')
      });
  }

  protected getFieldsByAlias(alias: FieldAlias): string {
    return FIELDS[alias] ?? '';
  }

  protected setColumnsByAlias(alias: FieldAlias): void {
    this.columns = COLUMNS[alias] ?? [];
  }
}
