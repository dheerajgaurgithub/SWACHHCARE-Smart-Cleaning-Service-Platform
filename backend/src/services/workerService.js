const Worker = require("../models/Worker")
const User = require("../models/User")

class WorkerService {
  async getWorkerProfile(workerId) {
    const worker = await Worker.findById(workerId).populate("userId", "name email phone avatar")
    return worker
  }

  async getWorkers(filters = {}) {
    const query = {}

    if (filters.skills) {
      query.skills = { $in: Array.isArray(filters.skills) ? filters.skills : [filters.skills] }
    }
    if (filters.city) {
      query["location.city"] = filters.city
    }
    if (filters.minRating) {
      query.averageRating = { $gte: filters.minRating }
    }
    if (filters.isAvailable !== undefined) {
      query.isAvailable = filters.isAvailable
    }

    const workers = await Worker.find(query)
      .populate("userId", "name email phone avatar")
      .limit(Number.parseInt(filters.limit) || 20)
      .skip(Number.parseInt(filters.skip) || 0)

    return workers
  }

  async approveWorker(workerId) {
    const worker = await Worker.findByIdAndUpdate(workerId, { approvalStatus: "approved" }, { new: true })
    return worker
  }

  async rejectWorker(workerId) {
    const worker = await Worker.findByIdAndUpdate(workerId, { approvalStatus: "rejected" }, { new: true })
    return worker
  }

  async updateAvailability(workerId, availabilityData) {
    const worker = await Worker.findByIdAndUpdate(
      workerId,
      {
        isAvailable: availabilityData.isAvailable,
        currentLocation: availabilityData.location,
        workingHours: availabilityData.workingHours,
      },
      { new: true },
    )
    return worker
  }

  async updateWorkerRating(workerId, rating) {
    const worker = await Worker.findById(workerId)

    const totalRating = worker.totalRating + rating
    const ratingCount = worker.ratingCount + 1
    const averageRating = totalRating / ratingCount

    worker.totalRating = totalRating
    worker.ratingCount = ratingCount
    worker.averageRating = averageRating
    await worker.save()

    return worker
  }

  async recordAttendance(workerId, attendanceData) {
    const worker = await Worker.findByIdAndUpdate(
      workerId,
      {
        $push: {
          attendanceRecords: attendanceData,
        },
      },
      { new: true },
    )
    return worker
  }

  async requestPayout(workerId, amount) {
    const worker = await Worker.findById(workerId)
    if (!worker) throw new Error("Worker not found")

    if (worker.walletBalance < amount) {
      throw new Error("Insufficient balance")
    }

    worker.walletBalance -= amount
    worker.pendingPayouts += amount
    await worker.save()

    return { message: "Payout request created", worker }
  }

  async updateWorkerSkills(workerId, skills) {
    const worker = await Worker.findByIdAndUpdate(workerId, { skills }, { new: true })
    return worker
  }
}

module.exports = new WorkerService()
