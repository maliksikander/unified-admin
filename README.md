#### Form Data Object Sample

### Sample Function for Attribute List

 <!-- `formSchema` is the form schema object -->
 <!-- `array2` is the filled form attribute list -->

function createFormdata(formSchema,array2) {
let data;
data.formID = formSchema.id; // form schema id
data.filledBy = "user"; // the user name
data.createdOn = new Date().toISOString(); // current data converted to UTC

let attrTemp = []; // temp array variable
let array1 = formSchema.attributes;

    array1.attributes.forEach((schemaAttr) => {
      let obj: any = {};
      array2.forEach((filledAttr) => {
        let key = Object.keys(filledAttr)[0];
        if (key == schemaAttr.key) {
          obj.key = key;
          obj.type = schemaAttr.valueType;
          obj.value = Object.values(filledAttr)[0];
          attrTemp.push(obj);
        }
      });
    });

    data.attributes = attrTemp;
    return data;

}

#### Output

{

attributes: [{key: "key1", type: "String2000", value: "value1"},{key: "key2", type: "String100", value: "value2"}],
createdOn: "2021-07-02T09:19:32.880Z",
filledBy: "user",
formID: "60d75a0dce0c11421571881d",
}

#########################
