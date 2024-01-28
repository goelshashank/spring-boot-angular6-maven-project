import { Pipe, PipeTransform } from '@angular/core';
import {Ingredient} from "../model/Ingredient";

@Pipe({
  name: 'sortByOrder'
})
export class SortByOrderPipe implements PipeTransform {

  transform(array: any[], args: string): any[] {
    const prop = args;
    const isReverse = args === null;
    array.sort((a, b) => {
      const first = a[prop];
      const second = b[prop];
      return isReverse ? second.localeCompare(first) : first.localeCompare(second);
    });

    return array;
  }




}
