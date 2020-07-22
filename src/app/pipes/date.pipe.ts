import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'dateFormatPipe' })
export class DateFormatPipe implements PipeTransform {
    transform(value: string, locale: string): string {      
        if (value !== undefined && locale !== undefined) {
            let m = moment.utc(value);
			
            let formatedDate = '';
            if (locale === 'en') 
                formatedDate = m.locale(locale).format('MMMM D, YYYY');
            else if (locale === 'es' || locale === 'pt')            
                formatedDate = m.locale(locale).format('D [de] MMMM [de] YYYY');
            else if (locale === 'fr')
                formatedDate = m.locale(locale).format('D MMMM YYYY');
            else if (locale === 'ru')
                formatedDate = m.locale(locale).format('D MMMM YYYY [года]');
            else if (locale === 'ar')            
                formatedDate = m.format('YYYY[/]MM[/]DD');
            else if (locale === 'zh')            
                formatedDate = m.format('YYYY[年]M[月]D[日]');
             
            return formatedDate;       
    	}		
    }
}