import { Component, computed, inject, Signal, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  PoBreadcrumb,
  PoBreadcrumbModule,
  PoComboOption,
  PoContainerModule,
  PoFieldModule,
  PoLoadingModule,
  PoNotificationService,
  PoPageModule,
  PoTableModule
} from '@po-ui/ng-components';
import { ProCompany, ProCompanyList, ProCompanyService } from '@totvs/protheus-lib-core';
import { Observable, of } from 'rxjs';
import { catchError, finalize, scan, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-user-companies',
  imports: [PoPageModule, PoBreadcrumbModule, PoTableModule, PoLoadingModule, PoContainerModule, PoFieldModule],
  templateUrl: './user-companies.component.html'
})
export class UserCompaniesComponent {
  protected readonly breadCrumb: PoBreadcrumb = {
    items: [
      { label: 'Página Inicial', link: '/' },
      { label: 'Funções', link: '/protheus-functions' },
      { label: 'Empresas' }
    ]
  };
  protected readonly companies: Signal<ProCompanyList>;
  protected readonly companiesOptions = computed(() =>
    this.convertCompaniesToPoComboOptions(this.companies().items || [])
  );
  protected readonly hasNext = signal<boolean>(false);
  protected readonly isLoading = signal(false);
  protected readonly page = signal<number>(1);

  private readonly defaultValue: ProCompanyList = { items: [], hasNext: false };
  private readonly poNotificationService = inject(PoNotificationService);
  private readonly proCompanyService = inject(ProCompanyService);

  constructor() {
    this.companies = toSignal(
      toObservable(this.page).pipe(
        tap(() => this.isLoading.set(true)),
        switchMap((currentPage): Observable<ProCompanyList> =>
          this.proCompanyService.getUserCompanies(undefined, currentPage).pipe(
            finalize(() => this.isLoading.set(false)),
            catchError(() => {
              this.poNotificationService.error('Não foi possível retornar as Empresas do usuário');
              return of(this.defaultValue);
            })
          )
        ),
        scan((acc, current) => {
          this.hasNext.set(current.hasNext ?? false);

          return {
            hasNext: current.hasNext,
            items: [...acc.items, ...current.items]
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

  private convertCompaniesToPoComboOptions(items: ProCompany[]): PoComboOption[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return items.map((item: any) => ({
      ...item,
      label: item.CorporateName,
      value: item.Code
    }));
  }
}
