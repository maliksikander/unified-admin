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

        return list.filter(list =>
            list.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
    }
}
