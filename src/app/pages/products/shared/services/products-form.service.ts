/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PoNotificationService } from '@po-ui/ng-components';
import { finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import { Products } from '../interfaces/products';
import { ProductsService } from './products.service';
import { GENERIC_LOOKUP_URL } from '../../helpers/products-default-url.constants';

@Injectable({
  providedIn: 'root',
})
export class ProductsFormService {
  protected isDisabled$ = new BehaviorSubject<boolean>(true);
  private readonly poNotificationService = inject(PoNotificationService);
  private readonly productsService = inject(ProductsService);
  private readonly router = inject(Router);

  get isDisabledAction(): Observable<boolean> {
    return this.isDisabled$.asObservable();
  }

  convertFieldsToDynamicForm(fields: any): any {
    return fields
      .filter((fields: any) => fields.required)
      .map((field: any) => ({ ...field, label: field.title, property: field.field.toLowerCase() }));
  }

  isUpdateSaveAction(disabled: boolean): void {
    this.isDisabled$.next(disabled);
  }

  postProduct(product: Products): void {
    this.productsService
      .post(product)
      .pipe(finalize(() => this.isUpdateSaveAction(false)))
      .subscribe({
        next: () => this.handleSuccess(false),
        error: () => this.handleError(),
      });
  }

  putProduct(product: Products): void {
    this.productsService
      .put(product.b1_cod, product)
      .pipe(finalize(() => this.isUpdateSaveAction(false)))
      .subscribe({
        next: () => this.handleSuccess(true),
        error: () => this.handleError(),
      });
  }

  saveProduct(productForm: NgForm, isUpdate: boolean): void {
    this.isUpdateSaveAction(true);

    if (isUpdate) {
      this.putProduct(productForm.value);
    } else {
      this.postProduct(productForm.value);
    }
  }

  updateLookupFields(fields: any): void {
    fields.forEach((field: any) => {
      if (field.field === 'B1_LOCPAD') {
        field.searchService = `${GENERIC_LOOKUP_URL}/NNR`;
        field.fieldLabel = 'nnr_descri';
        field.fieldValue = 'nnr_codigo';
        field.columns = [
          { property: 'nnr_codigo', label: 'Código' },
          { property: 'nnr_descri', label: 'Descrição' },
        ];
      } else if (field.field === 'B1_TIPO') {
        field.searchService = `${GENERIC_LOOKUP_URL}/02`;
        field.fieldLabel = 'x5_descri';
        field.fieldValue = 'x5_chave';
        field.columns = [
          { property: 'x5_chave', label: 'Tipo' },
          { property: 'x5_descri', label: 'Descrição' },
        ];
      } else if (field.field === 'B1_UM') {
        field.searchService = `${GENERIC_LOOKUP_URL}/SAH`;
        field.fieldLabel = 'ah_descpo';
        field.fieldValue = 'ah_unimed';
        field.columns = [
          { property: 'ah_unimed', label: 'Unidade' },
          { property: 'ah_descpo', label: 'Descrição' },
        ];
      }
    });
  }

  private handleSuccess(isUpdate: boolean): void {
    this.poNotificationService.success(`Registro ${isUpdate ? 'alterado' : 'incluído'} com sucesso.`);
    this.router.navigate(['']);
  }

  private handleError(): void {
    this.poNotificationService.error('Falha ao salvar Produto');
  }
}
