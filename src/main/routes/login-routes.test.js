const request = require("supertest");
const mongoHelper = require("../../infra/helper/mongo-helper");
const app = require("../config/app");
const bcrypt = require("bcrypt");
let userModel;

describe("Login Routes", () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL, "");
    userModel = await MongoHelper.getCollection("users");
  });

  afterEach(async () => {
    await userModel.deleteMany();
  });
  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test("Should return 200 when valid credentials are provided", async () => {
    await userModel.insertOne({
      email: "valid_email@email.com",
      password: bcrypt.hashSync("hashed_password", 10),
    });
    await request(app)
      .post("/api/login")
      .send({
        email: "valid_email@email.com",
        password: "hashed_password",
      })
      .expect(200);
  });
  test("Should return 401 when invalid credentials are provided", async () => {
    await userModel.insertOne({
      email: "valid_email@email.com",
      password: bcrypt.hashSync("hashed_password", 10),
    });
    await request(app)
      .post("/api/login")
      .send({
        email: "valid_email@email.com",
        password: "hashed_password",
      })
      .expect(401);
  });
});
