const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    logger.error(`[BAD_REQUEST] Email already taken`, { className: "user.service", methodName: "createUser", CID: coId });
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.create(userBody);
  logger.info(`Create User`, { className: "user.service", methodName: "createUser" , CID: coId });
  logger.debug(`[DATA] %o` + user,  { className: "user.service", methodName: "createUser", CID: coId });
  return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options,coId) => {
  const users = await User.paginate(filter, options);
  logger.info(`Query Users`, { className: "user.service", methodName: "queryUsers" , CID: coId });
  logger.debug(`[DATA] %o` + users,  { className: "user.service", methodName: "queryUsers", CID: coId });
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id,coId) => {
  logger.info(`Get User by Id`, { className: "user.service", methodName: "getUserById" , CID: coId });
  logger.debug(`[DATA] %o` + id,  { className: "user.service", methodName: "getUserById", CID: coId });
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email,coId) => {
  logger.info(`Get User by Email`, { className: "user.service", methodName: "getUserByEmail" , CID: coId });
  logger.debug(`[DATA] %o` + email,  { className: "user.service", methodName: "getUserByEmail", CID: coId });
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody,coId) => {
  const user = await getUserById(userId);
  if (!user) {
    logger.error(`[NOT FOUND] User not found`, { className: "amqSetting.service", methodName: "updateSettings", CID: coId });
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    logger.error(`[BAD REQUEST] Email already taken`, { className: "amqSetting.service", methodName: "updateSettings", CID: coId });
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  logger.info(`User Updated by Id`, { className: "user.service", methodName: "updateUserById" , CID: coId });
  logger.debug(`[DATA] %o` + user,  { className: "user.service", methodName: "updateUserById", CID: coId });
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId,coId) => {
  const user = await getUserById(userId);
  if (!user) {
    logger.error(`[NOT FOUND] User not found`, { className: "user.service", methodName: "deleteUserById", CID: coId });
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  logger.info(`User Deleted by Id`, { className: "user.service", methodName: "deleteUserById" , CID: coId });
  logger.debug(`[DATA] %o` + user,  { className: "user.service", methodName: "deleteUserById", CID: coId });
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
