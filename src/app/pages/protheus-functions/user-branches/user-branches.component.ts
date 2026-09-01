import { Component, computed, inject, signal, Signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import {
  PoPageModule,
  PoBreadcrumbModule,
  PoTableModule,
  PoLoadingModule,
  PoContainerModule,
  PoFieldModule,
  PoNotificationService,
  PoBreadcrumb,
  PoComboOption
} from '@po-ui/ng-components';
import { ProBranchService, ProCompany, ProBranchList } from '@totvs/protheus-lib-core';
import { tap, switchMap, Observable, finalize, catchError, of, scan } from 'rxjs';

@Component({
  selector: 'app-user-branches',
  imports: [PoPageModule, PoBreadcrumbModule, PoTableModule, PoLoadingModule, PoContainerModule, PoFieldModule],
  templateUrl: './user-branches.component.html'
})
export class UserBranchesComponent {
  protected readonly branches: Signal<ProBranchList>;
  protected readonly branchesOptions = computed(() => this.convertBranchsToPoComboOptions(this.branches().items || []));
  protected readonly breadCrumb: PoBreadcrumb = {
    items: [
      { label: 'Página Inicial', link: '/' },
      { label: 'Funções', link: '/protheus-functions' },
      { label: 'Filiais' }
    ]
  };
  protected readonly hasNext = signal<boolean>(false);
  protected readonly isLoading = signal(false);
  protected readonly page = signal<number>(1);

  private readonly defaultValue: ProBranchList = { items: [], hasNext: false };
  private readonly poNotificationService = inject(PoNotificationService);
  private readonly proBranchService = inject(ProBranchService);

  constructor() {
    this.branches = toSignal(
      toObservable(this.page).pipe(
        tap(() => this.isLoading.set(true)),
        switchMap((currentPage): Observable<ProBranchList> =>
          this.proBranchService.getUserBranches(undefined, currentPage).pipe(
            finalize(() => this.isLoading.set(false)),
            catchError(() => {
              this.poNotificationService.error('Não foi possível retornar as Filiais do usuário');
              return of(this.defaultValue);
            })
          )
        ),
        scan((acc, current) => {
          this.hasNext.set(current.hasNext ?? false);

          return {
            hasNext: current.hasNext,
            items: [...(acc.items ?? []), ...(current.items ?? [])]
          };
        }, this.defaultValue)
      ),
      { initialValue: this.defaultValue }
    );
  }

  protected loadMore(): void {
    if (!this.isLoading() && this.hasNext()) {
      this.page.update(p => p + 1);
    }
  }

  private convertBranchsToPoComboOptions(items: ProCompany[]): PoComboOption[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return items.map((item: any) => ({
      ...item,
      label: item.Description,
      value: item.Code
    }));
  }
}
