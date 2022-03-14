module.exports = class InvalidParamError extends Error {
  constructor(paramName) {
    super(`Invalid params: ${paramName}`);
    this.name = "InvalidParamError";
  }
};
