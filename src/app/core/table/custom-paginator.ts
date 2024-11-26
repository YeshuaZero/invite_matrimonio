import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { TranslateUtilService } from '../i18n/translate-util.service';

@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl {
    changes = new Subject<void>();

    // For internationalization, the `$localize` function from
    // the `@angular/localize` package can be used.
    firstPageLabel = this.translateUtilService.getTranslateText('Paginator.firstPage');
    itemsPerPageLabel = this.translateUtilService.getTranslateText('Paginator.itemsPerPage');
    lastPageLabel = this.translateUtilService.getTranslateText('Paginator.lastPage');

    // You can set labels to an arbitrary string too, or dynamically compute
    // it through other third-party internationalization libraries.
    nextPageLabel = this.translateUtilService.getTranslateText('Paginator.nextPage');
    previousPageLabel = this.translateUtilService.getTranslateText('Paginator.previousPage');

    constructor(private translateUtilService: TranslateUtilService) { }

    getRangeLabel(page: number, pageSize: number, length: number): string {
        if (length === 0) {
            return `${this.translateUtilService.getTranslateText('Paginator.page')} 1 ${this.translateUtilService.getTranslateText('Paginator.of')} 1`;
        }
        const amountPages = Math.ceil(length / pageSize);
        return `${this.translateUtilService.getTranslateText('Paginator.page')} ${page + 1} ${this.translateUtilService.getTranslateText('Paginator.of')} ${amountPages}`;
    }
}