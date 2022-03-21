const { MissingParamError } = require("../../utils/errors");
const MongoHelper = require("../helper/mongo-helper");
let db;

const makeSut = () => {
  const userModel = db.collection("users");
  const sut = new UpdateAccessTokenRepository(userModel);
  return {
    sut,
    userModel,
  };
};
class UpdateAccessTokenRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }
  async update(userId, accessToken) {
    if (!userId) {
      throw new MissingParamError("userId");
    }
    if (!accessToken) {
      throw new MissingParamError("accessToken");
    }
    const user = await this.userModel.updateOne(
      { _id: userId },
      {
        $set: {
          accessToken,
        },
      }
    );
    return user;
  }
}

describe("UpdatedAccessToken Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL, "");
    db = await MongoHelper.getDb();
  });

  afterEach(async () => {
    await db.collection("users").deleteMany();
  });
  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test("Should update user with given accessToken", async () => {
    const { sut, userModel } = makeSut();
    const fakeUser = await userModel.insertOne({
      email: "valid_email@email.com",
      password: "hashed_password",
    });
    const user = await sut.update(fakeUser.insertedId, "valid_token");
    const updatedFakeUser = await userModel.findOne({ _id: fakeUser.insertedId });
    expect(updatedFakeUser.accessToken).toBe("valid_token");
  });

  test("Should throw if no userModel is provided", async () => {
    const sut = new UpdateAccessTokenRepository();
    const userModel = db.collection("users");
    const fakeUser = await userModel.insertOne({
      email: "valid_email@email.com",
      password: "hashed_password",
    });
    const promise = sut.update(fakeUser.insertedId, "valid_token");
    expect(promise).rejects.toThrow();
  });

  test("Should throw if no params are provided", async () => {
    const { sut, userModel } = makeSut();
    const fakeUser = await userModel.insertOne({
      email: "valid_email@email.com",
      password: "hashed_password",
    });
    expect(sut.update()).rejects.toThrow(new MissingParamError("userId"));
    expect(sut.update(fakeUser.insertedId)).rejects.toThrow(new MissingParamError("accessToken"));
  });
});
