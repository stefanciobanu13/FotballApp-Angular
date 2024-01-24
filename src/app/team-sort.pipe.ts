import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'teamSort',
})
export class TeamSortPipe implements PipeTransform {
  transform(array: any[], comparator: (a: any, b: any) => number): any[] {
    console.log('inside the pipe');

    if (!Array.isArray(array) || !comparator) {
      return array;
    }
    return array.slice().sort(comparator);
  }
}
