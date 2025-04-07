/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProAdapterBaseV2, ProAdapterBaseV2Service, ProJsToAdvplService } from '@totvs/protheus-lib-core';
import { Products } from '../interfaces/products';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly apiUrl = '/api/universototvs/v1/products';
  private readonly http = inject(HttpClient);
  private readonly proAdapterBaseV2Service = inject(ProAdapterBaseV2Service);
  private readonly proJsToAdvplService = inject(ProJsToAdvplService);

  get(
    page: number,
    pageSize: number,
    filter?: string,
    fields?: string,
    order?: string
  ): Observable<ProAdapterBaseV2<Products>> {
    const parameters: HttpParams = this.proAdapterBaseV2Service.getHttpParams(page, pageSize, filter, fields, order);
    return this.http.get<ProAdapterBaseV2<Products>>(this.apiUrl, { params: parameters });
  }

  getById(productId: string): Observable<Products> {
    return this.http.get<Products>(`${this.apiUrl}/${productId}`);
  }

  post(body: Products): Observable<Products> {
    return this.http.post<Products>(this.apiUrl, body);
  }

  put(productId: string, body: Products): Observable<Products> {
    return this.http.put<Products>(`${this.apiUrl}/${productId}`, body);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  checkBalance(productId: string): Observable<number> {
    return this.proJsToAdvplService.buildObservable<number>(
      ({ protheusResponse, subscriber }: any) => {
        subscriber.next(protheusResponse);
        subscriber.complete();
      },
      {
        autoDestruct: true,
        receiveId: 'checkBalance',
        sendInfo: {
          type: 'checkBalance',
          content: productId,
        },
      }
    );
  }

  getParam(param: string): void {
    this.proJsToAdvplService.jsToAdvpl('getParam', param);
  }
}
