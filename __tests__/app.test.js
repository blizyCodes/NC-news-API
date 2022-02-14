const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/");
const db = require("../db/connection");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api/topics", () => {
  describe("GET", () => {
    describe("STATUS 200", () => {
      test("respond with 200", () => {
        return request(app).get("/api/topics").expect(200);
      });
      test("should respond with array of topics objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).toHaveLength(3);
            topics.forEach((topic) => {
              expect(topic).toEqual(
                expect.objectContaining({
                  slug: expect.any(String),
                  description: expect.any(String),
                })
              );
            });
          });
      });
    });
    describe("STATUS 404", () => {
      test("should respond with Bad request when given an invalid endpoint", () => {
        return request(app)
          .get("/api/topiczz")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("path not found");
          });
      });
    });
  });
});
