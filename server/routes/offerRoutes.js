/**
 * Offer Routes - InternVerify
 * Internship/Job offers from companies, accept/reject by students
 */
const express = require("express");
const Offer = require("../models/Offer");
const Notification = require("../models/Notification");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

// Company: Create offer for a student
router.post(
  "/",
  protect,
  restrictTo("company"),
  async (req, res) => {
    try {
      const { studentId, offerType, title, description } = req.body;

      if (!studentId || !title) {
        return res.status(400).json({
          message: "Student and title are required",
        });
      }

      const offer = await Offer.create({
        issuedBy: req.user._id,
        student: studentId,
        offerType: offerType || "internship",
        title,
        description: description || null,
        companyName: req.user.companyName || req.user.name,
      });

      await Notification.create({
        user: studentId,
        type: "offer",
        title: "New Offer",
        message: `${req.user.name} has sent you an offer: ${title}`,
        relatedId: offer._id,
        relatedModel: "Offer",
      });

      res.status(201).json({ message: "Offer sent", offer });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to create offer" });
    }
  }
);

// Student: Get my offers
router.get("/my", protect, restrictTo("student"), async (req, res) => {
  const offers = await Offer.find({ student: req.user._id })
    .populate("issuedBy", "name companyName")
    .sort({ createdAt: -1 })
    .lean();

  res.json(offers);
});

// Student: Accept offer
router.post(
  "/:id/accept",
  protect,
  restrictTo("student"),
  async (req, res) => {
    const offer = await Offer.findOne({
      _id: req.params.id,
      student: req.user._id,
      status: "pending",
    });

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    offer.status = "accepted";
    await offer.save();

    await Notification.create({
      user: offer.issuedBy,
      type: "offer",
      title: "Offer Accepted",
      message: `${req.user.name} has accepted your offer`,
      relatedId: offer._id,
      relatedModel: "Offer",
    });

    res.json({ message: "Offer accepted", offer });
  }
);

// Student: Reject offer
router.post(
  "/:id/reject",
  protect,
  restrictTo("student"),
  async (req, res) => {
    const offer = await Offer.findOne({
      _id: req.params.id,
      student: req.user._id,
      status: "pending",
    });

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    offer.status = "rejected";
    await offer.save();

    res.json({ message: "Offer rejected", offer });
  }
);

// Company: Get offers sent (to see accept/reject status)
router.get(
  "/sent",
  protect,
  restrictTo("company"),
  async (req, res) => {
    const offers = await Offer.find({ issuedBy: req.user._id })
      .populate("student", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.json(offers);
  }
);

module.exports = router;
