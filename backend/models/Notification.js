// models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['alert', 'info', 'warning', 'success'],
    default: 'info'
  },
  relatedTo: {
    type: String,
    enum: ['crop', 'weather', 'irrigation', 'system', 'general'],
    default: 'general'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  actionUrl: {
    type: String,
    optional: true
  },
  expiresAt: {
    type: Date,
    optional: true
  }
}, {
  timestamps: true
});

// Index for better query performance
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to create common notifications
notificationSchema.statics.createWeatherAlert = function(userId, message) {
  return this.create({
    userId,
    title: 'Weather Alert',
    message,
    type: 'warning',
    relatedTo: 'weather',
    priority: 'high'
  });
};

notificationSchema.statics.createIrrigationAlert = function(userId, cropName, message) {
  return this.create({
    userId,
    title: `Irrigation Alert - ${cropName}`,
    message,
    type: 'alert',
    relatedTo: 'irrigation',
    priority: 'medium'
  });
};

notificationSchema.statics.createCropHealthAlert = function(userId, cropName, issue) {
  return this.create({
    userId,
    title: `Crop Health Issue - ${cropName}`,
    message: `Your crop ${cropName} has a health issue: ${issue}`,
    type: 'warning',
    relatedTo: 'crop',
    priority: 'high'
  });
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;