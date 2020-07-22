import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { IMyDpOptions, IMyDate } from './my-date-picker/interfaces';
import { I18nService } from './services/I18nService';

@Component({  
	selector: 'date', 	
	templateUrl: './date.component.html',
	providers: [],
	animations: [    	
		trigger('dateFadeInOut', [
			state('load, in', style({ height: "0px", display: "none" })),
			state('out', style({ height: "*", display: "block" })),
			transition("in <=> out", animate(200)),
			transition("load <=> out", animate(200))
		])
	]
})

export class DateComponent {		
	@Input() locale: string;
	@Input() isClearAll: boolean;
	@Input() queryParameters: any
	@Output() selectedDateRange = new EventEmitter<any>();	
	
	i18nService: any;
	startDate: string = '';
	endDate: string = '';	
	isCollapsed: boolean = true;
	collapseAnimation: string = 'load';
	dateIcon: string;	
	
	constructor() { }

	ngOnChanges() {	
		this.i18nService = I18nService.ALL_LOCALES[this.locale];
		this.dateIcon = this.locale == 'ar' ? 'fa fa-caret-left' : 'fa fa-caret-right';  
		if (this.isClearAll)    	
			this.startDate = this.endDate = '';
		
		this.startDate = this.queryParameters.hasOwnProperty("strdate") ? this.queryParameters["strdate"] : "";
		this.endDate = this.queryParameters.hasOwnProperty("enddate") ? this.queryParameters["enddate"] : "";		
    }	
		
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
        selectorWidth: '100%',
		selectorHeight: '200px',		
    };

    endDateOptions: IMyDpOptions = {	
        todayBtnTxt: 'Today',
        dateFormat: 'mm/dd/yyyy',
        editableDateField: true,
        openSelectorOnInputClick: true,
        showClearDateBtn: false,
        disableUntil: <IMyDate>{},
        disableSince: <IMyDate>{},
        selectorWidth: '100%',
        selectorHeight: '200px'
    };

    placeholder: string = 'mm/dd/yyyy';      

	public onDateRange() {						
		if (this.startDate == '' || this.endDate == '') {
			this.startDate = this.endDate = '';
		}      				
        this.selectedDateRange.emit({ startDate: this.startDate, endDate: this.endDate });	        	   
    }   

    public onSelectedDate(startDate: any, endDate: any) {
    	this.startDate = startDate;
    	this.endDate = endDate;
    	this.onDateRange();
    }   

	public updateIsCollapsed(collapse: any) {		
		this.collapseAnimation = collapse == true ? 'in' : 'out';		
		this.isCollapsed = collapse;		
	}  
}
