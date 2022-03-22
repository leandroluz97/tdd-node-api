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
    const db = await MongoHelper.getDb();
    const user = await db.collections("users").updateOne(
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
