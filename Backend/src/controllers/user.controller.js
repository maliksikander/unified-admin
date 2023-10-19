const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
var config = require('../../config.json');
var { NodeAdapter } = require("ef-keycloak-connect");
const keycloak = new NodeAdapter(config);
const logger = require('../config/logger');
// const { userService } = require('../services');

// const createUser = catchAsync(async (req, res) => {
//   const user = await userService.createUser(req.body);
//   res.status(httpStatus.CREATED).send(user);
// });

// const getUsers = catchAsync(async (req, res) => {
//   const filter = pick(req.query, ['name', 'role']);
//   const options = pick(req.query, ['sortBy', 'limit', 'page']);
//   const result = await userService.queryUsers(filter, options);
//   res.send(result);
// });

// const getUser = catchAsync(async (req, res) => {
//   const user = await userService.getUserById(req.params.userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   res.send(user);
// });

// const updateUser = catchAsync(async (req, res) => {
//   const user = await userService.updateUserById(req.params.userId, req.body);
//   res.send(user);
// });

// const deleteUser = catchAsync(async (req, res) => {
//   await userService.deleteUserById(req.params.userId);
//   res.status(httpStatus.NO_CONTENT).send();
// });

const getUsers = catchAsync(async (req, res) => {
  const temp = req.query;
  let role = [];
  if (temp.roles) { role = temp.roles };
  keycloak.getUsersByRole(role).then((result) => {
    logger.info(`Get keycloak users by role`, { className: "user.controller", methodName: "getUsers" });
    logger.debug(`[REQUEST] : %o` + result, { className: "user.controller", methodName: "getUsers" });
    res.send(result);

  }).catch((err) => {

    logger.error(`[ERROR] on get user %o` + err, { className: "user.controller", methodName: "getUsers"});
    let errorResponse = {
      error_message: e.error_message,
      error_detail: {
        status: e.error_detail.status,
        reason: e.error_detail.reason,
      }
    };
  
    res.status(errorResponse.error_detail.status);
    res.json(errorResponse);
  });
});


module.exports = {
  // createUser,
  getUsers,
  // getUser,
  // updateUser,
  // deleteUser,
};
