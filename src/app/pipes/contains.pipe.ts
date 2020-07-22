import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'contains', pure: false }) 
export class ContainsPipe implements PipeTransform { 
	transform(value: any, index: any): boolean {						
		if(value.length == 0) {
			return false;
		} else {			
			return value.indexOf(index) > -1;
		}		
	} 
}