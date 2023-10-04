const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index.js");
const request = require("supertest");
beforeEach(() => {
  return seed(data).then(() => db.end);
});

afterAll(() => {
  return db.end();
});

describe("tests for GET /api/topics", () => {
  test("should return 200 status code", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("should return correct result with expected properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("test for invalid paths", () => {
  test("should return 404 status code if path was wrong", () => {
    return request(app)
      .get("/api/topicssss")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("path not found");
      });
  });
});

describe("GET /api", () => {
  test("should return 200 status code", () => {
    return request(app).get("/api").expect(200);
  });
  test("results should have all required properties", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("Available_Endpoints");
        for (key in body.Available_Endpoints) {
          expect(body.Available_Endpoints[key]).toHaveProperty("description");
          expect(body.Available_Endpoints[key]).toHaveProperty("queries");
          expect(body.Available_Endpoints[key]).toHaveProperty(
            "exampleResponse"
          );
        }
      });
  });
  test("should return all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const currentEndpoints = Object.keys(body.Available_Endpoints).map(
          (x) => {
            return x;
          }
        );
        currentEndpoints.forEach((endpoint) => {
          expect(body.Available_Endpoints).toHaveProperty(endpoint);
        });
      });
  });
});
describe("GET /api/articles/:articleId", () => {
  test("should return 200 status code", () => {
    return request(app).get("/api/articles/1").expect(200);
  });
  test("should return an object with all expected properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body.article[0];
        expect(Object.keys(article).length).toBe(8);
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
      });
  });
  test("should return expected object", () => {
    const expectedArticle = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 100,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body.article[0];
        expect(article).toEqual(expectedArticle);
      });
  });
  test("should return 404 status code if article id doesn't exist in db", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("not found");
      });
  });
  test("should return 400 status code if article id is not a number", () => {
    return request(app)
      .get("/api/articles/100ada0")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("should return 200 status code", () => {
    return request(app).get("/api/articles").expect(200);
  });
  test("should return all articles with expected properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
  test("should return results sorted by date in descending order as default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});
describe("GET  /api/articles/:article_id/comments", () => {
  test("should return 200 status code", () => {
    return request(app).get("/api/articles/1/comments").expect(200);
  });
  test("should return an object with all expected properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });
  test("should return results sorted by date in descending order as default", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("should return 404 status code if article id doesn't exist in db", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("not found");
      });
  });
  test("should return 400 status code if article id is not a number", () => {
    return request(app)
      .get("/api/articles/108g7/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  test("should return 200 status code if article id exists but there is no comment for it", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({ comments: [] });
      });
  });
});

describe("POST  /api/articles/:article_id/comments", () => {
  const validBody = {
    username: "lurker",
    body: "it was good",
  };
  const invalidBody1 = {
    user: "lurker",
    body: "it was good",
  };
  const invalidBody2 = {
    user: "lurker",
    body: "it was good",
    extra: "smt else",
  };
  const invalidBody3 = {
    username: "someone",
    body: "it was good",
  };
  test("should return 200 status code and the posted comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send(validBody)
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual({ comment: "it was good" });
      });
  });
  test("should return 404 status code if article id doesn't exist", () => {
    return request(app)
      .post("/api/articles/1000/comments")
      .send(validBody)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("not found");
      });
  });
  test("should return 404 status code if username doesn't exist", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send(invalidBody3)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("not found");
      });
  });
  test("should return 400 status code if article id is not a string", () => {
    return request(app)
      .post("/api/articles/1000sdf/comments")
      .send(validBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  test("should return 400 status code if required properties don't exist in body", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send(invalidBody1)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  test("should return 400 status code if some other properties exist in body", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send(invalidBody2)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
});

describe("PATCH  /api/articles/:article_id", () => {
  const positiveValidObject = { inc_votes: 5 };
  const negativeValidObject = { inc_votes: -5 };
  const invalidObject1 = { inc_votes: "hola" };
  const invalidObject2 = { incvotes: 5 };
  const invalidObject3 = { inc_votes: "hola", smt: "smt" };
  test("should return 200 status code and the updated article if there is a positive increment ", () => {
    return request(app)
      .patch("/api/articles/1")
      .send(positiveValidObject)
      .expect(200)
      .then(({ body }) => {
        const expectedObject = {
          updated_article: [
            {
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 105,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            },
          ],
        };
        expect(body).toEqual(expectedObject);
      });
  });
  test("should return 200 status code and the updated article if there is a negative increment ", () => {
    return request(app)
      .patch("/api/articles/1")
      .send(negativeValidObject)
      .expect(200)
      .then(({ body }) => {
        const expectedObject = {
          updated_article: [
            {
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 95,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            },
          ],
        };
        expect(body).toEqual(expectedObject);
      });
  });
  test("should return 404 status code if article id doesn't exist ", () => {
    return request(app)
      .patch("/api/articles/1333")
      .send(negativeValidObject)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("not found");
      });
  });
  test("should return 400 status code if article id is not a number ", () => {
    return request(app)
      .patch("/api/articles/1333a")
      .send(negativeValidObject)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  test("should return 400 status code if the body doesn't have inc_votes property", () => {
    return request(app)
      .patch("/api/articles/1")
      .send(invalidObject2)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request, inc_votes required");
      });
  });
  test("should return 400 status code if the body some other properties", () => {
    return request(app)
      .patch("/api/articles/1")
      .send(invalidObject3)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request, inc_votes required only");
      });
  });
  test("should return 400 status code if inc_body is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send(invalidObject1)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request, inc_votes should be a number");
      });
  });
});

describe("DELETE  /api/comments/:comment_id", () => {
  test("should return 204 status code", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("should return 404 status code if comment id doesn't exist in db", () => {
    return request(app)
      .delete("/api/comments/177777")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("comment id not found");
      });
  });
});

describe.only("GET /api/users", () => {
  test("should return 200 status code", () => {
    return request(app).get("/api/users").expect(200);
  });
  test("should return all users in db", () => {
    const expectedObj = {
      users: [
        {
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        },
        {
          username: "icellusedkars",
          name: "sam",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        },
        {
          username: "rogersop",
          name: "paul",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
        },
        {
          username: "lurker",
          name: "do_nothing",
          avatar_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        },
      ],
    };
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(expectedObj)
      });
  });
});
