import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'length' })
export class ObjectsLengthPipe implements PipeTransform {
	transform(value : number) {
		if (value !== undefined) {		
			return Object.keys(value).length;
		}		
	}	
}