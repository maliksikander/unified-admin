
const mongoose = require('mongoose');
const reportingSettingController = require('../src/controllers/reportSetting.controller');


describe('get reporting setting test cases =>', () => {
  it('should get reporting setting obj', async () => {
    let req = {};
    let getSettings = jest.fn().mockReturnValue([{}]);
    reportingSettingController.getSettings = (req) => {
      getSettings();
    }
    const result = reportingSettingController.getSettings(req);
    expect(getSettings).toHaveBeenCalled();
  });
});


describe('update reporting setting test cases =>', () => {

  it('should update reporting setting Obj', () => {
    let req = { body: {} };

    let updateSettings = jest.fn().mockReturnValue({});
    reportingSettingController.updateSettings = (req) => {
      updateSettings();
      return;
    };
    const result = reportingSettingController.updateSettings(req);
    expect(updateSettings).toHaveBeenCalled()
  });
});

describe('save reporting settings test cases =>', () => {

  it('should create reporting test cases', async () => {
    let req = { body: {} };


    let createSettings = jest.fn().mockReturnValue({ _id: "123456", ...req.body });
    reportingSettingController.createSettings = (req) => {
      createSettings();
      return;
    }
    const result = reportingSettingController.createSettings(req, {});
    expect(createSettings).toHaveBeenCalled();
  });
});


afterAll(async () => {
  await mongoose.disconnect();
});