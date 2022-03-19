const validator = require("validator");
const EmailValidator = require("./email-validator");
const { MissingParamError } = require("./errors");

const makeSut = () => {
  return new EmailValidator();
};

describe("Email Validator", () => {
  test("Should return true if validator returns true", () => {
    const sut = makeSut();
    const isEmailValid = sut.isValid("valid_email@gmail.com");
    expect(isEmailValid).toBe(true);
  });

  test("Should return true if validator returns true", () => {
    validator.isEmailValid = false;
    const sut = makeSut();
    const isEmailValid = sut.isValid("invalid_email@gmail.com");
    expect(isEmailValid).toBe(false);
  });

  test("Should call validator with correct email", () => {
    validator.isEmailValid = false;
    const sut = makeSut();
    sut.isValid("any_email@gmail.com");
    expect(validator.email).toBe("any_email@gmail.com");
  });

  test("Should throw if no email is provided", async () => {
    const sut = makeSut();
    // expect(sut.isValid).toThrowError(new MissingParamError("email"));
    expect(() => sut.isValid()).toThrowError(new MissingParamError("email"));
  });
});
