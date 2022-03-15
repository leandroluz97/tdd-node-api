class AuthUseCaseSpy {
  async auth(email, password) {
    if (!email) {
      return null;
    }

    return this.accessToken;
  }
}

describe("Email Validator", () => {
  test("Should return null if no email is provided", async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth();
    expect(promise).rejects.toThrow();
  });
});
