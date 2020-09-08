import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

  transform(value: number): string {
    let stringValue = value.toString();
    let newStringValue = '0'+stringValue;
    return (stringValue.length > 1) ? stringValue : newStringValue;
  }

}
