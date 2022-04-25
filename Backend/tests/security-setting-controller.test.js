
const mongoose = require('mongoose');
const securitySettingController = require('../src/controllers/securitySetting.controller');


describe('get security setting test cases =>', () => {



  it('should get security setting obj', async () => {
    let req = {};
    let getSettings = jest.fn().mockReturnValue([{}]);
    securitySettingController.getSettings = (req) => {
      getSettings();
    }
    const result = securitySettingController.getSettings(req);
    expect(getSettings).toHaveBeenCalled();
  });
});


describe('update security setting test cases =>', () => {

  it('should update security setting Obj', () => {
    let req = { body: {} };

    let updateSettings = jest.fn().mockReturnValue({});
    securitySettingController.updateSettings = (req) => {
      updateSettings();
      return;
    };
    const result = securitySettingController.updateSettings(req);
    expect(updateSettings).toHaveBeenCalled()
  });
});

describe('save security settings test cases =>', () => {

  it('should create security test cases', async () => {
    let req = { body: {} };


    let createSettings = jest.fn().mockReturnValue({ _id: "123456", ...req.body });
    securitySettingController.createSettings = (req) => {
      createSettings();
      return;
    }
    const result = securitySettingController.createSettings(req, {});
    expect(createSettings).toHaveBeenCalled();
  });
});


afterAll(async () => {
  await mongoose.disconnect();
});