import { ProBranch, ProCompany, ProUser } from '@totvs/protheus-lib-core';

export class InfoSession {
  appName: string;
  branch: ProBranch;
  company: ProCompany;
  database: string;
  module: string;
  user: ProUser;

  constructor() {
    this.appName = '';
    this.branch = {};
    this.company = {};
    this.database = '';
    this.module = '';
    this.user = { username: 'Não Informado', password: '******' };
  }
}
