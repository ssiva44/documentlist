import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'objectContains', pure: false }) 
export class ObjectContainsPipe implements PipeTransform { 
	transform(value: any, objectKey: any): boolean {			
		if(value.hasOwnProperty(objectKey)) {
			if (value[objectKey] == '')
				return false;
			else
				return true;
		} else {
			return false;
		}
	} 
}