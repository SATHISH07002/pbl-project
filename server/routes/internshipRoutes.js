/**
 * Internship Routes - InternVerify
 * Certificate upload, approval workflow, verification
 */
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");
const path = require("path");
const Internship = require("../models/Internship");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  validateCertificateUpload,
  validateRejection,
} = require("../middleware/validateMiddleware");

const router = express.Router();

// Helper: Create notification
const createNotification = async (userId, type, title, message, relatedId, relatedModel) => {
  await Notification.create({
    user: userId,
    type,
    title,
    message,
    relatedId,
    relatedModel,
  });
};

// ---------- STUDENT ROUTES ----------

// Submit certificate (student only)
router.post(
  "/submit",
  protect,
  restrictTo("student"),
  upload.single("certificateFile"),
  validateCertificateUpload,
  async (req, res) => {
    try {
      const {
        studentName,
        collegeName,
        degree,
        branch,
        department,
        companyName,
        roleInInternship,
        duration,
        stipend,
        workExperience,
        collegeId,
        companyId,
      } = req.body;

      // Resolve college and company users
      let collegeUser = null;
      let companyUser = null;

      if (collegeId) {
        collegeUser = await User.findOne({ _id: collegeId, role: "college" });
      }
      if (!collegeUser) {
        collegeUser = await User.findOne({
          role: "college",
          $or: [{ name: collegeName }, { collegeName }],
        });
      }

      if (companyId) {
        companyUser = await User.findOne({ _id: companyId, role: "company" });
      }
      if (!companyUser) {
        companyUser = await User.findOne({
          role: "company",
          $or: [{ name: companyName }, { companyName }],
        });
      }

      if (!collegeUser || !companyUser) {
        return res.status(400).json({
          message:
            "College or Company not found. Please ensure they are registered on the platform.",
        });
      }

      const certificateFile = req.file ? req.file.filename : req.body.certificateFile;
      if (!certificateFile) {
        return res.status(400).json({ message: "Certificate file is required" });
      }

      const internship = await Internship.create({
        student: req.user._id,
        college: collegeUser._id,
        company: companyUser._id,
        certificateFile,
        studentName,
        collegeName,
        degree,
        branch,
        department,
        companyName,
        roleInInternship,
        duration: parseInt(duration, 10),
        stipend: stipend || null,
        workExperience: workExperience || null,
        status: "pending_college",
      });

      await createNotification(
        collegeUser._id,
        "approval",
        "New certificate pending approval",
        `${studentName} has submitted a certificate for verification`,
        internship._id,
        "Internship"
      );

      res.status(201).json({
        message: "Certificate submitted. Pending college approval.",
        internship,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Submission failed",
      });
    }
  }
);

// Get my internships (student)
router.get("/my", protect, restrictTo("student"), async (req, res) => {
  const internships = await Internship.find({ student: req.user._id })
    .populate("college", "name collegeName")
    .populate("company", "name companyName")
    .sort({ createdAt: -1 })
    .lean();

  res.json(internships);
});

// ---------- COLLEGE ROUTES ----------

// Dashboard stats (college)
router.get(
  "/college/stats",
  protect,
  restrictTo("college"),
  async (req, res) => {
    const collegeId = req.user._id;

    const [ongoing, pending, approved, rejected] = await Promise.all([
      Internship.countDocuments({
        college: collegeId,
        status: { $in: ["pending_college", "pending_company"] },
      }),
      Internship.countDocuments({
        college: collegeId,
        status: "pending_college",
      }),
      Internship.countDocuments({
        college: collegeId,
        status: "approved",
      }),
      Internship.countDocuments({
        college: collegeId,
        status: "rejected_college",
      }),
    ]);

    res.json({
      totalStudentsOngoing: ongoing,
      totalPendingApprovals: pending,
      totalApproved: approved,
      totalRejected: rejected,
    });
  }
);

// Pending approvals (college)
router.get(
  "/college/pending",
  protect,
  restrictTo("college"),
  async (req, res) => {
    const list = await Internship.find({
      college: req.user._id,
      status: "pending_college",
    })
      .populate("student", "name email rollNumber degree branch department collegeName")
      .populate("company", "name companyName")
      .sort({ createdAt: -1 })
      .lean();

    res.json(list);
  }
);

// College approve
router.post(
  "/college/:id/approve",
  protect,
  restrictTo("college"),
  async (req, res) => {
    const internship = await Internship.findOne({
      _id: req.params.id,
      college: req.user._id,
      status: "pending_college",
    });

    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    internship.status = "pending_company";
    internship.rejectionReason = null;
    await internship.save();

    await createNotification(
      internship.student,
      "approval",
      "College approved",
      "Your certificate has been approved by the college.",
      internship._id,
      "Internship"
    );

    await createNotification(
      internship.company,
      "approval",
      "Certificate pending company approval",
      `${internship.studentName}'s certificate is pending your approval`,
      internship._id,
      "Internship"
    );

    res.json({
      message: "Approved. Now pending company approval.",
      internship,
    });
  }
);

// College reject
router.post(
  "/college/:id/reject",
  protect,
  restrictTo("college"),
  validateRejection,
  async (req, res) => {
    const internship = await Internship.findOne({
      _id: req.params.id,
      college: req.user._id,
      status: "pending_college",
    });

    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    internship.status = "rejected_college";
    internship.rejectionReason = req.body.reason;
    await internship.save();

    await createNotification(
      internship.student,
      "rejection",
      "Rejected by College",
      req.body.reason,
      internship._id,
      "Internship"
    );

    res.json({
      message: "Rejected",
      internship,
    });
  }
);

// Rejected list (college)
router.get(
  "/college/rejected",
  protect,
  restrictTo("college"),
  async (req, res) => {
    const list = await Internship.find({
      college: req.user._id,
      status: "rejected_college",
    })
      .populate("student", "name rollNumber")
      .sort({ createdAt: -1 })
      .lean();

    res.json(list);
  }
);

// ---------- COMPANY ROUTES ----------

// Dashboard stats (company)
router.get(
  "/company/stats",
  protect,
  restrictTo("company"),
  async (req, res) => {
    const companyId = req.user._id;

    const [completed, yetToComplete, pending, rejected] = await Promise.all([
      Internship.countDocuments({
        company: companyId,
        status: "approved",
      }),
      Internship.countDocuments({
        company: companyId,
        status: { $in: ["pending_college", "pending_company"] },
      }),
      Internship.countDocuments({
        company: companyId,
        status: "pending_company",
      }),
      Internship.countDocuments({
        company: companyId,
        status: "rejected_company",
      }),
    ]);

    res.json({
      totalInternsCompleted: completed,
      yetToComplete,
      pendingApproval: pending,
      rejected,
    });
  }
);

// Pending approvals (company)
router.get(
  "/company/pending",
  protect,
  restrictTo("company"),
  async (req, res) => {
    const list = await Internship.find({
      company: req.user._id,
      status: "pending_company",
    })
      .populate("student", "name email rollNumber degree branch collegeName")
      .populate("college", "name collegeName")
      .sort({ createdAt: -1 })
      .lean();

    res.json(list);
  }
);

// Company approve - generates Certificate ID + QR
router.post(
  "/company/:id/approve",
  protect,
  restrictTo("company"),
  async (req, res) => {
    const internship = await Internship.findOne({
      _id: req.params.id,
      company: req.user._id,
      status: "pending_company",
    });

    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    const certificateId = uuidv4();
    const baseUrl = process.env.FRONTEND_URL || process.env.API_URL || "http://localhost:5173";
    const verifyUrl = `${baseUrl.replace(/\/$/, "")}/verify/${certificateId}`;

    let qrCodeDataUrl = null;
    try {
      qrCodeDataUrl = await QRCode.toDataURL(verifyUrl);
    } catch (qrErr) {
      console.error("QR generation error:", qrErr);
    }

    internship.status = "approved";
    internship.certificateId = certificateId;
    internship.qrCode = qrCodeDataUrl;
    internship.verifiedAt = new Date();
    internship.rejectionReason = null;
    await internship.save();

    await createNotification(
      internship.student,
      "certificate",
      "Certificate Verified",
      `Your certificate has been fully verified. ID: ${certificateId}`,
      internship._id,
      "Internship"
    );

    res.json({
      message: "Approved. Certificate verified.",
      internship,
    });
  }
);

// Company reject
router.post(
  "/company/:id/reject",
  protect,
  restrictTo("company"),
  validateRejection,
  async (req, res) => {
    const internship = await Internship.findOne({
      _id: req.params.id,
      company: req.user._id,
      status: "pending_company",
    });

    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    internship.status = "rejected_company";
    internship.rejectionReason = req.body.reason;
    await internship.save();

    await createNotification(
      internship.student,
      "rejection",
      "Rejected by Company",
      req.body.reason,
      internship._id,
      "Internship"
    );

    res.json({
      message: "Rejected",
      internship,
    });
  }
);

// Rejected list (company)
router.get(
  "/company/rejected",
  protect,
  restrictTo("company"),
  async (req, res) => {
    const list = await Internship.find({
      company: req.user._id,
      status: "rejected_company",
    })
      .populate("student", "name")
      .sort({ createdAt: -1 })
      .lean();

    res.json(list);
  }
);

// ---------- PUBLIC VERIFICATION ----------

// GET /api/internships/verify/:certificateId (public, no auth)
router.get("/verify/:certificateId", async (req, res) => {
  const internship = await Internship.findOne({
    certificateId: req.params.certificateId,
    status: "approved",
  }).lean();

  if (!internship) {
    return res.status(404).json({
      valid: false,
      message: "Certificate Not Found / Invalid",
    });
  }

  res.json({
    valid: true,
    studentName: internship.studentName,
    college: internship.collegeName,
    company: internship.companyName,
    role: internship.roleInInternship,
    duration: internship.duration,
    verifiedAt: internship.verifiedAt,
  });
});

// Serve uploaded files (certificates)
router.get("/file/:filename", (req, res) => {
  const uploadsPath = path.join(__dirname, "..", "uploads");
  res.sendFile(path.join(uploadsPath, req.params.filename), (err) => {
    if (err) res.status(404).json({ message: "File not found" });
  });
});

module.exports = router;
