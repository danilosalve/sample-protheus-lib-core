import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { form, required, schema, validate } from '@angular/forms/signals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PoDialogService, PoNotificationService } from '@po-ui/ng-components';
import { ProUserAccessInterface, ProUserAccessService } from '@totvs/protheus-lib-core';
import { finalize, take } from 'rxjs';

import { UserAccessModel } from '../interfaces/user-access-model.interface';
import { FormValidators } from '../helpers/form-validators.util';

@Injectable()
export class RoutineAccessStoreService {
  private readonly poNotification = inject(PoNotificationService);
  private readonly proUserAccess = inject(ProUserAccessService);
  private readonly poDialog = inject(PoDialogService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(false);
  readonly model = signal<UserAccessModel>({ routine: '', action: null });
  readonly alphaNumericPattern = '^[a-zA-Z0-9]+$';

  readonly routineForm = form(
    this.model,
    schema((s) => {
      required(s.routine, { message: 'A Rotina é obrigatória.' });
      validate(s.routine, (node) => FormValidators.alphaNumeric(node.value(), 'A Rotina'));
      required(s.action, { message: 'A Ação é obrigatória.' });
      validate(s.action, (node) => FormValidators.positiveNumber(node.value()));
    })
  );

  updateRoutine(routine: string): void {
    this.model.update((prev) => ({ ...prev, routine }));
  }

  updateAction(action: number | null): void {
    this.model.update((prev) => ({ ...prev, action }));
  }

  submitForm(): void {
    if (this.routineForm().invalid()) {
      this.poNotification.error('Rotina inválida! Certifique-se de não utilizar espaços.');
      return;
    }

    const { routine, action } = this.model();
    this.isLoading.set(true);

    this.proUserAccess
      .userHasAccess(routine, action ?? undefined)
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.model.set({ routine: '', action: null });
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (access) => this.handleSuccess(access),
        error: () => this.poNotification.error('Não foi possível consultar o acesso por Rotina.'),
      });
  }

  private handleSuccess(access: ProUserAccessInterface): void {
    const messageAccess = access.message ? ` - ${access.message}` : '';
    const message = `Acessos: ${access.access ? 'Acesso permitido' : 'Acesso negado'}${messageAccess}`;
    this.poDialog.alert({ title: 'Acessos do Usuário', message });
  }
}
