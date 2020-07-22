import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'facetContains', pure: false }) 
export class FacetContainsPipe implements PipeTransform { 
	transform(value: any, limitFacets: any, index: number): any {		
		let objects = [];		
		let i = 0;
				
		//value.sort((a, b) => a.label.localeCompare(b.label)); 
		
		Object.keys(value).forEach( key => {
			if (limitFacets.indexOf(index) > -1) {						
				objects.push(value[key]);
			} else {						
				if (i < 6) {
					objects.push(value[key]);	
				}			
				i++;
			}								
		});
						
		return objects;
	} 
}