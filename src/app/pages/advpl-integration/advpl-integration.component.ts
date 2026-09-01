import { Component, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { form, required, schema } from '@angular/forms/signals';
import {
  PoBreadcrumb,
  PoBreadcrumbModule,
  PoButtonModule,
  PoContainerModule,
  PoDialogService,
  PoFieldModule,
  PoLoadingModule,
  PoNotificationService,
  PoPageModule,
  PoToasterModule
} from '@po-ui/ng-components';
import { ProJsToAdvplService } from '@totvs/protheus-lib-core';
import { finalize, Observable } from 'rxjs';

@Component({
  selector: 'app-advpl-integration',
  imports: [
    PoPageModule,
    PoBreadcrumbModule,
    PoContainerModule,
    PoLoadingModule,
    PoFieldModule,
    PoButtonModule,
    FormsModule,
    PoToasterModule
  ],
  templateUrl: './advpl-integration.component.html'
})
export class AdvplIntegrationComponent {
  protected readonly breadCrumb: PoBreadcrumb = {
    items: [{ label: 'Página Inicial', link: '/' }, { label: 'Integrações ADVPL' }]
  };
  protected isLoading = false;
  protected readonly model = signal<{ message: string }>({ message: '' });
  protected readonly modelProduct = signal<{ productId: string }>({ productId: '' });
  protected readonly messageForm = form(
    this.model,
    schema(s => {
      required(s.message, { message: 'Informe uma mensagem' });
    })
  );
  protected readonly productForm = form(
    this.modelProduct,
    schema(s => {
      required(s.productId, { message: 'Selecione um produto' });
    })
  );
  protected productId = '';
  private readonly destroyRef = inject(DestroyRef);
  private readonly poDialog = inject(PoDialogService);
  private readonly poNotification = inject(PoNotificationService);
  private readonly proJsToAdvplService = inject(ProJsToAdvplService);

  updateMessage(message: string): void {
    this.model.update(prev => ({ ...prev, message }));
  }

  updateProductId(productId: string): void {
    this.modelProduct.update(prev => ({ ...prev, productId: productId }));
  }

  /**
   * Enviar uma mensagem do aplicativo para o ERP
   */
  protected jsToAdvpl(): void {
    if (this.messageForm().invalid()) {
      this.poNotification.error('Dados inválidos, por favor verifique o campo Mensagem');
      return;
    }

    this.isLoading = true;
    const { message } = this.model();

    this.proJsToAdvplService.jsToAdvpl('SendMessage', message);
    this.model.set({ message: '' });
    this.isLoading = false;
  }

  /**
   * Enviar uma mensagem do aplicativo para o ERP solicitando uma interação do ERP com o aplicativo
   */
  protected advplToJs(): void {
    this.proJsToAdvplService.jsToAdvpl('ReceiveMessage', '');
  }

  /**
   * Envia uma interação do aplicativo para o Protheus e aguarda uma resposta do Protheus
   */
  protected buildObservable(): void {
    if (this.productForm().invalid()) {
      this.poNotification.error('Dados inválidos, por favor selecione um produto para continuar');
      return;
    }
    const { productId } = this.modelProduct();

    this.isLoading = true;
    this.exececuteJsToAdvplObservable(productId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.modelProduct.set({ productId: '' });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (balance: number) =>
          this.poDialog.alert({ title: 'Saldo do Produto', message: `O saldo do Produto ${productId} é ${balance}` }),
        error: () => this.poNotification.error('Falha ao consultar saldo do produto')
      });
  }

  private exececuteJsToAdvplObservable(productId: string): Observable<number> {
    return this.proJsToAdvplService.buildObservable<number>(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ({ protheusResponse, subscriber }: any) => {
        subscriber.next(protheusResponse);
        subscriber.complete();
      },
      {
        autoDestruct: true,
        receiveId: 'checkBalance',
        sendInfo: {
          type: 'checkBalance',
          content: productId
        }
      }
    );
  }
}
