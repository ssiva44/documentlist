import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'limit' }) 
export class LimitPipe implements PipeTransform { 
	transform(value: any, limit: any): string {					
		let strings = value.split(' ');
		strings = strings.filter(function(entry) { return entry.trim() != ''; });			

		let content = '';		
		for(let i=0; i < strings.length; i++) {			
			if (content.length < limit) {
				if (content == '') {
					content = strings[i];
				} else {
					content = content + ' ' + strings[i];
				}							
			} else {
				content = content.slice(-1) == ',' || content.slice(-1) == '.' ? content.slice(0, -1) + '...' : content + '...';				
				break;
			}		
		}		
		return content;
	} 
}