/**
 * Notification Routes - InternVerify
 */
const express = require("express");
const Notification = require("../models/Notification");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get my notifications
router.get("/", protect, async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  res.json(notifications);
});

// Mark as read
router.patch("/:id/read", protect, async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  res.json(notification);
});

// Mark all as read
router.patch("/read-all", protect, async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id },
    { read: true }
  );

  res.json({ message: "All marked as read" });
});

module.exports = router;
