const workerService = require("../services/workerService")

class WorkerController {
  async getProfile(req, res, next) {
    try {
      const { workerId } = req.params
      const worker = await workerService.getWorkerProfile(workerId)
      res.status(200).json({ success: true, data: worker })
    } catch (error) {
      next(error)
    }
  }

  async listWorkers(req, res, next) {
    try {
      const workers = await workerService.getWorkers(req.query)
      res.status(200).json({ success: true, data: workers })
    } catch (error) {
      next(error)
    }
  }

  async approveWorker(req, res, next) {
    try {
      const { workerId } = req.params
      const worker = await workerService.approveWorker(workerId)
      res.status(200).json({ success: true, data: worker })
    } catch (error) {
      next(error)
    }
  }

  async rejectWorker(req, res, next) {
    try {
      const { workerId } = req.params
      const worker = await workerService.rejectWorker(workerId)
      res.status(200).json({ success: true, data: worker })
    } catch (error) {
      next(error)
    }
  }

  async updateAvailability(req, res, next) {
    try {
      const worker = await workerService.updateAvailability(req.user._id, req.body)
      res.status(200).json({ success: true, data: worker })
    } catch (error) {
      next(error)
    }
  }

  async recordAttendance(req, res, next) {
    try {
      const worker = await workerService.recordAttendance(req.user._id, req.body)
      res.status(200).json({ success: true, data: worker })
    } catch (error) {
      next(error)
    }
  }

  async requestPayout(req, res, next) {
    try {
      const { amount } = req.body
      const result = await workerService.requestPayout(req.user._id, amount)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  async updateSkills(req, res, next) {
    try {
      const { skills } = req.body
      const worker = await workerService.updateWorkerSkills(req.user._id, skills)
      res.status(200).json({ success: true, data: worker })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new WorkerController()
