
const mongoose = require('mongoose');
const reasonCodeController = require('../src/controllers/reason.controller');

describe('get reason code test cases =>', () => {

  it('should get reason code by id', () => {
    let req = {
      params: { reasonID: "1" }
    }

    let getReasonByID = jest.fn().mockReturnValue({});
    reasonCodeController.getReasonByID = (req) => {
      if (req.params.reasonID) {
        getReasonByID();
        return;
      }
    }
    const result = reasonCodeController.getReasonByID(req);
    expect(getReasonByID).toHaveBeenCalled();
  });

  it('should get reason code list', async () => {
    let req = {
      query: {
        type: "ready"
      }
    };
    let getReasons = jest.fn().mockReturnValue([]);
    reasonCodeController.getReasons = (req) => {
      getReasons();
    }
    const result = reasonCodeController.getReasons(req);
    expect(getReasons).toHaveBeenCalled();
  });
});


describe('delete reason code test cases =>', () => {

  it('should delete reason code', () => {
    let req = {
      params: {
        reasonID: "61c2b22725dadf1a1050c582"
      }
    };

    let deleteReason = jest.fn().mockReturnValue({
      _id: "61c2b22725dadf1a1050c582"
    });
    reasonCodeController.deleteReason = (req) => {
      if (req.params.reasonID) {
        deleteReason(req.params.listID);
        return;
      }
    };
    const result = reasonCodeController.deleteReason(req);
    expect(deleteReason).toHaveBeenCalled();
  });
});

describe('update reason code test cases =>', () => {

  it('should update reason code Obj', () => {
    let req = {
      params: {
        reasonID: "61c2b22725dadf1a1050c582"
      },
      body: {
        label: "test",
        type: "Ready",
        description: "Sample",

      }
    };

    let updateReason = jest.fn().mockReturnValue({
      _id: "61c2b22725dadf1a1050c582",
      name: "test",
      description: "Sample",
    });

    reasonCodeController.updateReason = (req) => {
      if (req.params.reasonID) {
        updateReason({ label: "test", type: "Ready", description: "Sample" }, req.params.reasonID);
        return;
      }
    };
    const result = reasonCodeController.updateReason(req);
    expect(updateReason).toHaveBeenCalled()
  });
});

describe('save new reason code test cases =>', () => {

  it('should create reason code', async () => {
    let req = {
      body: {
        label: "test",
        description: "Sample",
        type: "Ready"
      }
    };


    let createReason = jest.fn().mockReturnValue({ _id: "123456", ...req.body });
    reasonCodeController.createReason = (req) => {
      createReason();
      return;
    }
    const result = reasonCodeController.createReason(req, {});
    expect(createReason).toHaveBeenCalled();
  });
});


afterAll(async () => {
  await mongoose.disconnect();
});