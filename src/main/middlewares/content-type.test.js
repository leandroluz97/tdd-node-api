const request = require("supertest");
let app;

describe("Content-Type Middleware", () => {
  beforeEach(() => {
    jest.resetModules();
    app = require("../config/app");
  });

  test("Should return json content type as default", async () => {
    app.get("/test_content_type", (req, res) => {
      res.send({});
    });
    const result = await request(app).get("/test_content_type").expect("content-type", /json/);
  });

  test("Should return xml content-type if it specified", async () => {
    app.get("/test_content_type_xml", (req, res) => {
      res.type("xml");
      res.send({});
    });
    const result = await request(app).get("/test_content_type_xml").expect("content-type", /xml/);
  });
});
