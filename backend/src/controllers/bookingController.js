const bookingService = require("../services/bookingService")

class BookingController {
  async createBooking(req, res, next) {
    try {
      const booking = await bookingService.createBooking(req.user._id, req.body)
      res.status(201).json({ success: true, data: booking })
    } catch (error) {
      next(error)
    }
  }

  async getBooking(req, res, next) {
    try {
      const { bookingId } = req.params
      const booking = await bookingService.getBooking(bookingId)
      res.status(200).json({ success: true, data: booking })
    } catch (error) {
      next(error)
    }
  }

  async getBookings(req, res, next) {
    try {
      const bookings = await bookingService.getBookingsByUser(req.user._id, req.user.role)
      res.status(200).json({ success: true, data: bookings })
    } catch (error) {
      next(error)
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { bookingId } = req.params
      const { status } = req.body
      const booking = await bookingService.updateBookingStatus(bookingId, status)
      res.status(200).json({ success: true, data: booking })
    } catch (error) {
      next(error)
    }
  }

  async assignWorker(req, res, next) {
    try {
      const { bookingId } = req.params
      const { workerId } = req.body
      const booking = await bookingService.assignWorker(bookingId, workerId)
      res.status(200).json({ success: true, data: booking })
    } catch (error) {
      next(error)
    }
  }

  async addFeedback(req, res, next) {
    try {
      const { bookingId } = req.params
      const booking = await bookingService.addFeedback(bookingId, req.body)
      res.status(200).json({ success: true, data: booking })
    } catch (error) {
      next(error)
    }
  }

  async cancelBooking(req, res, next) {
    try {
      const { bookingId } = req.params
      const { reason } = req.body
      const booking = await bookingService.cancelBooking(bookingId, reason)
      res.status(200).json({ success: true, data: booking })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new BookingController()
