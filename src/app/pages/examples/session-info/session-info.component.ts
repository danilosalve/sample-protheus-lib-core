import { Component, inject, OnInit } from '@angular/core';
import { PoContainerModule, PoInfoModule, PoLoadingModule } from '@po-ui/ng-components';
import { ProAppConfigService, ProSessionInfoService } from '@totvs/protheus-lib-core';

import { InfoSession } from './helpers/info-session';

@Component({
  selector: 'app-session-info',
  imports: [PoContainerModule, PoInfoModule, PoLoadingModule],
  templateUrl: './session-info.component.html',
  styleUrl: './session-info.component.css',
})
export class SessionInfoComponent implements OnInit {
  info = new InfoSession();
  isInsideProtheus = false;

  private readonly proSessionInfo = inject(ProSessionInfoService);
  private readonly proAppConfigService = inject(ProAppConfigService);

  ngOnInit(): void {
    this.isInsideProtheus = this.proAppConfigService.insideProtheus();
    this.info = this.onLoadInfo();
  }

  onLoadInfo(): InfoSession {
    if (this.isInsideProtheus) {
      const appName = this.proSessionInfo.getAppName();
      const branch = this.proSessionInfo.getBranch();
      const company = this.proSessionInfo.getCompany();
      const database = this.proSessionInfo.getDataBase();
      const module = this.proSessionInfo.getModule();
      const user = this.proSessionInfo.getUser();
      return { appName, branch, company, database, module, user };
    } else {
      return this.info;
    }
  }
}
