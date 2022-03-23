const MongoHelper = require("../infra/helper/mongo-helper");
const env = require("./config/env");

MongoHelper.connect(env.mongoUrl, env.name)
  .then(() => {
    const app = require("./config/app");
    app.listen(env.port, () => console.log("Server Running at http://localhost:" + env.port));
  })
  .catch(console.error);
