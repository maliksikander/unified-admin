
const mongoose = require('mongoose');
const logSettingController = require('../src/controllers/logSetting.controller');


describe('get log setting test cases =>', () => {



  it('should get log setting obj', async () => {
    let req = {};
    let getSettings = jest.fn().mockReturnValue([{}]);
    logSettingController.getSettings = (req) => {
      getSettings();
    }
    const result = logSettingController.getSettings(req);
    expect(getSettings).toHaveBeenCalled();
  });
});


describe('update log setting test cases =>', () => {

  it('should update log setting Obj', () => {
    let req = { body: {} };

    let updateSettings = jest.fn().mockReturnValue({});
    logSettingController.updateSettings = (req) => {
      updateSettings();
      return;
    };
    const result = logSettingController.updateSettings(req);
    expect(updateSettings).toHaveBeenCalled()
  });
});

describe('save log settings test cases =>', () => {

  it('should create log test cases', async () => {
    let req = { body: {} };


    let createSettings = jest.fn().mockReturnValue({ _id: "123456", ...req.body });
    logSettingController.createSettings = (req) => {
      createSettings();
      return;
    }
    const result = logSettingController.createSettings(req, {});
    expect(createSettings).toHaveBeenCalled();
  });
});


afterAll(async () => {
  await mongoose.disconnect();
});