import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'capitalize' })

export class CapitalizePipe implements PipeTransform {
    transform(value: string, primeraLetra?: boolean): string {
        if (!value || value.length === 0) {
            return value;
        }

        value = value.toLowerCase();
        if (primeraLetra) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }

        return value.replace(/(^|\s|-)([a-záéíóúüñ])/g, (match, separator, char) => {
            return separator + char.toUpperCase();
        });
    }
}