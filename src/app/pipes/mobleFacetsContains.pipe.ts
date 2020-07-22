import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'mobileFacetContains' }) 
export class MobileFacetContainsPipe implements PipeTransform { 
	transform(value: any, facetName: any): any {			
		let objects = [];		

		Object.keys(value).forEach( key => {
			if(facetName == value[key].facetName) {					
				objects.push(value[key]);
			}								
		});		
		return objects;
	} 
}