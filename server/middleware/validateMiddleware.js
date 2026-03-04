/**
 * Validation Middleware - InternVerify
 * Input validation for API requests
 */

const validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Valid email is required");
  }
  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }
  if (!["student", "college", "company"].includes(role)) {
    errors.push("Valid role is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join("; ") });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }
  next();
};

const validateCertificateUpload = (req, res, next) => {
  const required = [
    "studentName",
    "collegeName",
    "degree",
    "branch",
    "department",
    "companyName",
    "roleInInternship",
    "duration",
  ];
  const missing = required.filter((f) => !req.body[f] || String(req.body[f]).trim() === "");

  if (missing.length > 0) {
    return res
      .status(400)
      .json({ message: `Missing fields: ${missing.join(", ")}` });
  }

  const duration = parseInt(req.body.duration, 10);
  if (isNaN(duration) || duration < 1) {
    return res.status(400).json({ message: "Duration must be a positive number" });
  }

  if (!req.file && !req.body.certificateFile) {
    return res.status(400).json({ message: "Certificate file is required" });
  }

  next();
};

const validateRejection = (req, res, next) => {
  const { reason } = req.body;
  if (!reason || String(reason).trim().length < 5) {
    return res
      .status(400)
      .json({ message: "Rejection reason is required (min 5 characters)" });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateCertificateUpload,
  validateRejection,
};
