var query_string = "";
       
function documentsAnalyticParams(parameters, sterm, sresults, sortby, pagination) {
    console.log('analyticParams');    
    var queryParamValue = "";
    var queryParamName = "";
    var filters = [], section=[], sFilters="",sSection="";
    var paramMap = {
        'projectfinancialtype_exact': 'finance',
        'regionname_exact':'region',
        'countryshortname_exact':'country',
        'sector_exact':'sector',
        'status_exact':'status',
        'theme_exact':'theme',
        'strdate':'startdate',
        'enddate':'enddate',
        'lang_exact':'language',
        'tf':'timeframe',  
        'project_name':'name',
        'countryshortname':'country',
        'id':'id',        
        'totalcommamt_srt':'amount',
        'status':'status',
        'boardapprovaldate':'date'
    };   

    parameters = parameters.charAt(0) == '&' ? parameters.slice(1) : parameters;
    
    var queryPair = parameters.split('&');
    for (var i = 0; i < queryPair.length; i++) {
        queryParamName = queryPair[i].split('=')[0];
        queryParamValue = queryPair[i].split('=')[1];        
        
        if((typeof paramMap[queryParamName]!='undefined')){
            section.push(paramMap[queryParamName]);
        }
        
        if((queryParamName!='qterm')){
            if(queryParamValue != ''){
                filters.push(queryParamValue);
            }
        }
    }
    
    sSection = section.join(':');
    sFilters = filters.join(':');

    sSection = decodeURIComponent(sSection);
    sSection = sSection.replace(new RegExp("\\+","g"),' ');
    
    sFilters = decodeURIComponent(sFilters);
    sFilters = sFilters.replace(new RegExp("\\+","g"),' ');

    wbgData.siteSearch.pagination = pagination;
    wbgData.siteSearch.searchFilters = sFilters;
    wbgData.siteSearch.section = sSection;
    wbgData.siteSearch.searchTerm = sterm;
    wbgData.siteSearch.searchResults = sresults;
    wbgData.siteSearch.sortBy = sortby;    
}