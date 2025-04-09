import { ProBranch, ProCompany } from '@totvs/protheus-lib-core';

export class InfoSession {
  appName: string;
  branch: ProBranch;
  company: ProCompany;
  database: string;
  module: string;

  constructor() {
    this.appName = '';
    this.branch = {};
    this.company = {};
    this.database = '';
    this.module = '';
  }
}
