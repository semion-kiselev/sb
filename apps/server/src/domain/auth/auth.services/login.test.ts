import { getUserByCredentials } from "domain/users/users.services/get-user-by-credentials";
import { login } from "./login";

jest.mock("../../users/users.services/get-user-by-credentials", () => ({
  getUserByCredentials: jest.fn(),
}));

const mockGetUserByCredentials = jest.mocked(getUserByCredentials);

describe("login", () => {
  it("should raise not authorized", () => {
    mockGetUserByCredentials.mockImplementation(() => Promise.resolve(null));
    const token = "test:token";
    const payload = { email: "test@mail.com", password: "123" };
    const error = new Error("401");
    const raiseNotAuthorized = jest.fn(() => {
      throw error;
    });
    const signToken = () => Promise.resolve(token);

    const result = login(payload, raiseNotAuthorized, signToken);
    expect(result).rejects.toThrow(error);
  });

  it("should return signed token", () => {
    const user = {
      id: 1,
      name: "name",
      email: "e@mail.com",
      permissions: ["UR"],
      createdAt: "",
      updatedAt: "",
    };
    mockGetUserByCredentials.mockImplementation(() => Promise.resolve(user));
    const token = "test:token";
    const payload = { email: "test@mail.com", password: "123" };
    const error = new Error("401");
    const raiseNotAuthorized = jest.fn(() => {
      throw error;
    });
    const signToken = () => Promise.resolve(token);

    const result = login(payload, raiseNotAuthorized, signToken);
    const expectedResult = { token };
    expect(result).resolves.toEqual(expectedResult);
  });
});
