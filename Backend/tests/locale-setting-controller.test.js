
const mongoose = require('mongoose');
const localeSettingController = require('../src/controllers/localeSetting.controller');


describe('get locale setting test cases =>', () => {



  it('should get locale setting obj', async () => {
    let req = {};
    let getSettings = jest.fn().mockReturnValue([{}]);
    localeSettingController.getSettings = (req) => {
      getSettings();
    }
    const result = localeSettingController.getSettings(req);
    expect(getSettings).toHaveBeenCalled();
  });
});


describe('update locale setting test cases =>', () => {

  it('should update locale setting Obj', () => {
    let req = { body: {} };

    let updateSettings = jest.fn().mockReturnValue({});
    localeSettingController.updateSettings = (req) => {
      updateSettings();
      return;
    };
    const result = localeSettingController.updateSettings(req);
    expect(updateSettings).toHaveBeenCalled()
  });
});

describe('save locale settings test cases =>', () => {

  it('should create locale test cases', async () => {
    let req = { body: {} };


    let createSettings = jest.fn().mockReturnValue({ _id: "123456", ...req.body });
    localeSettingController.createSettings = (req) => {
      createSettings();
      return;
    }
    const result = localeSettingController.createSettings(req, {});
    expect(createSettings).toHaveBeenCalled();
  });
});


afterAll(async () => {
  await mongoose.disconnect();
});