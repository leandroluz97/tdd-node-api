const bcrypt = require("bcrypt");

class Encrypter {
  async compare(value, hash) {
    const isValid = await bcrypt.compare(value, hash);
    return isValid;
  }
}

describe("En crypter", () => {
  test("Should teturn true if bcrypt return true", async () => {
    const sut = new Encrypter();
    const isValid = await sut.compare("any_value", "hashed_value");
    expect(isValid).toBe(true);
  });

  test("Should teturn false if bcrypt return false", async () => {
    const sut = new Encrypter();
    bcrypt.isValid = false;
    const isValid = await sut.compare("any_value", "hashed_value");
    expect(isValid).toBe(false);
  });
});
