import { Component, computed, input } from '@angular/core';
import { PoComboOption, PoFieldModule, PoLoadingModule, PoTableModule } from '@po-ui/ng-components';
import { ProCompany, ProCompanyList } from '@totvs/protheus-lib-core';

@Component({
  selector: 'app-companies',
  imports: [PoFieldModule, PoTableModule, PoLoadingModule],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css',
})
export class CompaniesComponent {
  isLoading = input<boolean>(false);
  items = input<ProCompanyList>({
    items: [],
    hasNext: false,
  });
  companiesOptions = computed(() => this.convertCompaniesToPoComboOptions(this.items().items));

  convertCompaniesToPoComboOptions(items: ProCompany[]): PoComboOption[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return items.map((item: any) => ({
      ...item,
      label: item.CorporateName,
      value: item.Code,
    }));
  }
}
