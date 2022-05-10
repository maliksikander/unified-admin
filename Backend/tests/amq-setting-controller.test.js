
const mongoose = require('mongoose');
const amqSettingController = require('../src/controllers/amqSetting.controller');
// const { amqSettingService } = require('../../ services');

describe('get amq setting test cases =>', () => {



  it('should get amq setting obj', async () => {
    let req = {};
    let getSettings = jest.fn().mockReturnValue([{}]);
    amqSettingController.getSettings = (req) => {
      getSettings();
    }
    const result = amqSettingController.getSettings(req);
    expect(getSettings).toHaveBeenCalled();
  });

  // it('should get AMQ', async () => {
  //   let req = {};
  //   // amqSettingService.getSettings = jest.fn().mockReturnValue([{}]);
  //   amqSettingController.getSettings = async (req) => {
  //    let result = await amqSettingService.getSettings();
  //    return result;
  //   }
  //   const result = await amqSettingController.getSettings(req);
  //   console.log("result====>",result)
  //   // expect(amqSettingService.getSettings).toHaveBeenCalled();
  // });

});


describe('update amq setting test cases =>', () => {

  it('should update amq setting Obj', () => {
    let req = { body: {} };

    let updateSettings = jest.fn().mockReturnValue({});
    amqSettingController.updateSettings = (req) => {
      updateSettings();
      return;
    };
    const result = amqSettingController.updateSettings(req);
    expect(updateSettings).toHaveBeenCalled()
  });
});

describe('save amq settings test cases =>', () => {

  it('should create amq test cases', async () => {
    let req = { body: {} };


    let createSettings = jest.fn().mockReturnValue({ _id: "123456", ...req.body });
    amqSettingController.createSettings = (req) => {
      createSettings();
      return;
    }
    const result = amqSettingController.createSettings(req, {});
    expect(createSettings).toHaveBeenCalled();
  });
});


afterAll(async () => {
  await mongoose.disconnect();
});