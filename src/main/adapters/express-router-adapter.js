module.exports = class ExpressRouterAdapter {
  static adapter(router) {
    return async (req, res) => {
      const httpRequest = {
        body: req.body,
      };
      const httpResponse = await router(httpRequest);
      res.status(httpResponse.statusCode).json(httpRequest.body);
    };
  }
};
