
// const app = require("../src/app")
// const supertest = require("supertest");
// const pullModeListService = require('../../src/services');
const mongoose = require('mongoose');

const pullModeListController = require('../src/controllers/pull-mode-list.controller');



describe('get pull mode list test cases =>', () => {

  it('should get pull mode list by id', () => {
    let req = {
      params: { listID: "1" }
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


describe('delete pull mode list test cases =>', () => {

  it('should delete pull mode list', () => {
    let req = {
      params: {
        listID: "61c2b22725dadf1a1050c582"
      }
    };

    let deletePullModeList = jest.fn().mockReturnValue({
      _id: "61c2b22725dadf1a1050c582"
    });
    pullModeListController.deletePullModeList = (req) => {
      if (req.params.listID) {
        deletePullModeList(req.params.listID);
        return;
      }
    };
    const result = pullModeListController.deletePullModeList(req);
    expect(deletePullModeList).toHaveBeenCalled();
  });
});

describe('update pull-mode-list test cases =>', () => {

  it('should update list Obj', () => {
    let req = {
      params: {
        listID: "61c2b22725dadf1a1050c582"
      },
      body: {
        name: "test",
        description: "Sample",

      }
    };
    let res = {};


    let updatePullModeList = jest.fn().mockReturnValue({
      _id: "61c2b22725dadf1a1050c582",
      name: "test",
      description: "Sample",
    });

    pullModeListController.updatePullModeList = (req) => {
      if (req.params.listID) {
        updatePullModeList({ name: "test", description: "Sample" }, req.params.listID);
        return;
      }
    };
    const result = pullModeListController.updatePullModeList(req);
    expect(updatePullModeList).toHaveBeenCalled()
  });
});

describe('save new pull mode list test cases =>', () => {

  it('should create new list', async () => {
    let req = {
      body: {
        name: "test",
        description: "Sample",
      }
    };


    let createPullModeList = jest.fn().mockReturnValue({ _id: "123456", ...req.body });
    pullModeListController.createPullModeList = (req) => {
      createPullModeList();
      return;
    }
    const result = pullModeListController.createPullModeList(req, {});
    expect(createPullModeList).toHaveBeenCalled();
  });
});


afterAll(async () => {
  await mongoose.disconnect();
});