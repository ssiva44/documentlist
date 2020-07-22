import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'filter' }) 
export class FilterPipe implements PipeTransform { 
	transform(value: any): any {				
		if (typeof value === 'string') {			
			return value;
		} else {			
			for (let key in value) {
				if (typeof value[key] === 'string') {						
					return value[key];
				} else {
					for (let key2 in value[key]) {
						return value[key][key2];
					}
				}
			}
		}		
		return '';	
	} 
}