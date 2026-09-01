import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoBreadcrumb,
  PoBreadcrumbModule,
  PoContainerModule,
  PoFieldModule,
  PoLoadingModule,
  PoNotificationService,
  PoPageModule,
  PoSelectOption,
} from '@po-ui/ng-components';
import { ProAppConfigService, ProDateService } from '@totvs/protheus-lib-core';
import { take, finalize } from 'rxjs';

@Component({
  selector: 'app-pro-date',
  imports: [PoFieldModule, PoLoadingModule, PoContainerModule, FormsModule, PoPageModule, PoBreadcrumbModule],
  templateUrl: './pro-date.component.html',
})
export class ProDateComponent implements OnInit {
  readonly breadCrumb: PoBreadcrumb = {
    items: [
      { label: 'Página Inicial', link: '/' },
      { label: 'Serviços', link: '/protheus-services' },
      { label: 'ProDate' },
    ],
  };

  private readonly proAppConfigService = inject(ProAppConfigService);
  private readonly proDateService = inject(ProDateService);
  private readonly poNotificationService = inject(PoNotificationService);

  protected dateFormat = '';
  protected isInsideProtheus = false;
  protected isLoading = false;
  protected readonly options: PoSelectOption[] = [
    { label: 'Português Brasil', value: 'pt' },
    { label: 'Espanhol', value: 'es' },
    { label: 'Inglês', value: 'en' },
    { label: 'Russo', value: 'ru' },
  ];

  ngOnInit(): void {
    this.isInsideProtheus = this.proAppConfigService.insideProtheus();
  }

  protected getDateFormat(language: string): void {
    this.isLoading = true;
    this.proDateService
      .getDateFormat(language)
      .pipe(
        take(1),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: res => (this.dateFormat = res),
        error: err => {
          this.poNotificationService.error('Falha ao tentar consultar formato da data');
          console.error(err);
        },
      });
  }
}
