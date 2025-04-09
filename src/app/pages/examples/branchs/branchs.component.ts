import { Component, computed, input } from '@angular/core';
import { PoComboOption, PoFieldModule, PoLoadingModule, PoTableModule } from '@po-ui/ng-components';
import { ProBranch, ProBranchList } from '@totvs/protheus-lib-core';

@Component({
  selector: 'app-branchs',
  imports: [PoTableModule, PoFieldModule, PoLoadingModule],
  templateUrl: './branchs.component.html',
  styleUrl: './branchs.component.css',
})
export class BranchsComponent {
  isLoading = input<boolean>(false);
  items = input<ProBranchList>({});
  branchesOptions = computed(() => this.convertBranchesToPoComboOptions(this.items().items!));

  convertBranchesToPoComboOptions(items: ProBranch[]): PoComboOption[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return items.map((item: any) => ({
      ...item,
      label: item.Description,
      value: item.Code,
    }));
  }
}
