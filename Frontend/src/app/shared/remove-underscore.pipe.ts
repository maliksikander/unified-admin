import { PipeTransform, Pipe } from "@angular/core";
@Pipe({
  name: "removeUnderscoreFilter",
})
export class RemoveUnderscoreFilterPipe implements PipeTransform {
  transform(list: any): any {
    if (!list) {
      return list;
    } else if (list.length > 0) {
      return list.replace("_", " ");
    }
  }
}
