const { MissingParamError } = require("../../utils/errors");
const MongoHelper = require("../helper/mongo-helper");
const LoadUserByEmailRepository = require("./load-user-by-email-repository");

let userModel;
const makeSut = () => {
  const sut = new LoadUserByEmailRepository();

  return sut;
};

describe("LoadUserByEmail Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL, "");
    userModel = await MongoHelper.getCollection("users");
  });

  afterEach(async () => {
    await userModel.deleteMany();
  });
  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test("Should return null if no user is found", async () => {
    const sut = makeSut();
    const user = await sut.load("invalid_email@email.com");
    expect(user).toBeNull();
  });

  test("Should return an user if user is found", async () => {
    const sut = makeSut();
    const fakeUser = await userModel.insertOne({
      email: "valid_email@email.com",
      password: "hashed_password",
    });
    const user = await sut.load("valid_email@email.com");
    expect(user.email).toEqual("valid_email@email.com");
  });

  // test("Should throw if no userModel is provided", async () => {
  //   const sut = new LoadUserByEmailRepository();
  //   const promise = sut.load("any_email@email.com");
  //   expect(promise).rejects.toThrow();
  // });

  test("Should throw if no email is provided", async () => {
    const sut = makeSut();
    const promise = sut.load();
    expect(promise).rejects.toThrow(new MissingParamError("email"));
  });
});
