const Booking = require("../models/Booking")
const nanoid = require("nanoid").nanoid

class BookingService {
  async createBooking(customerId, bookingData) {
    const bookingId = `BK-${nanoid(10).toUpperCase()}`

    const booking = await Booking.create({
      bookingId,
      customerId,
      serviceType: bookingData.serviceType,
      subService: bookingData.subService,
      duration: bookingData.duration,
      basePrice: bookingData.basePrice,
      location: bookingData.location,
      scheduledDate: bookingData.scheduledDate,
      scheduledTime: bookingData.scheduledTime,
      specialInstructions: bookingData.specialInstructions,
      baseAmount: bookingData.basePrice * bookingData.duration,
      totalAmount: bookingData.basePrice * bookingData.duration,
    })

    return booking
  }

  async getBooking(bookingId) {
    const booking = await Booking.findById(bookingId)
      .populate("customerId", "name email phone")
      .populate("workerId", "name skills averageRating")
    return booking
  }

  async getBookingsByUser(userId, userRole) {
    const query = userRole === "customer" ? { customerId: userId } : { workerId: userId }
    const bookings = await Booking.find(query).sort({ createdAt: -1 })
    return bookings
  }

  async updateBookingStatus(bookingId, status) {
    const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true })
    return booking
  }

  async assignWorker(bookingId, workerId) {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { workerId, status: "assigned" },
      { new: true },
    ).populate("workerId")
    return booking
  }

  async addFeedback(bookingId, feedbackData) {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { feedback: feedbackData, status: "completed" },
      { new: true },
    )
    return booking
  }

  async cancelBooking(bookingId, reason) {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "cancelled", cancellationReason: reason },
      { new: true },
    )
    return booking
  }

  async applyDiscount(bookingId, discountCode) {
    const booking = await Booking.findById(bookingId)
    // TODO: Validate discount code and apply
    return booking
  }
}

module.exports = new BookingService()
