import { PipeTransform, Pipe } from '@angular/core';
@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
  transform(list: any, searchTerm: string): any {
    if (!list || !searchTerm) {
      return list;
    }

    if (list.length > 0 && list[0].name) {
      return list.filter(list =>
        list.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
    }
    else if (list.length > 0 && list[0].Name) {
      return list.filter(list =>
        list.Name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
    }

    else if (list.length > 0 && list[0].firstName) {
      return list.filter(list =>
        list.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
    }
  }
}
