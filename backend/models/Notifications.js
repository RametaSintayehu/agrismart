import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['order_placed', 'order_updated', 'low_stock', 'new_product', 'system'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedEntity: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedEntityModel'
  },
  relatedEntityModel: {
    type: String,
    enum: ['Order', 'Product', null]
  },
  read: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Create notification method
notificationSchema.statics.createNotification = async function(userId, type, title, message, relatedEntity = null, priority = 'medium') {
  const notification = new this({
    user: userId,
    type,
    title,
    message,
    relatedEntity,
    relatedEntityModel: relatedEntity ? relatedEntity.constructor.modelName : null,
    priority
  });
  
  return await notification.save();
};

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;