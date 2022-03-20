const MongoHelper = require("../helper/mongo-helper");
const LoadUserByEmailRepository = require("./load-user-by-email-repository");
let client, db;

const makeSut = () => {
  const userModel = db.collection("users");
  const sut = new LoadUserByEmailRepository(userModel);

  return { sut, userModel };
};

describe("LoadUserByEmail Repository", () => {
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

  test("Should return null if no user is found", async () => {
    const { sut, userModel } = makeSut();
    const user = await sut.load("invalid_email@email.com");
    expect(user).toBeNull();
  });

  test("Should return an user if user is found", async () => {
    const { sut, userModel } = makeSut();
    const fakeUser = await userModel.insertOne({
      email: "valid_email@email.com",
      password: "hashed_password",
    });
    const user = await sut.load("valid_email@email.com");
    expect(user.email).toEqual("valid_email@email.com");
  });
});
