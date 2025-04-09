import { SessionInfoComponent } from './session-info/session-info.component';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import {
  PoAccordionModule,
  PoBreadcrumb,
  PoBreadcrumbModule,
  PoNotificationService,
  PoPageModule,
} from '@po-ui/ng-components';
import {
  ProBranchList,
  ProBranchService,
  ProCompanyList,
  ProCompanyService,
  ProUserAccessService,
} from '@totvs/protheus-lib-core';

import { UserAccessesComponent } from './user-accesses/user-accesses.component';
import { BranchsComponent } from './branchs/branchs.component';
import { CompaniesComponent } from './companies/companies.component';

@Component({
  selector: 'app-examples',
  imports: [
    FormsModule,
    PoAccordionModule,
    PoPageModule,
    PoBreadcrumbModule,
    CompaniesComponent,
    BranchsComponent,
    UserAccessesComponent,
    SessionInfoComponent
  ],
  templateUrl: './examples.component.html',
  styleUrl: './examples.component.css',
})
export class ExamplesComponent {
  readonly breadCrumb: PoBreadcrumb = {
    items: [{ label: 'Página Inicial', link: '/' }, { label: 'Exemplos ProtheusLibCore' }],
  };

  branchs: ProBranchList = {};
  companies: ProCompanyList = {
    items: [],
    hasNext: false,
  };
  isLoading = false;

  private readonly proBranchService = inject(ProBranchService);
  private readonly poNotificationService = inject(PoNotificationService);
  private readonly proCompanyService = inject(ProCompanyService);
  private readonly proUserAccessService = inject(ProUserAccessService);

  onExpandBranchs(): void {
    this.isLoading = true;
    this.proBranchService
      .getUserBranches()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (branches: ProBranchList) => (this.branchs = branches),
        error: () => this.poNotificationService.error('Não foi possível retornar as filiais do usuário.'),
      });
  }

  onExpandCompanies(): void {
    this.isLoading = true;
    this.proCompanyService
      .getUserCompanies()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (companies: ProCompanyList) => (this.companies = companies),
        error: () => this.poNotificationService.error('Não foi possível retornar as empresas do usuário.'),
      });
  }
}
