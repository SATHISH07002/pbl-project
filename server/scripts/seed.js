/**
 * Seed Script - InternVerify
 * Creates sample users (student, college, company) for testing
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const connectDB = require("../config/db");

const seedUsers = [
  {
    name: "Student Demo",
    email: "student@demo.com",
    password: "password123",
    role: "student",
    rollNumber: "CS2024001",
    degree: "B.Tech",
    branch: "Computer Science",
    department: "CSE",
    collegeName: "Demo Engineering College",
  },
  {
    name: "Demo Engineering College",
    email: "college@demo.com",
    password: "password123",
    role: "college",
    collegeName: "Demo Engineering College",
  },
  {
    name: "Tech Corp Ltd",
    email: "company@demo.com",
    password: "password123",
    role: "company",
    companyName: "Tech Corp Ltd",
  },
  {
    name: "John Student",
    email: "john@student.com",
    password: "password123",
    role: "student",
    rollNumber: "CS2024002",
    degree: "B.Tech",
    branch: "IT",
    department: "IT",
    collegeName: "Demo Engineering College",
  },
  {
    name: "Innovate Solutions",
    email: "innovate@company.com",
    password: "password123",
    role: "company",
    companyName: "Innovate Solutions",
  },
];

async function seed() {
  try {
    await connectDB();

    for (const u of seedUsers) {
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        console.log(`Skip: ${u.email} (exists)`);
        continue;
      }
      const hashed = await bcrypt.hash(u.password, 12);
      const { password, ...rest } = u;
      await User.create({ ...rest, password: hashed });
      console.log(`Created: ${u.email} (${u.role})`);
    }

    console.log("\n✅ Seed completed");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
