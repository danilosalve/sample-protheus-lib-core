import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoFieldModule,
  PoLoadingModule,
  PoNotificationService,
  PoSelectOption,
  PoTableModule,
} from '@po-ui/ng-components';
import { ProGenericAdapterService } from '@totvs/protheus-lib-core';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-generic-adapter',
  imports: [PoLoadingModule, PoTableModule, PoFieldModule, FormsModule],
  templateUrl: './generic-adapter.component.html',
  styleUrl: './generic-adapter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericAdapterComponent {
  private readonly proGenericAdapter = inject(ProGenericAdapterService);
  private readonly poNotification = inject(PoNotificationService);
  readonly options: PoSelectOption[] = [
    { label: 'Clientes', value: 'SA1' },
    { label: 'Fornecedores', value: 'SA2' },
    { label: 'Produtos', value: 'SB1' },
  ];
  isLoading = false;
  items: unknown[] = [];
  isDisable = false;

  onChangeTable(alias: string): void {
    this.isLoading = true;
    this.proGenericAdapter
      .list({ alias })
      .pipe(
        take(1),
        finalize(() => ((this.isLoading = false), (this.isDisable = true)))
      )
      .subscribe({
        next: res => (this.items = res.items),
        error: () => this.poNotification.error('Não foi possível consultar a tabela selecionada'),
      });
  }
}
