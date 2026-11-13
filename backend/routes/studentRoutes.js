const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Converts Mongoose / Mongo errors into a consistent response
function handleError(err, res) {
  if (err.name === "ValidationError") {
    const errors = {};
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
    return res.status(400).json({ message: "Validation failed", errors });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0] || "field";
    const label = field === "rollNumber" ? "Roll number" : "Email";
    return res.status(409).json({
      message: `${label} already exists`,
      errors: { [field]: `${label} already exists` },
    });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid student ID" });
  }
  console.error(err);
  return res.status(500).json({ message: "Server error" });
}

// GET /api/students/stats  -> dashboard summary
router.get("/stats", async (req, res) => {
  try {
    const [overall] = await Student.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgCgpa: { $avg: "$cgpa" },
          avgAttendance: { $avg: "$attendance" },
        },
      },
    ]);

    const byDepartment = await Student.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
          avgCgpa: { $avg: "$cgpa" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      total: overall ? overall.total : 0,
      avgCgpa: overall ? Number(overall.avgCgpa.toFixed(2)) : 0,
      avgAttendance: overall ? Number(overall.avgAttendance.toFixed(1)) : 0,
      byDepartment: byDepartment.map((d) => ({
        department: d._id,
        count: d.count,
        avgCgpa: Number(d.avgCgpa.toFixed(2)),
      })),
    });
  } catch (err) {
    handleError(err, res);
  }
});

// GET /api/students?search=&department=
router.get("/", async (req, res) => {
  try {
    const { search, department } = req.query;
    const filter = {};

    if (department) filter.department = department;
    if (search) {
      const regex = new RegExp(escapeRegex(search.trim()), "i");
      filter.$or = [{ name: regex }, { rollNumber: regex }];
    }

    const students = await Student.find(filter).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    handleError(err, res);
  }
});

// GET /api/students/:id
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    handleError(err, res);
  }
});

// POST /api/students
router.post("/", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    handleError(err, res);
  }
});

// PUT /api/students/:id
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    handleError(err, res);
  }
});

// DELETE /api/students/:id
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = router;
