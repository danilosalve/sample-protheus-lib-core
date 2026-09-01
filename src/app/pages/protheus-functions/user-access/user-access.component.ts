import { Component, computed, inject } from '@angular/core';
import { PoBreadcrumb, PoBreadcrumbModule, PoLoadingModule, PoPageModule } from '@po-ui/ng-components';

import { AliasStoreService } from './shared/services/alias-store.service';
import { RoutineAccessStoreService } from './shared/services/routine-access-store.service';
import { AliasFormComponent } from './alias-form/alias-form.component';
import { UserAccessFormComponent } from './user-access-form/user-access-form.component';

@Component({
  selector: 'app-user-access',
  imports: [
    PoPageModule,
    PoBreadcrumbModule,
    PoLoadingModule,
    AliasFormComponent,
    UserAccessFormComponent
  ],
  providers: [AliasStoreService, RoutineAccessStoreService],
  templateUrl: './user-access.component.html',
})
export class UserAccessComponent {
  protected readonly aliasStore = inject(AliasStoreService);
  protected readonly routineStore = inject(RoutineAccessStoreService);

  protected readonly breadCrumb: PoBreadcrumb = {
    items: [
      { label: 'Página Inicial', link: '/' },
      { label: 'Funções', link: '/protheus-functions' },
      { label: 'Validar acesso do usuário' },
    ],
  };

  // Consolida o estado de carregamento de ambos os formulários
  protected readonly isGlobalLoading = computed(() => this.aliasStore.isLoading() || this.routineStore.isLoading());

  protected readonly isAliasFormValid = computed(() => this.aliasStore.aliasForm().valid());
  protected readonly isRoutineFormValid = computed(() => this.routineStore.routineForm().valid());
}
