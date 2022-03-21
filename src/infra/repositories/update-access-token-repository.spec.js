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
    // if (!email) {
    //   throw new MissingParamError("email");
    // }
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

  // test("Should throw if no email is provided", async () => {
  //   const { sut } = makeSut();
  //   const promise = sut.load();
  //   expect(promise).rejects.toThrow(new MissingParamError("email"));
  // });
});
