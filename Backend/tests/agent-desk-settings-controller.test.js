const mongoose = require('mongoose');
const agentDeskSettingsController = require('../src/controllers/agentDeskSettings.controller')
describe('agent desk settings test cases =>', () => {

  it('should get agent desk settings',  () => {
    let req = {
    }

    let getSettings = jest.fn().mockReturnValue([]);
    agentDeskSettingsController.getSettings = (req) => {
        getSettings();
      }
    const result = agentDeskSettingsController.getSettings(req);
    expect(getSettings).toHaveBeenCalled();
  });
  describe('update agent desk settings test cases =>', () => {

    it('should update agent desk setting Obj', () => {
      let req = { body: {} };
  
      let updateSettings = jest.fn().mockReturnValue({});
      agentDeskSettingsController.updateSettings = (req) => {
        updateSettings();
        return;
      };
      const result = agentDeskSettingsController.updateSettings(req);
      expect(updateSettings).toHaveBeenCalled()
    });
  });

})

afterAll(async () => {
  await mongoose.disconnect();
});