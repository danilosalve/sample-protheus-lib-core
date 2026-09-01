import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoButtonModule, PoContainerModule, PoFieldModule } from '@po-ui/ng-components';

@Component({
  selector: 'app-alias-form',
  imports: [FormsModule, PoContainerModule, PoFieldModule, PoButtonModule],
  templateUrl: './alias-form.component.html'
})
export class AliasFormComponent {
  readonly alias = model<string>('');
  readonly action = model<number | null>(null);

  readonly alphaNumericPattern = input<string>('^[a-zA-Z0-9]+$');
  readonly disableSubmit = input<boolean>(false);

  readonly submitForm = output<void>();

  onSubmit() {
    this.submitForm.emit();
  }
}
