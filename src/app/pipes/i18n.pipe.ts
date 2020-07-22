import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'i18n' })
export class I18NPipe implements PipeTransform {
    transform(value: string, i18n: any): string {  
        return i18n[value];
    }
}