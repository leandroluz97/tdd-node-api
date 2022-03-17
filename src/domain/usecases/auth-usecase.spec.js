const { MissingParamError } = require("../../utils/errors");
const AuthUseCase = require("./auth-usecase");

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare(password, hashedPassword) {
      this.password = password;
      this.hashedPassword = hashedPassword;

      return this.isValid;
    }
  }
  const encrypterSpy = new EncrypterSpy();
  encrypterSpy.isValid = true;
  return encrypterSpy;
};
const makeEncrypterWithError = () => {
  class EncrypterSpy {
    async compare() {
      throw new Error();
    }
  }

  return new EncrypterSpy();
};

const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate(userId) {
      this.userId = userId;

      return this.accessToken;
    }
  }
  const tokenGeneratorSpy = new TokenGeneratorSpy();
  tokenGeneratorSpy.accessToken = "any_token";
  return tokenGeneratorSpy;
};

const makeTokenGeneratorWithError = () => {
  class TokenGeneratorSpy {
    async generate() {
      throw new Error();
    }
  }
  return new TokenGeneratorSpy();
};

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email;
      return this.user;
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
  loadUserByEmailRepositorySpy.user = {
    id: "any_id",
    password: "hashed_password",
  };

  return loadUserByEmailRepositorySpy;
};
const makeLoadUserByEmailRepositoryWithError = () => {
  class LoadUserByEmailRepositorySpy {
    async load() {
      throw new Error();
    }
  }
  return new LoadUserByEmailRepositorySpy();
};

const makeSut = () => {
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository();
  const encrypterSpy = makeEncrypter();
  const tokenGeneratorSpy = makeTokenGenerator();
  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
  });

  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
  };
};

describe("Auth UseCase", () => {
  test("Should throw if no email is provided", async () => {
    const { sut } = makeSut();
    const promise = sut.auth();
    expect(promise).rejects.toThrow(new MissingParamError("email"));
  });

  test("Should throw if no email is provided", async () => {
    const { sut } = makeSut();
    const promise = sut.auth("any_email@email.com");
    expect(promise).rejects.toThrow(new MissingParamError("password"));
  });

  test("Should call LoadUserByEmailRepository with correct email", async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    await sut.auth("any_email@email.com", "any_password");
    expect(loadUserByEmailRepositorySpy.email).toBe("any_email@email.com");
  });

  // test("Should throw if no dependency is provided", async () => {
  //   const sut = new AuthUseCase();
  //   const promise = sut.auth("any_email@email.com", "any_password");
  //   expect(promise).rejects.toThrow();
  // });

  // test("Should throw if no LoadUserByEmailRepository is provided", async () => {
  //   const sut = new AuthUseCase({});
  //   const promise = sut.auth("any_email@email.com", "any_password");
  //   expect(promise).rejects.toThrow();
  // });

  // test("Should throw if no LoadUserByEmailRepository has no load method", async () => {
  //   const sut = new AuthUseCase({ loadUserByEmailRepository: {} });
  //   const promise = sut.auth("any_email@email.com", "any_password");
  //   expect(promise).rejects.toThrow();
  // });

  test("Should return null if an invalid email is provided", async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    loadUserByEmailRepositorySpy.user = null;
    const accessToken = await sut.auth("invalid_email@email.com", "any_password");
    expect(accessToken).toBeNull();
  });

  test("Should return null if an invalid password is provided", async () => {
    const { sut, encrypterSpy } = makeSut();
    encrypterSpy.isValid = false;
    const accessToken = await sut.auth("valid_email@email.com", "invalid_password");
    expect(accessToken).toBeNull();
  });

  test("Should call Encrypter with correct values", async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut();
    await sut.auth("valid_email@email.com", "any_password");
    expect(encrypterSpy.password).toBe("any_password");
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password);
  });

  test("Should call TokenGenerator with correct userId", async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut();
    await sut.auth("valid_email@email.com", "valid_password");
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id);
  });

  test("Should an accessToken if valid credentials are provided", async () => {
    const { sut, tokenGeneratorSpy } = makeSut();
    const accessToken = await sut.auth("valid_email@email.com", "valid_password");
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken);
    expect(accessToken).toBeTruthy();
  });

  test("Should throw if no dependency is provided", async () => {
    const invalid = {};
    const loadUserByEmailRepository = makeLoadUserByEmailRepository();
    const encrypter = makeEncrypter();
    const suts = [].concat(
      new AuthUseCase(),
      new AuthUseCase({
        loadUserByEmailRepository: null,
        encrypter: null,
        tokenGenerator: null,
      }),
      new AuthUseCase({
        loadUserByEmailRepository: invalid,
        encrypter: null,
        tokenGenerator: null,
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter: null,
        tokenGenerator: null,
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter: invalid,
        tokenGenerator: null,
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: null,
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: invalid,
      })
    );
    for (const sut of suts) {
      const promise = sut.auth("any_email@email.com", "any_password");
      expect(promise).rejects.toThrow();
    }
  });

  test("Should throw if any dependency throws", async () => {
    const invalid = {};
    const loadUserByEmailRepository = makeLoadUserByEmailRepository();
    const encrypter = makeEncrypter();
    const suts = [].concat(
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositoryWithError(),
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter: makeEncrypterWithError(),
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: makeTokenGeneratorWithError(),
      })
    );
    for (const sut of suts) {
      const promise = sut.auth("any_email@email.com", "any_password");
      expect(promise).rejects.toThrow();
    }
  });
});
