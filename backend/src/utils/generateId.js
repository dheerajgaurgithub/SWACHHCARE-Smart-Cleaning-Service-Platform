const { nanoid } = require("nanoid")

const generateBookingId = () => `BK-${nanoid(10).toUpperCase()}`
const generateTransactionId = () => `TXN-${nanoid(10).toUpperCase()}`

module.exports = {
  generateBookingId,
  generateTransactionId,
}
