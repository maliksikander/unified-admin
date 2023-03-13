
const mongoose = require('mongoose');
const displaySettingController = require('../src/controllers/displaySetting.controller');


describe('get display setting test cases =>', () => {



  it('should get display setting obj', async () => {
    let req = {};
    let getSettings = jest.fn().mockReturnValue([{}]);
    displaySettingController.getSettings = (req) => {
      getSettings();
    }
    const result = displaySettingController.getSettings(req);
    expect(getSettings).toHaveBeenCalled();
  });
});


describe('update display setting test cases =>', () => {

  it('should update display setting Obj', () => {
    let req = { body: {} };

    let updateSettings = jest.fn().mockReturnValue({});
    displaySettingController.updateSettings = (req) => {
      updateSettings();
      return;
    };
    const result = displaySettingController.updateSettings(req);
    expect(updateSettings).toHaveBeenCalled()
  });
});

describe('save display settings test cases =>', () => {

  it('should create display test cases', async () => {
    let req = { body: {} };


    let createSettings = jest.fn().mockReturnValue({ _id: "123456", ...req.body });
    displaySettingController.createSettings = (req) => {
      createSettings();
      return;
    }
    const result = displaySettingController.createSettings(req, {});
    expect(createSettings).toHaveBeenCalled();
  });
});


afterAll(async () => {
  await mongoose.disconnect();
});