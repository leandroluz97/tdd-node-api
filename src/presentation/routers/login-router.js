const HttpResponse = require("../helpers/http-response");
const UnauthorizedError = require("../helpers/unauthorized-error");
const MissingParamError = require("../helpers/missing-param-error");

module.exports = class LoginRouter {
  constructor(authUseCase) {
    this.authUseCase = authUseCase;
  }
  async route(httpRequest) {
    // if (!httpRequest || !httpRequest.body || !this.authUseCase || !this.authUseCase.auth) {
    //   return HttpResponse.serverError();
    // }

    try {
      const { email, password } = httpRequest.body;
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError("email"));
      }
      if (!password) {
        return HttpResponse.badRequest(new MissingParamError("password"));
      }

      const accessToken = await this.authUseCase.auth(email, password);
      if (!accessToken) {
        return HttpResponse.unauthorizedError();
      }
      return HttpResponse.ok({ accessToken });
    } catch (error) {
      // console.log(error);
      return HttpResponse.serverError();
    }
  }
};
