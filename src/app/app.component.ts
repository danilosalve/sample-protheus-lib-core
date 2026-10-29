import { LiteralsService } from './shared/services/literals.service';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProAppConfigService } from '@totvs/protheus-lib-core';
import { PoMenuItem, PoMenuModule, PoNotificationService, PoThemeService } from '@po-ui/ng-components';

import { ToolbarComponent } from './core/components/toolbar/toolbar.component';
import { APP_MENUS } from './core/helpers/menu.constants';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PoMenuModule, ToolbarComponent],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private readonly literalsService = inject(LiteralsService);
  private readonly poNotificationService = inject(PoNotificationService);
  private readonly proAppConfigService = inject(ProAppConfigService);
  private readonly themeService = inject(PoThemeService);
  protected readonly menus: PoMenuItem[] = APP_MENUS.map((item: PoMenuItem) => {
    if (item.label === 'Sair') {
      return {
        ...item,
        action: () => this.onCloseApp()
      };
    }

    return item;
  });

  constructor() {
    /** Exemplo de utilização dos Literals via serviço */
    this.literalsService.getLiterals().subscribe({ next: literals => console.log(literals) });
    /** Carrega os dados do Storage para memoria */
    this.proAppConfigService.loadAppConfig();
  }

  ngOnInit(): void {
    this.themeService.setA11yDefaultSizeSmall(false);
  }

  onCloseApp(): void {
    if (this.proAppConfigService.insideProtheus()) {
      this.proAppConfigService.callAppClose();
    } else {
      this.poNotificationService.information(
        'Ops, para utilizar está função é necessario utilizar o aplicativo dentro do Protheus. Para prosseguir, abra o aplicativo pelo Protheus.'
      );
    }
  }
}
