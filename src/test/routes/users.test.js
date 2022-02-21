const request = require("supertest");
const buildApp = require("../../app");
const Context = require("../context");
const UserRepo = require("../../repos/user.repo");

let context;

beforeAll(async function () {
  context = await Context.build();
});

beforeEach(async function () {
  await context.reset();
});

afterAll(function () {
  return context.close();
});

it("create new user", async function () {
  const startingCount = await UserRepo.count();

  await request(buildApp()).post("/users").send({ username: "test", bio: "i'm test" }).expect(200);

  const finishingCount = await UserRepo.count();

  expect(finishingCount - startingCount).toEqual(1);
});
