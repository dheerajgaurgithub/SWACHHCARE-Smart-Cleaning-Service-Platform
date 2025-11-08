const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Notification must belong to a user']
    },
    title: {
      type: String,
      required: [true, 'Notification must have a title'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Notification must have a message'],
      trim: true
    },
    type: {
      type: String,
      enum: [
        'booking_created',
        'booking_confirmed',
        'booking_cancelled',
        'booking_completed',
        'payment_success',
        'payment_failed',
        'new_message',
        'account_updated',
        'promotional',
        'system',
        'other'
      ],
      default: 'other'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    data: {
      // Flexible field to store additional data
      type: mongoose.Schema.Types.Mixed
    },
    relatedEntity: {
      type: String,
      enum: ['booking', 'user', 'service', 'payment', 'review', 'worker', 'admin'],
      required: [true, 'Please specify the related entity type']
    },
    relatedEntityId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedEntity',
      required: [true, 'Please provide the related entity ID']
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    },
    actionUrl: String,
    icon: String,
    image: String
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Populate user when querying notifications
notificationSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email phone'
  });
  next();
});

// Static method to create a new notification
notificationSchema.statics.createNotification = async function(notificationData) {
  try {
    const notification = await this.create(notificationData);
    
    // Emit real-time notification using WebSocket
    const io = require('../utils/socket').getIO();
    if (io) {
      io.to(`user_${notification.user}`).emit('new_notification', {
        notification: {
          _id: notification._id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          isRead: notification.isRead,
          createdAt: notification.createdAt
        }
      });
    }
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Method to mark notification as read
notificationSchema.methods.markAsRead = async function() {
  if (this.isRead) return this;
  
  this.isRead = true;
  await this.save({ validateBeforeSave: false });
  
  return this;
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
