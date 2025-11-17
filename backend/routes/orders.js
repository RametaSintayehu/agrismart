import express from 'express';
import Order from '../models/Order.js';
import Notification from '../models/Notification.js';
import Product from '../models/Product.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    // Validate items and check stock
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.quantity}` 
        });
      }

      //Update product quantity
      product.quantity -= item.quantity;
      await product.save();

      //chack for low stock notification
      if(product.quantity <= 10) {
        await Notification.createNotification(
          product.farmer,
          'low_stock',
          'Low Stock Alert',
          '${product.name} is running low.only ${product.quantity} ${product.unit} left.',
          product._id,
          'high'
        );
      }
    }

    // Get farmer ID from first product
    const firstProduct = await Product.findById(items[0].product).populate('farmer');
    const farmerId = firstProduct.farmer._id;

    // Create order
    const order = new Order({
      buyer: req.user.userId,
      farmer: farmerId,
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await order.save();
    await order.populate('items.product', 'name images unit');
    await order.populate('buyer', 'name email location');
    await order.populate('farmer', 'name email location');

  // Create notifications
    await Notification.createNotification(
      farmerId,
      'order_placed',
      'New Order Received',
      `You have a new order from ${order.buyer.name}`,
      order._id,
      'high'
    );

    await Notification.createNotification(
      req.user.userId,
      'order_placed',
      'Order Confirmed',
      `Your order #${order._id.slice(-8)} has been placed successfully`,
      order._id,
      'medium'
    );

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status endpoint with notifications
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id)
      .populate('buyer')
      .populate('farmer');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.farmer._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    const oldStatus = order.status;
    order.status = status;
    await order.save();

    // Create status update notification for buyer
    if (oldStatus !== status) {
      await Notification.createNotification(
        order.buyer._id,
        'order_updated',
        'Order Status Updated',
        `Your order #${order._id.slice(-8)} status changed from ${oldStatus} to ${status}`,
        order._id,
        'medium'
      );
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get buyer's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.userId })
      .populate('items.product', 'name images price unit category')
      .populate('farmer', 'name email location')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get farmer's orders
router.get('/farmer-orders', auth, async (req, res) => {
  try {
    if (req.user.role !== 'farmer') {
      return res.status(403).json({ message: 'Only farmers can view farmer orders' });
    }

    const orders = await Order.find({ farmer: req.user.userId })
      .populate('items.product', 'name images price unit category')
      .populate('buyer', 'name email location')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images price unit category')
      .populate('buyer', 'name email location')
      .populate('farmer', 'name email location');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to view this order
    if (order.buyer._id.toString() !== req.user.userId && order.farmer._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status (farmer only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.farmer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    order.status = status;
    await order.save();

     // Populate before sending response
    await order.populate('items.product', 'name images price unit');
    await order.populate('buyer', 'name email location');

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;