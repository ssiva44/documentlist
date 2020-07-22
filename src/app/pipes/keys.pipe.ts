import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    let keys = [];    
    Object.keys(value).sort().reverse().forEach(function(key) {
      keys.push(key);
    });
    return keys;
  }
}