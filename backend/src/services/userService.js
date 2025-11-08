const User = require("../models/User")

class UserService {
  async getUserProfile(userId) {
    const user = await User.findById(userId).select("-password -otpCode -otpExpiry")
    if (!user) throw new Error("User not found")
    return user
  }

  async updateUserProfile(userId, updateData) {
    const { name, avatar, addresses } = updateData
    const user = await User.findByIdAndUpdate(
      userId,
      { name, avatar, addresses },
      { new: true, runValidators: true },
    ).select("-password")
    return user
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findById(userId)
    if (!user) throw new Error("User not found")

    const isMatch = await user.comparePassword(oldPassword)
    if (!isMatch) throw new Error("Old password is incorrect")

    user.password = newPassword
    await user.save()
    return { message: "Password changed successfully" }
  }

  async addAddress(userId, addressData) {
    const user = await User.findByIdAndUpdate(userId, { $push: { addresses: addressData } }, { new: true })
    return user
  }

  async deleteAddress(userId, addressId) {
    const user = await User.findByIdAndUpdate(userId, { $pull: { addresses: { _id: addressId } } }, { new: true })
    return user
  }
}

module.exports = new UserService()
