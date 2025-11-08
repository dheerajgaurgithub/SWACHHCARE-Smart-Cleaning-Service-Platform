const cron = require("node-cron")
const Transaction = require("../models/Transaction")
const Worker = require("../models/Worker")

// Daily payout settlement
const setupPayoutCron = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("[Cron] Running daily payout settlement...")
      const workers = await Worker.find({ pendingPayouts: { $gt: 0 } })

      for (const worker of workers) {
        await Transaction.create({
          workerId: worker._id,
          type: "payout",
          amount: worker.pendingPayouts,
          status: "completed",
        })
        worker.pendingPayouts = 0
        await worker.save()
      }
      console.log("[Cron] Payout settlement completed")
    } catch (error) {
      console.error("[Cron Error]", error)
    }
  })
}

// Clean expired OTPs
const setupOTPCleanupCron = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const User = require("../models/User")
      await User.updateMany({ otpExpiry: { $lt: new Date() } }, { $unset: { otpCode: "", otpExpiry: "" } })
    } catch (error) {
      console.error("[Cron Error]", error)
    }
  })
}

const setupAllCrons = () => {
  setupPayoutCron()
  setupOTPCleanupCron()
  console.log("[Cron] All cron jobs initialized")
}

module.exports = setupAllCrons
