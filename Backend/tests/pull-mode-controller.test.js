
// const { app } = require("../src/app")
// const supertest = require("supertest");
// const pullModeListService = require('../../src/services');
const mongoose = require('mongoose');

const pullModeListController = require('../src/controllers/pull-mode-list.controller');



describe('get pull mode list test cases =>', () => {

  it('should get pull mode list by id', () => {
    let req = {
      params: { listID: 1 }
    }

    let getPullModeListByID = jest.fn().mockReturnValue({});
    pullModeListController.getPullModeListByID = (req) => {
      if (req.params.listID) {
        getPullModeListByID();
        return;
      }
    }
    const result = pullModeListController.getPullModeListByID(req);
    expect(getPullModeListByID).toHaveBeenCalled();
  });

  it('should get pull mode lists', async () => {
    let req = {};
    let getPullModeList = jest.fn().mockReturnValue([]);
    pullModeListController.getPullModeLists = (req) => {
      getPullModeList();
    }
    const result = pullModeListController.getPullModeLists(req);
    expect(getPullModeList).toHaveBeenCalled();
  });
});


// describe('delete schema attribute test cases =>', () => {

//     it('should delete schema attribute', () => {
//         let req = {
//             params: {
//                 id: "61c2b22725dadf1a1050c582"
//             },
//             body: {
//                 key: "firstName",
//                 channelTypes: [],
//                 defaultValue: "Jane Doe",
//                 description: "",
//                 isChannelIdentifier: false,
//                 isDeleteAble: false,
//                 isPii: false,
//                 isRequired: true,
//                 label: "First Name",
//                 length: 50,
//                 sortOrder: 1,
//                 type: "string"
//             }
//         };
//         let res = {};


//         let deleteSchema = jest.fn().mockReturnValue({
//             code: "Deleted",
//             msg: "Customer Schema Attribute Deleted Successfully"
//         });
//         schemaController.delete = (req) => {
//             return deleteSchema();

//         }
//         const result = schemaController.delete(req, res);
//         // result.then((res) => {
//         //     console.log("res==>", res);
//         //     expect(res).toMatchObject({ code: "Deleted" });
//         // });
//         // console.log("delete==>", result);
//         expect(deleteSchema).toHaveBeenCalled();
//         // expect(result).toMatchObject({ code: "Deleted" });
//         expect(result).toEqual({
//             code: "Deleted",
//             msg: "Customer Schema Attribute Deleted Successfully"
//         });

//     });
// });

// describe('update schema attribute test cases =>', () => {

//     it('should update schema attribute Obj', () => {
//         let req = {
//             params: {
//                 id: "61c2b22725dadf1a1050c582"
//             },
//             body: {
//                 key: "firstName",
//                 channelTypes: [],
//                 defaultValue: "Jane Doem",
//                 description: "",
//                 isChannelIdentifier: false,
//                 isDeleteAble: false,
//                 isPii: false,
//                 isRequired: true,
//                 label: "First Name",
//                 length: 50,
//                 sortOrder: 1,
//                 type: "string"
//             }
//         };
//         let res = {};


//         let updateSchema = jest.fn().mockReturnValue({
//             _id: "61c2b22725dadf1a1050c582",
//             key: "firstName",
//             channelTypes: [],
//             defaultValue: "Jane Doem",
//             description: "",
//             isChannelIdentifier: false,
//             isDeleteAble: false,
//             isPii: false,
//             isRequired: true,
//             label: "First Name",
//             length: 50,
//             sortOrder: 1,
//             type: "string"
//         });

//         schemaController.update = (req) => {
//             return updateSchema();

//         }
//         const result = schemaController.update(req, res);

//         // result.then((res) => {
//         //     console.log("res==>", res);
//         //     expect(res).toMatchObject({ code: "Deleted" });
//         // });
//         // console.log("delete==>", result);

//         expect(updateSchema).toHaveBeenCalled();
//     });
// });

// describe('get attribute type test cases =>', () => {

//     it('should return attribute types list', () => {
//         let req = {};
//         let res = {};

//         let getTypes = jest.fn().mockReturnValue([
//             { "type": "alphaNumeric", "regex": "^$|^[A-Za-z0-9][A-Za-z0-9_-]{0,49}$" },
//             { "type": "boolean", "regex": "^(true|false|1|0)$" }
//         ]);

//         schemaController.getAttributesTypes = (req) => {
//             return getTypes();

//         }
//         const result = schemaController.getAttributesTypes(req, res);

//         // result.then((res) => {
//         //     console.log("res==>", res);
//         //     expect(res).toMatchObject({ code: "Deleted" });
//         // });
//         // console.log("delete==>", result);

//         // expect(updateSchema).toHaveBeenCalled();
//     });
// });
afterAll(async () => {
  await mongoose.disconnect();
});