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

  test("Should enable CORS", async () => {
    app.get("/test_cors", () => {
      res.send();
    });
    const result = await request(app).get("/test_x_powered_by");
    expect(result.header["access-control-allow-origin"]).toBe("*");
    expect(result.header["access-control-allow-methods"]).toBe("*");
    expect(result.header["access-control-allow-headers"]).toBe("*");
  });
});
