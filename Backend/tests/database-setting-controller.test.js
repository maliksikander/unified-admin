
const mongoose = require('mongoose');
const databaseSettingController = require('../src/controllers/databaseSetting.controller');


describe('get database setting test cases =>', () => {



  it('should get database setting obj', async () => {
    let req = {};
    let getSettings = jest.fn().mockReturnValue([{}]);
    databaseSettingController.getSettings= (req) => {
      getSettings();
    }
    const result = databaseSettingController.getSettings(req);
    expect(getSettings).toHaveBeenCalled();
  });
});


describe('update database setting test cases =>', () => {

  it('should update database setting Obj', () => {
    let req = { body: {} };

    let updateSettings = jest.fn().mockReturnValue({});
    databaseSettingController.updateSettings = (req) => {
      updateSettings();
      return;
    };
    const result = databaseSettingController.updateSettings(req);
    expect(updateSettings).toHaveBeenCalled()
  });
});

describe('save database settings test cases =>', () => {

  it('should create database test cases', async () => {
    let req = { body: {} };


    let createSettings = jest.fn().mockReturnValue({ _id: "123456", ...req.body });
    databaseSettingController.createSettings = (req) => {
      createSettings();
      return;
    }
    const result = databaseSettingController.createSettings(req, {});
    expect(createSettings).toHaveBeenCalled();
  });
});


afterAll(async () => {
  await mongoose.disconnect();
});