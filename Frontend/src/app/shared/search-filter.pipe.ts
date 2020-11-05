import { PipeTransform, Pipe } from '@angular/core';
// import { Employee } from '../models/employee.model';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
  transform(list: any, searchTerm: string): any {
    if (!list || !searchTerm) {
      // console.log("list-->",list)
      return list;
    }

    if (list.length > 0 && list[0].name) {
      // console.log("list 2-->",list)
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
