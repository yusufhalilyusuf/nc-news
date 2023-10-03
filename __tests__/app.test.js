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