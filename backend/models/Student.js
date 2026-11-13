const mongoose = require("mongoose");

const DEPARTMENTS = ["CSE", "IT", "ECE", "EEE", "ME", "CE", "AIDS"];

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [60, "Name cannot exceed 60 characters"],
    },
    rollNumber: {
      type: String,
      required: [true, "Roll number is required"],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^[A-Z0-9-]{3,20}$/, "Roll number must be 3-20 letters, digits or hyphens"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: { values: DEPARTMENTS, message: "Invalid department" },
    },
    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: [1, "Semester must be between 1 and 8"],
      max: [8, "Semester must be between 1 and 8"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"],
    },
    cgpa: {
      type: Number,
      required: [true, "CGPA is required"],
      min: [0, "CGPA must be between 0 and 10"],
      max: [10, "CGPA must be between 0 and 10"],
    },
    attendance: {
      type: Number,
      required: [true, "Attendance is required"],
      min: [0, "Attendance must be between 0 and 100"],
      max: [100, "Attendance must be between 0 and 100"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
