import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoButtonModule,
  PoContainerModule,
  PoDialogService,
  PoFieldModule,
  PoLoadingModule,
  PoNotificationService,
} from '@po-ui/ng-components';
import { ProUserAccessInterface, ProUserAccessService } from '@totvs/protheus-lib-core';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-user-accesses',
  imports: [PoFieldModule, PoButtonModule, PoLoadingModule, PoContainerModule, FormsModule],
  templateUrl: './user-accesses.component.html',
  styleUrl: './user-accesses.component.css',
})
export class UserAccessesComponent {
  action = 0;
  alias = '';
  isLoading = false;
  routine = '';

  private readonly poDialog = inject(PoDialogService);
  private readonly poNotification = inject(PoNotificationService);
  private readonly proUserAccessService = inject(ProUserAccessService);

  getAccessAlias(): void {
    this.isLoading = true;
    this.proUserAccessService
      .aliasHasAccess(this.alias)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (access: ProUserAccessInterface) => this.handleSuccess(access),
        error: () => this.handleError(),
      });
  }

  getAccessRoutine(): void {
    this.isLoading = true;
    this.proUserAccessService
      .userHasAccess(this.routine, this.action)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (access: ProUserAccessInterface) => this.handleSuccess(access),
        error: () => this.handleError(),
      });
  }

  handleError(): void {
    this.poNotification.error('Não foi possível consultar o acesso do usuário.');
  }

  handleSuccess(access: ProUserAccessInterface): void {
    const messageAccess = access.message ? ` - ${access.message}` : '';
    const message = `Acessos: ${access.access ? 'Acesso permitido' : 'Acesso negado'}${messageAccess}`;
    this.poDialog.alert({ title: 'Acessos do Usuário', message });
  }
}
