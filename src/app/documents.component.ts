import { Component, Input, Output, EventEmitter, SecurityContext } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DataService } from './services/data.service';
import { ExcelService } from "./services/excel.service";
import { PagerService } from './services/pager.service';
import { I18nService } from './services/I18nService';
import { ApiParams } from './services/ApiParams';
import { FilterPipe } from './pipes/filter.pipe';
import { DateFormatPipe } from './pipes/date.pipe';
import { UrlPipe } from './pipes/url.pipe';
import * as moment from 'moment';

declare function documentsAnalyticParams(parameters: any, sterm: any, sresults: any, sortby: any, pagination: any): any;

@Component({  
	selector: 'documents', 	
	templateUrl: './documents.component.html',
    providers: [ DataService, ExcelService, PagerService, I18nService, FilterPipe, DateFormatPipe, UrlPipe ],
    animations: [
    	trigger('fadeInOut', [
      		transition('void => *', [style({opacity:0}), animate(500, style({opacity:1}))]),
      		transition('* => void', [animate(500, style({opacity:0}))])
    	]),		
  	]
})

export class DocumentsComponent {
    @Input() locale: string;
    @Input() documentsApi: string;	
    @Input() documentsPath: string;	
    @Input() advancedSearchPath: string;	
    @Input() runmode: string;	
    @Input() nodataLink: string;	
    @Output() updatedLoader = new EventEmitter<boolean>();	
    
    objectKeys = Object.keys;
    i18nService: any = {}; 
    params: any;
    url: string;     
    qterm: string = '';  	         
    rows: number;  
    allFacets: any[] = [];    
    facets: any;
    documents: any = {};    
    selectedDoucuments: any = {};    
    isDocuments: boolean = true;
    showingDetails: string;
    isCollapsed: boolean = true;
    isFacetsCollapsed: boolean = false;
    sideBarArrow: string;
    leftArrow: string;
	rightArrow: string;
    page: number;
    totalPages: any[];	
	pager: any = {};
    pagedItems: any[];
    total: number;
    sortBy: string;  
    sortType: string = 'asc'; 
    sortedColumns: any[] = [];
    selectedFacets: string;
    selectedDates: string;
    isClearAll: boolean = false;  
    noData: string;
    searchValue: string;
    isSeachIn: boolean = false;
    searchInValue: string;
    placeholder: string;
    queryParameters: any = {};    
    
    constructor(
        private dataService: DataService, 
        private excelService: ExcelService, 
        private pagerService: PagerService, 
        private filter: FilterPipe, 
        private date: DateFormatPipe,
        private urlPipe: UrlPipe
    ) {         
        this.params = ApiParams;
        this.sortBy = this.params.DOCUMENT_DATE; 
    }

    ngOnChanges() {
        this.i18nService = I18nService.ALL_LOCALES[this.locale];
        this.noData = this.i18nService.noData;
                                              
        if (this.nodataLink != '') 
            this.noData = this.noData.replace('href="/"', 'href="' + this.nodataLink + '"');        
          
        this.sideBarArrow = this.locale == 'ar' ? 'fa fa-angle-right' : 'fa fa-angle-left';
        this.leftArrow = this.locale == 'ar' ? 'fa fa-angle-right' : 'fa fa-angle-left';
		this.rightArrow = this.locale == 'ar' ? 'fa fa-angle-left' : 'fa fa-angle-right';
        
        let rows = this.getParameterByName('rows', this.documentsApi);
        
        if (rows == null) {
            this.rows = 20;
            this.url = this.documentsApi + '&rows=' + this.rows + '&apilang=' + this.locale;
        } else {
            this.rows = Number(rows);
            this.url = this.documentsApi + '&apilang=' + this.locale;
        }

        let apiFacets = this.getParameterByName('fct', this.documentsApi);
        if (apiFacets == null) {
            this.allFacets = [];
        } else {            
            if (apiFacets.indexOf(",") === -1) {
                this.allFacets.push(apiFacets);
            } else {
                apiFacets.split(",").forEach(facet => {
                    this.allFacets.push(facet);
                });
            }
        }        
                   
        this.queryParameters = this.getQueryParams(document.location.search);
        
        let queryArr = [];
        for (const key in this.queryParameters) {
            if (this.queryParameters.hasOwnProperty(key)) {  
                let value = this.queryParameters[key];              
                if (key == "qterm") {
                    this.qterm = value; 
                } else if (key == "order") {
                    this.sortType = value;
                    this.url = this.removeURLParameter(this.url, 'order');
                } 

                if (key == "srt") {                                       
                    if (value == this.params.DOCUMENT_DATE)                    
                        this.sortBy = this.params.DOCUMENT_DATE;    
                    else if (value == this.params.DISPLAY_TITLE_SORT)                    
                        this.sortBy = this.params.DISPLAY_TITLE_SORT; 
                    else if (value == this.params.REPORT_NUMNER_SORT)                    
                        this.sortBy = this.params.REPORT_NUMNER_SORT
                    else if (value == this.params.DOCUMENT_TYPE_SORT)                    
                        this.sortBy = this.params.DOCUMENT_TYPE_SORT   
                    else 
                        this.sortBy = this.params.DOCUMENT_DATE;                                               
                } else {
                    this.sortBy = this.params.DOCUMENT_DATE;
                                  
                }
                this.url = this.removeURLParameter(this.url, 'srt') + '&srt=' + this.sortBy;  
                queryArr.push(key + "=" + value);
            }            
        }
      
        this.url += "&" + queryArr.join("&") + '&os=0';
            
        this.dataService.getResponse(this.url, null).subscribe((response)=> { 
     
            this.createFacets(response["documents"].facets);
            delete response["documents"].facets;
            
            if (Object.keys(response["documents"]).length > 0) {            
                this.total = response["total"];
                this.documents = response["documents"];                
                this.page = 1;
                this.getShowingDetails(this.page, this.total, this.qterm); 
                this.pagination(this.page, this.total);
            } else {
                this.isDocuments = false;                                
            }
            this.updatedLoader.emit(false); 
        })
    }

    public createFacets(facetsResponse: any) {               
        if (Object.keys(facetsResponse).length > 0) {
            let orderedFacets = [], facets = [], hasFacetKey = false;
        
            this.allFacets.forEach(facetKey => {                    
                orderedFacets.push({[facetKey] : facetsResponse[facetKey]});
            });

            orderedFacets.forEach(facet => {
                let facetName = Object.keys(facet)[0];
                                
                if (facetName == this.params.COUNTRY_EXACT) {
                    //hasFacetKey = this.queryParameters.hasOwnProperty(this.params.COUNTRY_KEY);
                } else if (facetName == this.params.DOCUMENT_TYPE_EXACT) {
                    //hasFacetKey = this.queryParameters.hasOwnProperty(this.params.DOCUMENT_TYPE_KEY);
                } else {
                    hasFacetKey = false;   
                }
               
                if (!hasFacetKey) {                        
                    facets.push({
                        facetName: facetName, 
                        facetItems: facetsResponse[facetName]
                    });
                }                                   
            });                
            this.facets = facets;
        } else {
            this.facets = [];
        }
  
    }
    
    public updateProjects() { 
        this.updatedLoader.emit(true); 
       
        let queryArr = [];
        for (const key in this.queryParameters) {
            if (this.queryParameters.hasOwnProperty(key)) {                      
                if (this.url.indexOf(key + "=") !== -1) {                    
                    this.url = this.removeURLParameter(this.url, key);                   
                }
                queryArr.push(key + "=" + this.queryParameters[key]);
            }
        }        
        
        if (queryArr.length > 0){
            this.url += "&" + queryArr.join("&");
        }
        
        if (this.isSeachIn) {
            this.url = this.removeURLParameter(this.url, "qterm") + "&qterm=" + this.qterm + "+" + this.searchInValue;
        }            

       
        window.history.pushState("", "", "?" + queryArr.join("&"));
      
        this.dataService.getResponse(this.url, null).subscribe((response)=> {
            this.documents = {};
            this.createFacets(response["documents"].facets);            
            delete response["documents"].facets;
            
            if (Object.keys(response["documents"]).length > 0) {               
                this.isDocuments = true;
                this.total = response["total"];
                this.documents = response["documents"];                                                                                            
            } else {  
                this.isDocuments = false;                
            }

            if (this.isDocuments) {                                        
                let os = this.getParameterByName('os', this.url);
                if (os == null) {
                    this.page = 1;
                } else {     
                    this.page = (+os / this.rows) + 1;               
                }
                this.pagination(this.page, this.total);
                this.getShowingDetails(this.page, this.total, this.qterm); 
                
               
                let sterm = this.qterm == undefined || this.qterm == '' ? '' : this.qterm;    
                let facets = this.selectedFacets == undefined || this.selectedFacets == '' ? '' : this.selectedFacets;
               
                let dates = this.selectedDates == undefined || this.selectedDates == '' ? '' : this.selectedDates;
                let sortBy = this.sortBy == undefined || this.sortBy == '' ? '' : this.sortBy;
                let queryParameters = '';                
                // queryParameters = queryParameters + (facets == '' ? '' : '&' + facets) + (timeframe == '' ? '' : '&' + timeframe) + (dates == '' ? '' : '&' + dates);
                
                // documentsAnalyticParams(queryParameters, sterm, this.total, sortBy, this.page); 
            }
            this.updatedLoader.emit(false); 
        });
    }

    public setPage(page: number, el: HTMLElement) {            	
        this.url = this.removeURLParameter(this.url, 'os') + '&os=' + (page - 1) * this.rows;
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        el.scrollIntoView({behavior:"smooth"});
        this.updateProjects();  
    }
    
    public pagination(page: any, total: any) {
        // total pages
        let range = [];
        for(let i = 1; i <= total; i++) {
            range.push(i);
        }  					
        this.totalPages = range;           				

        // get pager object from service
        this.pager = this.pagerService.getPager(this.totalPages.length, page, this.rows);

        // get current page of items
        this.pagedItems = this.totalPages.slice(this.pager.startIndex, this.pager.endIndex + 1);        
    }

    public updateDates(startDate: any, endDate: any) {                   
        this.queryParameters["strdate"] = this.replaceAll(startDate, "/", "-");
        this.queryParameters["enddate"] = this.replaceAll(endDate, "/", "-");
        this.url = this.removeURLParameter(this.url, "os") + "&os=0";
        this.updateProjects();  
    }
    
    public updateFacets(facets: any) {            
        let selectedFacets = [];
        this.allFacets.forEach(facetName => {
            if (facetName == 'countryshortname_exact') {
                this.url = this.removeURLParameter(this.removeURLParameter(this.url, 'countryshortname_exact'), 'countrycode_exact');
            } else if (facetName == 'sector_exact') {
                this.url = this.removeURLParameter(this.removeURLParameter(this.url, 'sector_exact'), 'sectorcode_exact');
            } else {                
                this.url = this.removeURLParameter(this.url, facetName);
            }               
        });

        for (const key in facets) {
            if (facets.hasOwnProperty(key)) {
                const element = facets[key];
                if (element.length > 0) {
                    this.queryParameters[key] = element.join("^");
                    selectedFacets.push(key + "=" + element.join("^"));
                } else {
                    delete this.queryParameters[key];
                }                                
            }
        }
        this.selectedFacets = selectedFacets.join("&"); 

        this.url = this.removeURLParameter(this.url, 'rows') + '&rows=' + this.rows; 
        this.url = this.removeURLParameter(this.url, 'os') + '&os=0';
        this.updateProjects();
    }  
    
    public onSort(property: any, sortType: any) {
        this.sortBy = property;
        
		if (this.sortedColumns.indexOf(property) === -1) {
			this.sortedColumns.push(property);
			this.sortType = 'asc';
		} else {
			this.sortedColumns.splice(this.sortedColumns.indexOf(property), 1);
			this.sortType = sortType == 'asc' ? 'desc' : 'asc';
        }

        let modifiedUrl = this.removeURLParameter(this.url, 'srt');
        modifiedUrl = this.removeURLParameter(modifiedUrl, 'order');
        this.url = modifiedUrl + '&srt=' + property + '&order=' + this.sortType; 

        this.updateProjects(); 
    }

    public onRowSize(rows: any) {
        this.rows = rows;
        let modifiedUrl = this.removeURLParameter(this.url, 'rows');
        this.url = modifiedUrl + '&rows=' + this.rows; 
        this.url = this.removeURLParameter(this.url, 'os') + '&os=0';

        this.updateProjects();
    }

    public onSearch() {					
        if (this.searchValue != undefined && this.searchValue.trim() != '') {                     
            if (this.isSeachIn) {
                this.searchInValue = this.searchValue;    
            } else {
                this.qterm = this.searchValue;
                this.queryParameters["qterm"] = this.qterm;     
            }
                        
            this.rows = 20;
            this.sortBy = this.params.SCORE_SORT;            
            this.url = this.removeURLParameter(this.url, 'rows') + '&rows=' + this.rows;
            this.url = this.removeURLParameter(this.url, 'os') + '&os=0';        
            this.url = this.removeURLParameter(this.url, 'srt') + '&srt=' + this.sortBy; 
                        		
            this.updateProjects();
        }
    };
  
    public onSearchIn(isSeachIn: any) {					
        this.isSeachIn = isSeachIn;        
    };

    public onClearAll() {

      this.isClearAll  = true;
      /*
        let parameters = location.search.substring(1); 
        if (parameters.indexOf('qterm=') != -1) 
            this.qterm = this.getParameterByName('qterm', '?' + parameters); 

        this.url = this.documentsApi + '&apilang=' + this.locale + '&qterm=' + this.qterm;
        this.updateProjects();*/

        let displayUrl = window.location.href;
        let displayUrlSplit = displayUrl.split('?');
        
        window.history.pushState('', '', displayUrlSplit[0]);
        location.reload();
       
       
    }

    public updateIsCollapsed(collapse: any) {			
        this.isCollapsed = collapse;
    }

    public updateFacetsCollapsed(facetsCollapsed: any) {    	
    	this.isFacetsCollapsed = facetsCollapsed;
    	this.sideBarArrow = this.sideBarArrow == 'fa fa-angle-left' ? 'fa fa-angle-right' : 'fa fa-angle-left';		
    }

    public getShowingDetails(page, total, qterm) {                      
        let showingFrom = page == 1 ? 1 : ((page - 1) * this.rows) + 1;
        let showingTo = page * this.rows > total ? total : page * this.rows;

        showingFrom = this.toCurrency(showingFrom);	
        showingTo = this.toCurrency(showingTo);	
        total = this.toCurrency(Number(total));		
        qterm = qterm == undefined || qterm == null ? '' : qterm;						
        
        if (this.locale == 'en') {
            this.showingDetails = 'Showing ' + showingFrom + ' - '+ showingTo + ' of ' + total + ' results';   
        } else if (this.locale == 'es') {
            this.showingDetails = 'Mostrar ' + showingFrom + ' - '+ showingTo + ' de ' + total + ' resultados';   
        } else if (this.locale == 'fr') {
            this.showingDetails = 'Affiche ' + showingFrom + ' - '+ showingTo + ' sur ' + total + ' résultats';
        } else if (this.locale == 'pt') {
            this.showingDetails = 'Mostrando ' + showingFrom + ' - '+ showingTo + ' de ' + total + ' resultados';
        } else if (this.locale == 'ru') {
            this.showingDetails = 'Показывает ' + showingFrom + ' - '+ showingTo + ' из ' + total + ' результаты';
        } else if (this.locale == 'ar') {            
            this.showingDetails = ' إظهار ' + showingFrom + ' - ' + showingTo + '	خاصة بـ ' + total + ' نتيجة';
        } else if (this.locale == 'zh') {
            this.showingDetails = '显示 ' + showingFrom +' - '+ showingTo + ' / ' + total + ' 显示';
        } else {	
            this.showingDetails = '';
        }            
    }

    public getQueryParams(qs) {
        // qs = qs.split('+').join(' ');
        var params = {},
            tokens: any,
            re = /[?&]?([^=]+)=([^&]*)/g;
    
        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }
    
        return params;
    }

    public getParameterByName(name, url) {	    
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    
    public removeURLParameter(url, parameter) {		
        var prefix = encodeURIComponent(parameter) + '=';
        var pars= url.split(/[&;]/g);
        
        for (var i= pars.length; i-- > 0;) {    
          if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
            pars.splice(i, 1);
          }
        }
        return pars.join('&');					
    }

    public convertCurrency(currency) {        
        if (currency !== undefined) {
            if (currency.indexOf(',') === -1) {
                return (Math.abs(Number(currency)) / 1.0e+6).toFixed(2);
            } else {
                currency = currency.replace(/\,/g,'');
                return (Math.abs(Number(currency)) / 1.0e+6).toFixed(2);
            }   
        }                                       
    }

    public toCurrency(n) {
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    public replaceAll(str, find, replace) {
    	return str.replace(new RegExp(find, 'g'), replace);
    }
    
    public concateObjectStrings(values, key) {
        let data = '';
        Object.keys(values).forEach((value) => {               
            if (values[value].hasOwnProperty(key)) {
                data = data == '' ? values[value][key] : data + ', ' + values[value][key]
            }
        });
        return data;
    }

    public onDocumentCheck(key) {
        let document = this.documents[key];
        if (document != undefined) {
            if (this.selectedDoucuments.hasOwnProperty('k_' + key)) {
                delete this.selectedDoucuments['k_' + key];
            } else {
                this.selectedDoucuments['k_' + key] = document;
            }
        }
    }
    
    public onDownloadExcel() {           
        this.updatedLoader.emit(true);
        if (Object.keys(this.selectedDoucuments).length > 0) {            
            this.downloadData(this.selectedDoucuments);
        } else {
            let url = this.removeURLParameter(this.documentsApi, 'fct');
            url = this.removeURLParameter(url, 'rows') + '&rows=500&apilang=' + this.locale;
            
            let queryArr = [];
            for (const key in this.queryParameters) {
                if (this.queryParameters.hasOwnProperty(key)) {                      
                    if (url.indexOf(key + "=") !== -1) {                    
                        url = this.removeURLParameter(url, key);                   
                    }
                    queryArr.push(key + "=" + this.queryParameters[key]);
                }
            }        
            
            if (queryArr.length > 0) {
                url += "&" + queryArr.join("&");
            }
            
            // if (this.qterm != undefined && this.qterm != '') {
            //     url = url + '&qterm=' + this.qterm;
            // }
            this.dataService.getResponse(url, null).subscribe((response)=> {             
                delete response["documents"].facets;
                this.downloadData(response["documents"]);
            });
        }
    }

    public downloadData(documents: any) {        
        let documentsExcel: any[] = [], documentLinks: any[] = [], guids: any[] = [];
        
        Object.keys(documents).forEach((document) => { 
            let doc = documents[document];           
            guids.push({ "guid" : doc.guid});
        });
        if (guids.length > 0) {            
            this.dataService.getResponse("https://pubdocdata.worldbank.org/PubDataSourceAPI/multidownload-stats", JSON.stringify({"stats": guids})).subscribe((response)=> {             
                let counts = response;

                Object.keys(documents).forEach((document) => {  
                    let doc = documents[document];           
                    let domain = this.runmode == "publish" ? "" : window.location.origin + "/";
                    documentLinks.push(domain + this.documentsPath + this.urlPipe.transform(doc[this.params.URL], this.runmode));
                    
                    documentsExcel.push({
                        [this.i18nService[this.params.DISPLAY_TITLE]]: doc[this.params.DISPLAY_TITLE] == undefined ? "" : (this.filter.transform(doc[this.params.DISPLAY_TITLE])).replace(/<em>/g, "").replace(/<\/em>/g, ""),                
                        [this.i18nService[this.params.DOCUMENT_DATE]]: doc[this.params.DOCUMENT_DATE] == undefined ? "" : this.date.transform(doc[this.params.DOCUMENT_DATE], this.locale),
                        [this.i18nService[this.params.REPORT_NUMNER]]: this.emptyCheck(doc, this.params.REPORT_NUMNER),
                        [this.i18nService[this.params.DOCUMENT_TYPE]]: this.emptyCheck(doc, this.params.DOCUMENT_TYPE),
                        [this.i18nService[this.params.AUTHORS]]: doc[this.params.AUTHORS] == undefined ? "" : this.filter.transform(doc[this.params.AUTHORS]),   
                        [this.i18nService[this.params.SERIES_NAME]]: this.emptyCheck(doc, this.params.SERIES_NAME),   
                        [this.i18nService[this.params.COUNTRY]]: this.emptyCheck(this.emptyCheck(doc, this.params.COUNTRY), this.params.COUNTRY),
                        [this.i18nService[this.params.CREDIT_NO]]: this.emptyCheck(doc, this.params.CREDIT_NO),
                        [this.i18nService[this.params.DISCLOSURE_DATE]]: doc[this.params.DISCLOSURE_DATE] == undefined ? "" : this.date.transform(doc[this.params.DISCLOSURE_DATE], this.locale),
                        [this.i18nService[this.params.DISCLOSURE_STATUS]]: this.emptyCheck(doc, this.params.DISCLOSURE_STATUS),
                        [this.i18nService[this.params.DISCLOSURE_TYPE]]: this.emptyCheck(doc, this.params.DISCLOSURE_TYPE),
                        [this.i18nService[this.params.ENVIRONMENTAL_CATEGORY]]: this.emptyCheck(doc, this.params.ENVIRONMENTAL_CATEGORY),
                        [this.i18nService[this.params.DIGITAL_OBJECT_IDENTIFIER]]: this.emptyCheck(doc, this.params.DIGITAL_OBJECT_IDENTIFIER),
                        [this.i18nService[this.params.ISSN_NUMBER]]: this.emptyCheck(doc, this.params.ISSN_NUMBER),
                        [this.i18nService[this.params.DOWNLOAD_STATUS]]: this.getCount(counts, doc.guid),
                        [this.i18nService[this.params.ISBN]]: this.emptyCheck(doc, this.params.ISBN),
                        [this.i18nService[this.params.LANGUAGE]]: this.emptyCheck(doc, this.params.LANGUAGE),
                        [this.i18nService[this.params.LOAN_NO]]: this.emptyCheck(doc, this.params.LOAN_NO),
                        [this.i18nService[this.params.MAJOR_SECTOR]]: doc[this.params.MAJOR_SECTOR] == undefined ? "" : this.concateObjectStrings(doc[this.params.MAJOR_SECTOR], 'sector'),
                        [this.i18nService[this.params.REL_PROJECT_ID]]: this.emptyCheck(doc, this.params.REL_PROJECT_ID),
                        [this.i18nService[this.params.REGION]]: this.emptyCheck(this.emptyCheck(doc, this.params.REGION), this.params.REGION),
                        [this.i18nService[this.params.REPORT_TITLE]]: this.emptyCheck(this.emptyCheck(doc, this.params.REPORT_TITLE), this.params.REPORT_TITLE),
                        [this.i18nService[this.params.SECTOR]]: this.emptyCheck(this.emptyCheck(doc, this.params.SECTOR), this.params.SECTOR),
                        [this.i18nService[this.params.SOURCE_CITATION]]: this.emptyCheck(doc, this.params.SOURCE_CITATION),
                        [this.i18nService[this.params.TOPICS]]: this.emptyCheck(doc, this.params.TOPICS),
                        [this.i18nService[this.params.HISTORIC_SUB_TOPICS]]: this.emptyCheck(doc, this.params.HISTORIC_SUB_TOPICS),
                        [this.i18nService[this.params.HISTORIC_TOPICS]]: this.emptyCheck(doc, this.params.HISTORIC_TOPICS),
                        [this.i18nService[this.params.THEME]]: this.emptyCheck(doc, this.params.THEME),
                        [this.i18nService[this.params.TRUSTFUND_NO]]: this.emptyCheck(doc, this.params.TRUSTFUND_NO),
                        [this.i18nService[this.params.UNIT_OWNER]]: this.emptyCheck(doc, this.params.UNIT_OWNER),
                        [this.i18nService[this.params.REGISTRATION_NO]]: this.emptyCheck(doc, this.params.REGISTRATION_NO),
                        [this.i18nService[this.params.VIRTUAL_COLLECTION]]: this.emptyCheck(doc, this.params.VIRTUAL_COLLECTION),
                        [this.i18nService[this.params.VOLUME_NO]]: this.emptyCheck(doc, this.params.VOLUME_NO),
                        [this.i18nService[this.params.TOTAL_VOLUME]]: this.emptyCheck(doc, this.params.TOTAL_VOLUME),
                        [this.i18nService[this.params.VERSION_TYPE]]: this.emptyCheck(doc, this.params.VERSION_TYPE)
                    });
                }); 
                this.excelService.exportAsExcelFile(documentsExcel, documentLinks, 'Results Data', 'Results Data');        
                this.updatedLoader.emit(false);
            });
        }
    }

    public getCount(val: any, guid: any) {
        let countObj = val["stats"].find((x: any) => x.guid == guid);
        return countObj.count;
    }

    public emptyCheck(object, property) {
        return object[property] == undefined ? "" : object[property];
    }
}
