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
                comment_count: expect.any(Number),
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
              comment_count: 11,
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

describe("/api/users", () => {
  describe("GET", () => {
    describe("STATUS 200", () => {
      test("should respond with an array of objects with property username", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).toHaveLength(4);
            users.forEach((user) => {
              expect(user).toEqual(
                expect.objectContaining({
                  username: expect.any(String),
                })
              );
            });
            expect(users).toEqual([
              { username: "butter_bridge" },
              { username: "icellusedkars" },
              { username: "rogersop" },
              { username: "lurker" },
            ]);
          });
      });
    });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    describe("STATUS 200", () => {
      test("should respond with an array of article objects with author,title,article_id,topic,created_at and votes properties", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(12);
            articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  article_id: expect.any(Number),
                  author: expect.any(String),
                  title: expect.any(String),
                  topic: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                })
              );
            });
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
      });
      test("should also include comment_count as a property", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(12);
            articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  comment_count: expect.any(Number),
                })
              );
            });
          });
      });
      test("should respond with articles sorted by votes at client request ", () => {
        return request(app)
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("votes", { descending: true });
          });
      });
      test("should respond with articles in ascending order at client request", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("votes");
          });
      });
      test("should respond with articles of a given topic only", () => {
        return request(app)
          .get("/api/articles/?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach((article) => {
              expect(article.topic).toEqual("mitch");
            });
          });
      });
      test("should respond with an empty array when topic exists but there are no articles for that topic", () => {
        return request(app)
          .get("/api/articles/?topic=paper")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(0);
          });
      });
    });
    describe("STATUS 400", () => {
      test("should respond with bad request if order is anything but asc or desc", () => {
        return request(app)
          .get("/api/articles?order=notAnOrder")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "Unable to order. Ordering by notASortBy is an invalid request"
            );
          });
      });
      test("should respond with bad request if sort_by is anything but title,topic,author,created_at,votes or comment count", () => {
        return request(app)
          .get("/api/articles?sort_by=notASortBy")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "Unable to sort. Sorting by notASortBy is an invalid request"
            );
          });
      });
    });
    describe("STATUS 404", () => {
      test("should respond with topic not found if topic doesn't exist when requesting to see articles of that topic", () => {
        return request(app)
          .get("/api/articles/?topic=notATopic")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("topic not found");
          });
      });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    describe("STATUS 200", () => {
      test("should respond with an array of comments objects with comment_id, votes, created_at, author and body properties", () => {
        const ARTICLE_ID = 5;
        return request(app)
          .get(`/api/articles/${ARTICLE_ID}/comments`)
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(2);
            comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                })
              );
            });
          });
      });
      test("should respond with empty array if no comments for said article", () => {
        const ARTICLE_ID = 2;
        return request(app)
          .get(`/api/articles/${ARTICLE_ID}/comments`)
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(0);
          });
      });
    });
    describe("STATUS 404", () => {
      test("should respond with not found if valid but non existent article currently", () => {
        return request(app)
          .get("/api/articles/999/comments")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("article not found");
          });
      });
    });
    describe("STATUS 400", () => {
      test("should respond with Bad Request when given an invalid id (not a number)", () => {
        return request(app)
          .get("/api/articles/notAnID/comments")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
    });
  });
  describe("POST", () => {
    describe("STATUS 201", () => {
      test("should accept request body and respond with the posted comment object with username and body properties", () => {
        const ARTICLE_ID = 5;
        return request(app)
          .post(`/api/articles/${ARTICLE_ID}/comments`)
          .send({ username: "icellusedkars", body: "just a test" })
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: 19,
                author: "icellusedkars",
                body: "just a test",
                votes: 0,
                article_id: 5,
                created_at: expect.any(String),
              })
            );
          });
      });
    });
    describe("STATUS 400", () => {
      test("should respond with bad request if given a string for article id", () => {
        const ARTICLE_ID = "notanId";
        return request(app)
          .post(`/api/articles/${ARTICLE_ID}/comments`)
          .send({ username: "icellusedkars", body: "just a test" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
      test("should respond with bad request if given an empty object)", () => {
        const ARTICLE_ID = 5;
        return request(app)
          .post(`/api/articles/${ARTICLE_ID}/comments`)
          .send({})
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("no comment submitted");
          });
      });
    });
    describe("STATUS 404", () => {
      test("should respond with not found if valid but non existent article currently", () => {
        const ARTICLE_ID = "555";
        return request(app)
          .post(`/api/articles/${ARTICLE_ID}/comments`)
          .send({ username: "icellusedkars", body: "just a test" })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("article not found");
          });
      });
    });
  });
});
