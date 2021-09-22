import { PipeTransform, Pipe } from "@angular/core";
@Pipe({
  name: "searchFilter",
})
export class SearchFilterPipe implements PipeTransform {
  transform(list: any, searchTerm: string): any {
    if (!list || !searchTerm) {
      return list;
    }

    // console.log("list==>", list);
    // console.log("search==>", searchTerm);

    if (list.length > 0 && list[0].name) {
      return list.filter(
        (list) =>
          list.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
      );
    } else if (list.length > 0 && list[0].Name) {
      return list.filter(
        (list) =>
          list.Name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
      );
    } else if (list.length > 0 && list[0].keycloakUser) {
      return list.filter(
        (list) =>
          list.keycloakUser.userName
            .toLowerCase()
            .indexOf(searchTerm.toLowerCase()) !== -1
      );
    } else if (list.length > 0 && list[0].typeName) {
      return list.filter(
        (list) =>
          list.typeName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
      );
    }

    // else if (list.length > 0 && (list[0].label || list[0].type)) {
    //   console.log("triggered==>", list);
    //   return list.filter(list => {
    //     list.label.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
    //     // list.type.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
    //   });
    // }

    // else if (list.length > 0 && list[0].type) {
    // return list.filter(list =>
    // list.type.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
    // }
    else if (list.length > 0 && list[0].id) {
      return list.filter(
        (list) => list.id.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
      );
    } else if (list.length > 0 && list[0].formTitle) {
      return list.filter(
        (list) =>
          list.formTitle.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
      );
    }
  }
}
