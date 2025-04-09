/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { finalize } from 'rxjs';
import {
  PoBreadcrumb,
  PoDialogService,
  PoDynamicFormField,
  PoDynamicModule,
  PoLoadingModule,
  PoNotificationService,
  PoPageAction,
  PoPageModule,
} from '@po-ui/ng-components';

import { FieldsControlService } from '../../../shared/services/fields-control.service';
import { ProductsService } from '../shared/services/products.service';
import { Products } from '../shared/interfaces/products';
import { ProductsFormService } from '../shared/services/products-form.service';

@Component({
  selector: 'app-products-form',
  imports: [PoPageModule, PoDynamicModule, PoLoadingModule],
  templateUrl: './products-form.component.html',
  styleUrl: './products-form.component.css',
})
export class ProductsFormComponent implements OnInit {
  readonly actions: PoPageAction[] = [
    { label: 'Salvar', action: this.saveProduct.bind(this), disabled: true },
    { label: 'Cancelar', action: this.confirmCancel.bind(this), disabled: true },
  ];
  readonly breadcrumb: PoBreadcrumb = { items: [{ label: 'Produtos', link: '/' }, { label: 'Cadastro de Produtos' }] };
  fields: PoDynamicFormField[] = [];
  isLoading = true;
  isUpdate = false;
  productForm: NgForm = new NgForm([], []);
  value: Products = {
    b1_desc: '',
    b1_um: '',
    b1_tipo: '',
    b1_locpad: '',
    b1_cod: '',
  };

  private readonly fieldsControlService = inject(FieldsControlService);
  private readonly poNotificationService = inject(PoNotificationService);
  private readonly poDialogService = inject(PoDialogService);
  private readonly router = inject(Router);
  private readonly productsService = inject(ProductsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsFormService = inject(ProductsFormService);

  ngOnInit(): void {
    this.listenToDisabledSaveAction();
    this.getFields();
    this.isUpdate = this.activatedRoute.snapshot.params['id'] !== undefined;
  }

  getFields(): void {
    this.fieldsControlService.getAliasStruct('SB1').subscribe({
      next: (fields: any) => {
        this.fields = this.productsFormService.convertFieldsToDynamicForm(fields['SB1'].fields);
        this.isLoading = false;
        this.productsFormService.isUpdateSaveAction(false);
        this.actions[1].disabled = false;
        this.productsFormService.updateLookupFields(this.fields);
        if (this.activatedRoute.snapshot.params['id']) {
          this.getValue(this.activatedRoute.snapshot.params['id']);
        }
        console.log(this.value, this.productForm, this.fields);
      },
      error: () => this.poNotificationService.error('Falha ao retornar campos para formulário.'),
    });
  }

  confirmCancel(): void {
    this.poDialogService.confirm({
      title: 'Confirmação',
      message: 'Tem certeza que deseja cancelar a operação? As informações preenchidas serão perdidas.',
      confirm: this.goToProductsList.bind(this),
    });
  }

  goToProductsList(): void {
    this.router.navigate(['']);
  }

  setForm(form: NgForm): void {
    this.productForm = form;
  }

  saveProduct(): void {
    this.productsFormService.saveProduct(this.productForm, this.isUpdate);
  }

  getValue(productId: string): void {
    if (productId) {
      this.isLoading = true;
      this.productsService
        .getById(productId)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (product: Products) => (this.value = product),
          error: () => this.poNotificationService.error('Falha ao consultar Produto'),
        });
    }
  }

  listenToDisabledSaveAction(): void {
    this.productsFormService.isDisabledAction.subscribe({
      next: isDisabled => (this.actions[0].disabled = isDisabled),
    });
  }
}
