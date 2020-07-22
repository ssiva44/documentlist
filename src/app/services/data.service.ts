import { Injectable } from '@angular/core';  
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

@Injectable()
export class DataService {  	
	constructor(public http: HttpClient) { }
	
	getResponse(url: string, data: any) {	
		if (data == null) {
			return this.http.post<any>(url, data);
		} else {
			const headers = { 'Content-Type': 'application/json' }
			return this.http.post<any>(url, data, { headers });
		}
		// return this.http.post(url,'');
		//return this.http.post(url, '').map((response: Response) => response.json());				
	}	
} 	