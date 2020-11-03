import { PipeTransform, Pipe } from '@angular/core';
// import { Employee } from '../models/employee.model';

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
      // let usersList = JSON.parse(JSON.stringify(list));
      // usersList.forEach((user) => {
      //   user.name = user.firstName + user.lastName; 
      // });

      // let result =  usersList.filter(list =>
      //   list.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
      //   console.log("result -->",result);
      //   result = result.forEach(item => delete item.name);
      // return  result
      return list.filter(list =>
        list.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
    }
  }
}
