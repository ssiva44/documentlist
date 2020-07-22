import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'checked', pure: false }) 
export class FacetCheckedPipe implements PipeTransform { 
	transform(value: any, facetName: any, facetItem: any): any {                
		if (Object.keys(value).length == 0) {
            return false;
        } else {            
            if (value[facetName] == undefined) {
                return false;
            } else {                
                let facet = value[facetName];    
                facetItem = facetItem.replace(/\s+/g, "+");           
                if (facet.indexOf(facetItem) == -1) {
                    return false;
                } else {              
                    return true;
                }               
            }                          
        }        							
	} 
}