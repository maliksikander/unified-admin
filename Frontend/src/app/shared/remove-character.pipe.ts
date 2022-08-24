import { PipeTransform, Pipe } from "@angular/core";
@Pipe({
  name: "removeCharacterFilter",
})
export class RemoveCharacterFilterPipe implements PipeTransform {
  transform(value: String): any {
    if (!value) {
      return value;
    } else {
      if (value?.length > 0 && value?.includes("_")) {
        // return value.replace("_", " ");
        return value.replace(/[_]/g, " ");
      } else if (value.length > 0 && value?.includes("-")) {
        return value.replace(/[-]/g, " ");
      }
      else if (value.length > 0 && value == "LOGOUT") {
        return "LOG OUT";
      }
    }
  }
}
