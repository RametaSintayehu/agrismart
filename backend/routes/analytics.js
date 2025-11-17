import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get farmer analytics
router.get('/farmer', auth, async (req, res) => {
  try {
    if (req.user.role !== 'farmer') {
      return res.status(403).json({ message: 'Only farmers can access analytics' });
    }

    const farmerId = req.user.userId;

    // Get date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));

    // Order analytics
    const totalOrders = await Order.countDocuments({ farmer: farmerId });
    const pendingOrders = await Order.countDocuments({ 
      farmer: farmerId, 
      status: 'pending' 
    });
    const completedOrders = await Order.countDocuments({ 
      farmer: farmerId, 
      status: 'delivered' 
    });

    // Revenue analytics
    const revenueData = await Order.aggregate([
      {
        $match: { 
          farmer: mongoose.Types.ObjectId(farmerId),
          status: 'delivered',
          createdAt: { $gte: ninetyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Product performance
    const productPerformance = await Order.aggregate([
      {
        $match: { 
          farmer: mongoose.Types.ObjectId(farmerId),
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          productName: '$product.name',
          totalSold: 1,
          totalRevenue: 1,
          category: '$product.category'
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ]);

    // Customer insights
    const topCustomers = await Order.aggregate([
      {
        $match: { 
          farmer: mongoose.Types.ObjectId(farmerId),
          createdAt: { $gte: ninetyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$buyer',
          totalSpent: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'buyer'
        }
      },
      { $unwind: '$buyer' },
      {
        $project: {
          buyerName: '$buyer.name',
          totalSpent: 1,
          orderCount: 1
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      overview: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: revenueData.reduce((sum, item) => sum + item.revenue, 0)
      },
      revenueData,
      productPerformance,
      topCustomers
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get platform-wide analytics (admin only)
router.get('/platform', auth, async (req, res) => {
  try {
    // In a real app, you'd check for admin role
    if (req.user.role !== 'farmer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const recentOrders = await Order.find()
      .populate('buyer', 'name')
      .populate('farmer', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      platformStats: {
        totalFarmers,
        totalBuyers,
        totalProducts,
        totalOrders
      },
      recentOrders
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;