const MongoHelper = require("../infra/helper/mongo-helper");
const env = require("./config/env");

MongoHelper.connect(env.mongoUrl, env.name)
  .then(() => {
    const app = require("./config/app");
    app.listen(5858, () => console.log("Server Running"));
  })
  .catch(console.error);
