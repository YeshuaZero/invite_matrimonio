import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({ name: 'safeUrl' })

export class SafeUrlPipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) { }

    transform(value: string): SafeUrl {
        console.log('value:', value)
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
    }
}