const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
var { NodeAdapter } = require("keycloak-nodejs-connect");
const keycloak = new NodeAdapter();
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
    res.send(result);
  }).catch((err) => {
    if (err.message == "Request failed with status code 401") return res.status(401).send(err);
    res.status(500).send(err);
  });
});


module.exports = {
  // createUser,
  getUsers,
  // getUser,
  // updateUser,
  // deleteUser,
};
