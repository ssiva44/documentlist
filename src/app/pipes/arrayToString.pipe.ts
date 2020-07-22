import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'arraytostring' }) 
export class ArrayToStringPipe implements PipeTransform { 
	transform(value: any, param: string): any {				
        let data = '';
		if (typeof value === 'string') {			
			data = value;
		} else {			
			for (let key in value) {
				data = data == '' ? value[key][param] : data + ',' + value[key][param];
			}
		}
		return data;	
	} 
}