const { MissingParamError } = require("../../utils/errors");
const MongoHelper = require("../helper/mongo-helper");

module.exports = class LoadUserByEmailRepository {
  async load(email) {
    if (!email) {
      throw new MissingParamError("email");
    }
    const db = await MongoHelper.getDb();
    const user = await db.collections("users").findOne(
      { email },
      {
        projection: {
          _id: 1,
          password: 1,
          email: 1,
        },
      }
    );
    return user;
  }
};
