import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoPageModule,
  PoContainerModule,
  PoBreadcrumbModule,
  PoLoadingModule,
  PoBreadcrumb,
  PoFieldModule,
  PoNotificationService,
  PoTableColumn,
  PoTableModule,
  PoButtonModule
} from '@po-ui/ng-components';
import { ProAdapterBaseV2, ProGenericAdapterService } from '@totvs/protheus-lib-core';
import { take, finalize } from 'rxjs';

import { COLUMNS_QUERY } from '../helpers/columns';

@Component({
  selector: 'app-query',
  imports: [
    PoPageModule,
    PoContainerModule,
    PoBreadcrumbModule,
    PoLoadingModule,
    PoTableModule,
    PoFieldModule,
    FormsModule,
    PoButtonModule
  ],
  templateUrl: './query.component.html'
})
export class QueryComponent implements OnInit {
  protected readonly breadCrumb: PoBreadcrumb = {
    items: [
      { label: 'Página Inicial', link: '/' },
      { label: 'Serviços', link: '/protheus-services' },
      { label: 'ProGenericAdapter', link: '/protheus-services/generic-adapter' },
      { label: 'Query' }
    ]
  };

  protected isLoading = false;
  protected items: unknown[] = [];
  protected columns: PoTableColumn[] = COLUMNS_QUERY;
  protected page = 0;
  protected isDisableShowMore = false;

  private readonly proGenericAdapter = inject(ProGenericAdapterService);
  private readonly poNotification = inject(PoNotificationService);

  ngOnInit(): void {
    this.onLoadSales();
  }

  protected onShowMore(): void {
    this.onLoadSales();
  }

  private onLoadSales(): void {
    this.isLoading = true;
    this.proGenericAdapter
      .query({
        tables: 'SC5,SA1',
        fields: 'C5_FILIAL,C5_NUM,A1_COD,A1_LOJA,A1_NOME',
        where: `SC5.C5_CLIENTE = SA1.A1_COD AND SC5.C5_LOJACLI = SA1.A1_LOJA AND SC5.D_E_L_E_T_ = ' ' AND SA1.D_E_L_E_T_ = ' '`,
        page: ++this.page
      })
      .pipe(
        take(1),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (res: ProAdapterBaseV2<unknown>) => {
          this.items = res.items;
          this.isDisableShowMore = !res.hasNext;
        },
        error: () => this.poNotification.error('Não foi possível consultar a tabela selecionada')
      });
  }
}
