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
      test("should respond with array of topics objects with slug and description properties", () => {
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

// describe.only("/api/articles", () => {
//   describe("GET", () => {
//     describe("STATUS 200", () => {
//       test("should respond with an array of article objects with author,title,article_id,topic,created_at and votes properties", () => {
//         return request(app)
//           .get("/api/articles")
//           .expect(200)
//           .then(({ body: { articles } }) => {
//             expect(articles).toHaveLength(12);
//             articles.forEach((article) => {
//               expect(article).toEqual(
//                 expect.objectContaining({
//                   article_id: expect.any(Number),
//                   author: expect.any(String),
//                   title: expect.any(String),
//                   topic: expect.any(String),
//                   created_at: expect.any(String),
//                   votes: expect.any(Number),
//                 })
//               );
//             });
//             // expect(articles).toBeSortedBy(created_at, { descending: true });
//           });
//       });
//     });
//   });
// });

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    describe("STATUS 200", () => {
      test("should respond with an article object with properties: author, title, article_id, body,topic,created_at and votes", () => {
        const ARTICLE_ID = 1;
        return request(app)
          .get(`/api/articles/${ARTICLE_ID}`)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
            expect(article).toEqual({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
            });
          });
      });
    });
    describe("STATUS 400", () => {
      test("should respond with Bad Request when given an invalid id (not a number)", () => {
        return request(app)
          .get("/api/articles/notAnID")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
    });
    describe("STATUS 404", () => {
      test("should respond with not found if valid but non existent article currently", () => {
        return request(app)
          .get("/api/articles/999")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("article not found");
          });
      });
    });
  });
  describe("PATCH", () => {
    describe("STATUS 200", () => {
      test("should respond with the article with updated vote count", () => {
        const voteUpdates = { inc_votes: -5 };
        return request(app)
          .patch("/api/articles/3")
          .send(voteUpdates)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual({
              article_id: 3,
              title: "Eight pug gifs that remind me of mitch",
              topic: "mitch",
              author: "icellusedkars",
              body: "some gifs",
              created_at: "2020-11-03T09:12:00.000Z",
              votes: -5,
            });
          });
      });
    });
    describe("STATUS 400", () => {
      test("should respond with Bad Request when given an invalid id (not a number)", () => {
        const voteUpdates = { inc_votes: 5 };
        return request(app)
          .patch("/api/articles/notAnId")
          .send(voteUpdates)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
      test("should respond with bad request when given an empty object as body", () => {
        const voteUpdates = {};
        return request(app)
          .patch("/api/articles/3")
          .send(voteUpdates)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("no updates requested");
          });
      });
    });
  });
});
