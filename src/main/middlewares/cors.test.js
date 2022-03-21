const res = require("express/lib/response");
const request = require("supertest");
const app = require("../config/app");

describe("Cors Middleware", () => {
  test("Should enable CORS", async () => {
    app.get("/test_cors", () => {
      res.send();
    });
    const result = await request(app).get("/test_cors");
    expect(result.header["access-control-allow-origin"]).toBe("*");
    expect(result.header["access-control-allow-methods"]).toBe("*");
    expect(result.header["access-control-allow-headers"]).toBe("*");
  });
});
