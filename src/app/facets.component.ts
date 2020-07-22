import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { I18nService } from './services/I18nService';

@Component({  
	selector: 'facets', 	
	templateUrl: './facets.component.html',
	providers: [ ],
	animations: [    	
		trigger('facetFadeInOut', [
			state('load, in', style({ height: "0px", display: "none" })),
			state('out', style({ height: "*", display: "block" })),
			transition("in <=> out", animate(200)),
			transition("out <=> load", animate(200))
		])
	]
})

export class FacetsComponent {				
	@Input() facetsIn: Object;	
	@Input() locale: string;	
	@Input() isClearAll: boolean;	
	@Input() queryParameters: any;
	@Output() updatedFacets = new EventEmitter<string>();
	@Output() selectedFacetsOut = new EventEmitter<any>();

	i18nService: any;
	facets: any = [];
	collapseFacets: any[] = [];
	limitFacets: any[] = [];
	selectedFacets: any = {};
	
	constructor() {	}

	ngOnChanges() {	
		this.i18nService = I18nService.ALL_LOCALES[this.locale];
        if(this.facetsIn !== undefined) { 
			   	       
			this.facets = this.facetsIn;
			
			this.facets.forEach((facet: any) => {
				if (this.queryParameters.hasOwnProperty(facet.facetName)) {
					let facetItems = this.queryParameters[facet.facetName];
					facetItems = facetItems.indexOf("^") === -1 ? [facetItems] : facetItems.split("^");
					this.selectedFacets[facet.facetName] = facetItems;
					this.collapseFacets.push(facet.facetName);
				}				
			});	
		}		
		
		if (this.isClearAll) 
			this.selectedFacets = {};				
    }

   	public onCollapse(index: any) {
		let i = this.collapseFacets.indexOf(index, 0);
		if (i > -1) {
		   this.collapseFacets.splice(i, 1);
		} else {
			this.collapseFacets.push(index);
		}				
    };

	public onSeeMore(index: any) {
		this.limitFacets.push(index);		
    };

	public onSeeLess(index: any) {
		let i = this.limitFacets.indexOf(index, 0);
		if (i > -1) {
		   this.limitFacets.splice(i, 1);
		}				
    };

    public onFacetItem(facet: any, itemName: any) {					
		itemName = itemName.replace(/\s+/g, "+");
		if (this.selectedFacets.hasOwnProperty(facet)) {
			let facetItems = this.selectedFacets[facet]; 
			let index = facetItems.indexOf(itemName);
			
			if (index > -1) 								
				facetItems.splice (index, 1);
			else
				facetItems.push(itemName);
			
			this.selectedFacets[facet] = facetItems;
		} else {
			this.selectedFacets[facet] = [itemName];
		}					
					
		this.selectedFacetsOut.emit(this.selectedFacets);		
    }		
}
