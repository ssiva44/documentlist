import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({  
	selector: 'timeframe', 	
	templateUrl: './timeframe.component.html',
	providers: [],
	animations: [    	
		trigger('timeframeFadeInOut', [
			state('load, in', style({ height: "0px", display: "none" })),			
			state('out', style({ height: "*", display: "block" })),
			transition("in <=> out", animate(200)),
			transition("load <=> out", animate(200))
		])
	]
})

export class TimeframeComponent {	
	@Input() locale: string;	
	@Output() updatedTimeframe = new EventEmitter<string>();
	@Output() timeFramesOut = new EventEmitter<any[]>();
	@Output() selectedTimeframeOut = new EventEmitter<string>();
	
	allLocales: any = {};
	timeframe: string;
	timeFrames: any[];	
	selectedTimeFrame: string; 	
	isCollapsed: boolean = true;	
	collapseAnimation: string;

	constructor() { 		
		this.allLocales = {
			en : {                               
				timeFrame: "Timeframe",
				today: "Today",
				past7Days: "Past 7 Days",
				pastMonth: "Past Month",
				pastYear: "Past Year"               
            },
            es : {
                timeFrame: "Periodo",
				today: "Hoy",
				past7Days: "Últimos 7 días",
				pastMonth: "Último mes",
				pastYear: "Último año"                
            },
            fr : {
                timeFrame: "Période",
				today: "Aujourd’hui",
				past7Days: "7 jours précédents",
				pastMonth: "Mois précédent",
				pastYear: "Année précédente"
            },
            pt : {
                timeFrame: "Período",
				today: "Hoje",
				past7Days: "Últimos 7 dias",
				pastMonth: "Último mês",
				pastYear: "Último ano"
            },  
            ru : {
                timeFrame: "Временные рамки",
				today: "Сегодня",
				past7Days: "За последние 7 дней",
				pastMonth: "За последний месяц",
				pastYear: "За последний год"
            },
            ar : {
                timeFrame: "الإطار الزمني",
				today: "اليوم",
				past7Days: "الأيام السبعة الماضية",
				pastMonth: "الشهر الماضي",
				pastYear: "العام الماضي"
            },
            zh : {
                timeFrame: "时间范围",
				today: "今天",
				past7Days: "过去7天",
				pastMonth: "上个月",
				pastYear: "去年"
            }
		}
		this.collapseAnimation = 'load';
	}

	ngOnChanges() {	
		this.collapseAnimation = 'load';
		this.timeframe = this.allLocales[this.locale].timeFrame;
		this.timeFrames = [ {
			'label' : this.allLocales[this.locale].today,
			'value' : 'd',
		}, {
			'label' : this.allLocales[this.locale].past7Days,
			'value' : 'w',
		}, {
			'label' : this.allLocales[this.locale].pastMonth,
			'value' : 'm',
		}, {
			'label' : this.allLocales[this.locale].pastYear,
			'value' : 'y',
		}];					        
		this.timeFramesOut.emit(this.timeFrames);
	}	
	
	public onSelectTimeFrame(value) {	
		this.timeFrames.forEach(timeframe => {
			if (timeframe.value == value)
				this.selectedTimeFrame = timeframe.label;
		});
		this.updatedTimeframe.emit('tf=' + value);	
		this.selectedTimeframeOut.emit(this.selectedTimeFrame);
	};	 

	public updateIsCollapsed(collapse: any) {				
		this.collapseAnimation = collapse == true ? 'in' : 'out';		
		this.isCollapsed = collapse;		
	}  
}
