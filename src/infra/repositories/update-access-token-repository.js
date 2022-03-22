const { MissingParamError } = require("../../utils/errors");
const MongoHelper = require("../helper/mongo-helper");

module.exports = class UpdateAccessTokenRepository {
  async update(userId, accessToken) {
    if (!userId) {
      throw new MissingParamError("userId");
    }
    if (!accessToken) {
      throw new MissingParamError("accessToken");
    }
    const userModel = await MongoHelper.getCollections("users");
    const user = await userModel.updateOne(
      { _id: userId },
      {
        $set: {
          accessToken,
        },
      }
    );
    return user;
  }
};
