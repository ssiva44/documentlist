import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MyDatePickerModule } from './my-date-picker/my-date-picker.module';
import { NgModule } from '@angular/core';

import { 
  AppComponent,  
  TimeframeComponent, 
  DateComponent, 
  FacetsComponent, 
  MobileFacetsComponent,  
  DocumentsComponent   
} from "./index";

import { 
  KeysPipe, 
  DateFormatPipe, 
  ObjectsLengthPipe, 
  ContainsPipe, 
  FacetContainsPipe, 
  FacetAnimationPipe, 
  FacetCheckedPipe, 
  LimitPipe, 
  MobileFacetContainsPipe, 
  I18NPipe,
  FilterPipe,
  ObjectContainsPipe,
  UrlPipe,
  ArrayToStringPipe  
} from "./pipes/index";

@NgModule({
  declarations: [   
    AppComponent,   
    TimeframeComponent, 
    DateComponent,
    FacetsComponent, 
    MobileFacetsComponent,     
    DocumentsComponent, 
    KeysPipe, 
		DateFormatPipe, 
		ObjectsLengthPipe, 
		ContainsPipe, 
		FacetContainsPipe,
    FacetAnimationPipe,
    FacetCheckedPipe,
		LimitPipe,
    MobileFacetContainsPipe,
    I18NPipe,
    FilterPipe,
    ObjectContainsPipe,
    UrlPipe,
    ArrayToStringPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MyDatePickerModule
  ],  
  bootstrap: [AppComponent]
})
export class AppModule { }
