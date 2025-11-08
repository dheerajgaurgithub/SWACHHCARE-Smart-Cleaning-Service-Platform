const request = require("supertest")
const { app } = require("../server")

describe("Booking Routes", () => {
  let token

  beforeAll(async () => {
    // Login and get token
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "john@example.com",
      password: "Password123",
    })
    token = res.body.data.token
  })

  describe("POST /api/v1/bookings", () => {
    it("should create a new booking", async () => {
      const res = await request(app)
        .post("/api/v1/bookings")
        .set("Authorization", `Bearer ${token}`)
        .send({
          serviceType: "house-cleaning",
          duration: 2,
          basePrice: 500,
          location: {
            address: "123 Main St",
            city: "Mumbai",
            zipCode: "400001",
          },
          scheduledDate: new Date(),
          scheduledTime: "10:00",
        })

      expect(res.statusCode).toBe(201)
      expect(res.body.success).toBe(true)
    })
  })
})
