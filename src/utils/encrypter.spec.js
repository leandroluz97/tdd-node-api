const bcrypt = require("bcrypt");
const Encrypter = require("./encrypter");

const makeSut = () => {
  const enrypterSpy = new Encrypter();
  return enrypterSpy;
};

describe("En crypter", () => {
  test("Should teturn true if bcrypt return true", async () => {
    const sut = makeSut();
    const isValid = await sut.compare("any_value", "hashed_value");
    expect(isValid).toBe(true);
  });

  test("Should teturn false if bcrypt return false", async () => {
    const sut = makeSut();
    bcrypt.isValid = false;
    const isValid = await sut.compare("any_value", "hashed_value");
    expect(isValid).toBe(false);
  });

  test("Should teturn false if bcrypt return false", async () => {
    const sut = makeSut();
    const isValid = await sut.compare("any_value", "hashed_value");
    expect(bcrypt.value).toBe("any_value");
    expect(bcrypt.hash).toBe("hashed_value");
  });
});
