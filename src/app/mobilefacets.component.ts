import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { IMyDpOptions, IMyDate } from './my-date-picker/interfaces';
import { I18nService } from './services/I18nService';

@Component({  
	selector: 'mobilefacets', 	
	templateUrl: './mobilefacets.component.html',
	providers: [],
	animations: [    	
		trigger('refineFadeInOut', [
			state('true', style({ height: "0px", display: "none", opacity: 0 })),
			state('false', style({ height: "*", display: "block", opacity: 1 })),
			transition("* => *", animate(300))
		]),
		trigger('flyInOut', [
			state('in', style({transform: 'translateX(0)'})),
			transition('void => *', [
			  	style({transform: 'translateX(-100%)'}),//
			  	animate(100)
			]),
			transition('* => void', [
			 	animate(100, style({transform: 'translateX(100%)'}))
			])
		])
	]
})

export class MobileFacetsComponent {
	@Input() isCollapsed: boolean;
	@Input() locale: any;
	@Input() facetsIn: any;	
	@Input() searchIn: any;	
	@Input() apiLanguage: string;	
		
	@Output() isCollapsedOut = new EventEmitter<boolean>();
	@Output() selectedTimeframe = new EventEmitter<any>();
	@Output() deselectedTimeframe = new EventEmitter<any>();
	@Output() selectedDateRange = new EventEmitter<any>();	
	@Output() selectedFacet = new EventEmitter<any>();
	@Output() deselectedFacet = new EventEmitter<any>();

	i18nService: any;
	isAllFacets: boolean = false;
	isDate: boolean = true;
	isFacets: boolean = true;		
	startDate: string = '';
	endDate: string = '';	
	dateIcon: string;	
	facets: any = [];
	limitFacets: any[] = [];
	selectedFacets: any[] = [];
	facetName: string;	
	datePlaceholder: string = 'mm/dd/yyyy';		

	constructor() { }

	ngOnChanges() {	
		this.i18nService = I18nService.ALL_LOCALES[this.locale];			
		if (this.facetsIn != undefined) {
			this.facets = this.facetsIn;			
		}           
			
		this.dateIcon = this.locale == 'ar' ? 'fa fa-caret-left' : 'fa fa-caret-right';		
    }

    /* Date Range start */
	public onStartDateChanged(dateChanged: any) {		
		this.startDate = dateChanged.formatted;				
	}

	public onEndDateChanged(dateChanged: any) {		
		this.endDate = dateChanged.formatted;		
	}

	startDateOptions: IMyDpOptions = {	
        todayBtnTxt: 'Today',
        dateFormat: 'mm/dd/yyyy',
        editableDateField: true,
        openSelectorOnInputClick: true,
        showClearDateBtn: false,
        disableUntil: <IMyDate>{},
		disableSince: <IMyDate>{},
		selectorWidth: '191px',
        selectorHeight: '200px'
    };

    endDateOptions: IMyDpOptions = {	
        todayBtnTxt: 'Today',
        dateFormat: 'mm/dd/yyyy',
        editableDateField: true,
        openSelectorOnInputClick: true,
        showClearDateBtn: false,
        disableUntil: <IMyDate>{},
		disableSince: <IMyDate>{},
		selectorWidth: '191px',
        selectorHeight: '200px'
    };
   	 
    public replaceAll(str: any, find: any, replace: any) {
    	return str.replace(new RegExp(find, 'g'), replace);
	}

	public onSeletedDates(startDate: any, endDate: any) {				
		this.startDate = startDate;
		this.endDate = endDate;	
	}
	
	public onDateRange() {		
		//this.collapseAll();				
		this.selectedDateRange.emit({ startDate: this.startDate, endDate: this.endDate });
    }    
    /* Date Range End */

    /* Facets Start */    
	public onSeeMore(index: any) {
		this.limitFacets.push(index);		
    };

	public onSeeLess (index: any) {
		let i = this.limitFacets.indexOf(index, 0);
		if (i > -1) {
		   this.limitFacets.splice(i, 1);
		}				
    };

    public onFacetItem(facet: any, itemName: any) {
    	//this.collapseAll();
    	this.selectedFacet.emit({ facet: facet, itemName: itemName });
    }
    
	public getSelectedFacets(selectedFacets: any) {		
		this.selectedFacets = selectedFacets;				
    }
	/* Facets End */

    public onSelectDate() {
		this.isAllFacets = true;
    	this.isFacets = true;    	
    	this.isDate = false;
    }

    public onSelectFacetName(facetName: any) {    	
    	this.facetName = facetName;
    	this.isAllFacets = true;
    	this.isFacets = false;    	
    }

    public onBack() {			
    	this.isAllFacets = false;
    	this.isFacets = true;
    	this.isDate = true;
    }

    public collapseAll() {
    	this.isCollapsed = true;
    	this.isAllFacets = false;
    	this.isFacets = true;
    	this.isDate = true;    	
    	this.isCollapsedOut.emit(this.isCollapsed);
    }

    public uniqueArray(array: any) {
	  	return array.filter(function(elem: any, pos: any, arr: any) {
	    	return arr.indexOf(elem) == pos;
	  	});
	};	
}
