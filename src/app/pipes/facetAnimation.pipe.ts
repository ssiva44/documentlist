import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'facetAnimation', pure: false }) 
export class FacetAnimationPipe implements PipeTransform { 
	transform(value: any, facetName: any): string {			
        let animation = 'load';
		if(value.length == 0) {
			return animation;
		} else {			
            if (value.indexOf(facetName) > -1) {
                animation = 'out';
            } else {			
                animation = 'in';
			}		
			return animation;
		}		
	} 
}