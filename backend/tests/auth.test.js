const request = require("supertest")
const { app } = require("../server")

describe("Auth Routes", () => {
  describe("POST /api/v1/auth/register", () => {
    it("should register a new customer", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        phone: "9876543210",
        password: "Password123",
      })

      expect(res.statusCode).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty("token")
    })
  })

  describe("POST /api/v1/auth/login", () => {
    it("should login with valid credentials", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "john@example.com",
        password: "Password123",
      })

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
    })
  })
})
