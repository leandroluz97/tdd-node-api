const res = require("express/lib/response");
const request = require("supertest");
const app = require("./app");

describe("App Setup", () => {
  test("Should disable x-powered-by header", async () => {
    app.get("/test_x_powered_by", () => {
      res.send();
    });
    const result = await request(app).get("/test_x_powered_by");
    expect(result.header["x-powered-by"]).toBeUndefined();
  });
});
