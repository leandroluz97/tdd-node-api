module.exports = class ServerError extends Error {
  constructor() {
    super("Interenal error");
    this.name = "ServerError";
  }
};
