/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FieldsControlService {
  private readonly http = inject(HttpClient);

  /**
   * Obtem a estrutura de camos de uma tabela
   * @param {string} alias alias da tabela
   * @returns {Observable<any>} Observable contendo a estrutura de uma tabela
   */
  getAliasStruct(alias: string): Observable<any> {
    return this.http.get(`/api/framework/v1/basicProtheusServices/fwformstructview?alias=${alias}`);
  }
}
