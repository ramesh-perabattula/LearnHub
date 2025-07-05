const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const {
      unread_only = false,
      page = 1,
      limit = 20
    } = req.query;

    const query = { user: req.user._id };
    if (unread_only === 'true') {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      read: false
    });

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.read = true;
    await notification.save();

    res.json({
      success: true,
      data: {
        message: 'Notification marked as read'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 