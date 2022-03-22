const { MissingParamError } = require("../../utils/errors");
const MongoHelper = require("../helper/mongo-helper");
const UpdateAccessTokenRepository = require("./update-access-token-repository");
let db;

const makeSut = () => {
  const sut = new UpdateAccessTokenRepository(userModel);
  return sut;
};

describe("UpdatedAccessToken Repository", () => {
  let fakeUserId;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL, "");
    db = await MongoHelper.getDb();
  });

  beforeEach(async () => {
    let userModel = db.collection("users");
    await userModel.deleteMany();
    let fakeUser = await userModel.insertOne({
      email: "valid_email@email.com",
      password: "hashed_password",
    });
    fakeUserId = fakeUser.insertedId;
  });
  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test("Should update user with given accessToken", async () => {
    const sut = makeSut();
    await sut.update(fakeUserId, "valid_token");
    const updatedFakeUser = await db.collection("users").findOne({ _id: fakeUserId });
    expect(updatedFakeUser.accessToken).toBe("valid_token");
  });

  // test("Should throw if no userModel is provided", async () => {
  //   const sut = new UpdateAccessTokenRepository();
  //   const userModel = db.collection("users");
  //   const promise = sut.update(fakeUserId, "valid_token");
  //   expect(promise).rejects.toThrow();
  // });

  test("Should throw if no params are provided", async () => {
    const sut = makeSut();
    expect(sut.update()).rejects.toThrow(new MissingParamError("userId"));
    expect(sut.update(fakeUserId)).rejects.toThrow(new MissingParamError("accessToken"));
  });
});
