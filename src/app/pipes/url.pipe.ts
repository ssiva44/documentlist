import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'url' }) 
export class UrlPipe implements PipeTransform { 
	transform(url: any, runmode: any): any {			
        if ((url != undefined || url != '') && (runmode != undefined || runmode != '')) {            
            let urlArr = url.split('/');
            let guid = urlArr[urlArr.length - 2];
            let title = urlArr[urlArr.length - 1];
            
            if (runmode == 'publish') {
                return '/' + guid + '/' + title;
            } else {
                return '.' + guid + '.' + title + '.html';
            }
        } else {
            return '';
        }
	} 
}