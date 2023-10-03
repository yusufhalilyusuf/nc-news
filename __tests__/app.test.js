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
        const obj = body.topics;
        expect(body.topics.length).toBe(3);
        obj.forEach((topic) => {
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
  test("values of properties should be in expected type", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("Available_Endpoints");
        for (key in body.Available_Endpoints) {
          expect(typeof body.Available_Endpoints[key].description).toBe(
            "string"
          );
          expect(Array.isArray(body.Available_Endpoints[key].queries)).toBe(
            true
          );
          expect(typeof body.Available_Endpoints[key].exampleResponse).toBe(
            "object"
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
