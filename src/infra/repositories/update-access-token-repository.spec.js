const { MissingParamError } = require("../../utils/errors");
const MongoHelper = require("../helper/mongo-helper");
const UpdateAccessTokenRepository = require("./update-access-token-repository");
let userModel, fakeUserId;

const makeSut = () => {
  const sut = new UpdateAccessTokenRepository(userModel);
  return sut;
};

describe("UpdatedAccessToken Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL, "");
    userModel = await MongoHelper.getCollection("users");
  });

  beforeEach(async () => {
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
    const updatedFakeUser = await userModel.findOne({ _id: fakeUserId });
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
