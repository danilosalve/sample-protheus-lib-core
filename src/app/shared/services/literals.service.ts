import { inject, Injectable } from '@angular/core';
import { PoI18nService } from '@po-ui/ng-components';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LiteralsService {
  private readonly _literals = new BehaviorSubject<object>({});
  private readonly poI18nService = inject(PoI18nService);

  constructor() {
    this.load();
  }

  getLiterals(): Observable<object> {
    return this._literals;
  }

  setLiterals(literals: object): void {
    this._literals.next(literals);
  }

  private load(): void {
    this.poI18nService
      .getLiterals({ context: 'sampleProtheusLibCore' })
      .subscribe(literals => this.setLiterals(literals));
  }
}
