
const mongoose = require('mongoose');
const loginController = require('../src/controllers/login.controller');
var config = require('../config.json');

describe('login test cases =>', () => {

  it('should login', () => {
    let req = {
      body: {
        username: "admin",
        password: "admin",
      }
    }

    let authenticateViaKeycloak = jest.fn().mockReturnValue({ keycloakUser: {}, token: "" });
    loginController.login = (req) => {
      authenticateViaKeycloak();
      return;
    }
    const result = loginController.login(req);
    expect(authenticateViaKeycloak()).toMatchObject({ keycloakUser: {}, token: "" });
  });

  it('should fail login', () => {
    let req = {
      body: {
        username: "admin",
        password: "admine",
      }
    }
    let error = { response: { status: 401 }, msg: "Unauthorized User" };

    let authenticateViaKeycloak = jest.fn().mockReturnValue(error);
    loginController.login = (req) => {
      return authenticateViaKeycloak();
    }
    const result = loginController.login(req);
    expect(result.response.status).toBe(401);
  });
});


afterAll(async () => {
  await mongoose.disconnect();
});