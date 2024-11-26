import { Injectable, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslateUtilService implements OnDestroy {
  private subscriptions = new Subscription();

  constructor(private translate: TranslateService) { }

  getTranslateText(codigo: string): string {
    const TRANSLATE = this.translate.instant(codigo);
    return TRANSLATE;
  }

  getTranslateTextWithAttribute(codigo:string, val:any): string {
    const TRANSLATE_ATRIBUTE = this.translate.instant(codigo, { value: val });
    return TRANSLATE_ATRIBUTE;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
