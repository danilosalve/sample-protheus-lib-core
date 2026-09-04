import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { form, required, schema, validate } from '@angular/forms/signals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PoDialogService, PoNotificationService } from '@po-ui/ng-components';
import { ProUserAccessInterface, ProUserAccessService } from '@totvs/protheus-lib-core';
import { finalize, take } from 'rxjs';

import { AliasModel } from '../interfaces/alias-model.interface';
import { FormValidators } from '../helpers/form-validators.util';

@Injectable()
export class AliasStoreService {
  private readonly poNotification = inject(PoNotificationService);
  private readonly proUserAccess = inject(ProUserAccessService);
  private readonly poDialog = inject(PoDialogService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(false);
  readonly model = signal<AliasModel>({ alias: '', action: null });
  readonly alphaNumericPattern = '^[a-zA-Z0-9]+$';

  readonly aliasForm = form(
    this.model,
    schema((s) => {
      required(s.alias, { message: 'O campo Alias é obrigatório.' });
      validate(s.alias, (node) => FormValidators.alphaNumeric(node.value(), 'Alias', 3));
      required(s.action, { message: 'A Ação é obrigatória.' });
      validate(s.action, (node) => FormValidators.positiveNumber(node.value()));
    })
  );

  updateAlias(alias: string): void {
    this.model.update((prev) => ({ ...prev, alias }));
  }

  updateAction(action: number | null): void {
    this.model.update((prev) => ({ ...prev, action }));
  }

  submitForm(): void {
    if (this.aliasForm().invalid()) {
      this.poNotification.error('Alias inválido. Verifique os dados inseridos.');
      return;
    }

    const { alias, action } = this.model();
    this.isLoading.set(true);

    this.proUserAccess
      .aliasHasAccess(alias, action ?? undefined)
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.model.set({ alias: '', action: null });
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (access) => this.handleSuccess(access),
        error: () => this.poNotification.error('Não foi possível consultar o acesso por Alias.'),
      });
  }

  private handleSuccess(access: ProUserAccessInterface): void {
    const messageAccess = access.message ? ` - ${access.message}` : '';
    const message = `Acessos: ${access.access ? 'Acesso permitido' : 'Acesso negado'}${messageAccess}`;
    this.poDialog.alert({ title: 'Acessos do Usuário', message });
  }
}
