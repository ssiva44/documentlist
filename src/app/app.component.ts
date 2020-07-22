import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'documents-list',
  templateUrl: './app.component.html'  
})
export class AppComponent {  
  loading: boolean;
  imagePath: string;
  locale: string;
  documentsApi: string;  
  documentsPath: string;  
  advancedSearchPath: string;
  runmode: string;
  nodataLink: string;

  constructor(private element: ElementRef) {    
    this.loading = true;
    this.imagePath = this.element.nativeElement.getAttribute('imagePath'); 
    this.locale = this.element.nativeElement.getAttribute('locale');
    this.documentsApi = this.element.nativeElement.getAttribute('documents-list-api');    
    this.documentsPath = this.element.nativeElement.getAttribute('documents-list-path');    
    this.advancedSearchPath = this.element.nativeElement.getAttribute('advanced-search-path');    
    this.runmode = this.element.nativeElement.getAttribute('runmode');    
    this.nodataLink = this.element.nativeElement.getAttribute('nodataLink');    
  }

  public updateLoader(loading) {
    this.loading = loading;
  }    
}
