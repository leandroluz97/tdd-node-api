const { MongoClient } = require("mongodb");

let client, db;
const makeSut = () => {
  const userModel = db.collection("users");
  const sut = new LoadUserByEmailRepository(userModel);

  return { sut, userModel };
};
class LoadUserByEmailRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }
  async load(email) {
    const user = await this.userModel.findOne(
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
}

describe("LoadUserByEmail Repository", () => {
  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await client.db();
  });

  afterEach(async () => {
    await db.collection("users").deleteMany();
  });
  afterAll(async () => {
    await client.close();
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
