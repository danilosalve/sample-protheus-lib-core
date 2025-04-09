/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FieldsControlService {
  private readonly http = inject(HttpClient);

  getAliasStruct(alias: string): Observable<any> {
    return this.http.get(`/api/framework/v1/basicProtheusServices/fwformstructview?alias=${alias}`);
  }
}
