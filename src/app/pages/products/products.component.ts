import { Component, viewChild, inject } from '@angular/core';
import {
  PoDialogService,
  PoLoadingModule,
  PoModalComponent,
  PoModalModule,
  PoNotificationService,
  PoPageModule,
} from '@po-ui/ng-components';
import {
  PoPageDynamicTableActions,
  PoPageDynamicTableCustomTableAction,
  PoPageDynamicTableFilters,
  PoPageDynamicTableModule,
} from '@po-ui/ng-templates';
import { Products } from './shared/interfaces/products';
import { ProJsToAdvplService } from '@totvs/protheus-lib-core';
import { ProductsService } from './shared/services/products.service';
import { PRODUCTS_URL } from './helpers/products-default-url.constants';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-products',
  imports: [PoPageModule, PoPageDynamicTableModule, PoModalModule, PoLoadingModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  readonly actions: PoPageDynamicTableActions = { new: 'new', edit: 'product/:id', remove: true };
  readonly apiUrl = PRODUCTS_URL;
  balance = 0;
  balanceModal = viewChild.required(PoModalComponent);
  readonly fields: PoPageDynamicTableFilters[] = [
    { property: 'b1_filial', label: 'Filial' },
    { property: 'b1_cod', key: true, label: 'Código' },
    { property: 'b1_desc', label: 'Descrição' },
    { property: 'b1_tipo', label: 'Tipo' },
    { property: 'b1_um', label: 'Unidade' },
    { property: 'b1_locpad', label: 'Armazém' },
  ];
  isLoadingBalance = false;
  tableCustomActions: PoPageDynamicTableCustomTableAction[] = [
    {
      label: 'Consultar saldo',
      action: (row: Products) => this.alertCheckBalance(row.b1_cod),
    },
  ];

  private readonly productsService = inject(ProductsService);
  private readonly poNotificationService = inject(PoNotificationService);
  private readonly poDialogService = inject(PoDialogService);
  private readonly proJsToAdvplService = inject(ProJsToAdvplService);

  alertCheckBalance(productId: string): void {
    if (this.proJsToAdvplService.protheusConnected()) {
      this.openBalanceModal(productId);
    } else {
      this.poDialogService.alert({
        title: 'Atenção',
        message:
          'Não é possível consultar o saldo do produto, pois o aplicativo não está sendo executado pelo Protheus. Para prosseguir, abra o aplicativo pelo Protheus.',
      });
    }
  }

  openBalanceModal(productId: string): void {
    this.productsService.getParam('MV_TPSALDO');
    this.balanceModal().open();
    this.checkBalance(productId);
  }

  checkBalance(productId: string): void {
    this.isLoadingBalance = true;
    this.productsService
      .checkBalance(productId)
      .pipe(finalize(() => (this.isLoadingBalance = false)))
      .subscribe({
        next: (balance: number) => (this.balance = balance),
        error: () => this.poNotificationService.error('Falha ao consultar saldo do produto'),
      });
  }
}
