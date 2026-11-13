// Optional: fills the database with 12 demo students.  Run: npm run seed --prefix backend
require("dotenv").config();
const mongoose = require("mongoose");
const Student = require("./models/Student");

const students = [
  ["Aarav Sharma", "21CSE101", "aarav.sharma@college.edu", "CSE", 6, "9876543210", 8.7, 92],
  ["Priya Verma", "21CSE102", "priya.verma@college.edu", "CSE", 6, "9876543211", 9.1, 95],
  ["Rohan Gupta", "21CSE103", "rohan.gupta@college.edu", "CSE", 6, "9876543212", 7.4, 78],
  ["Simran Kaur", "21IT201", "simran.kaur@college.edu", "IT", 6, "9876543213", 8.2, 88],
  ["Harpreet Singh", "21IT202", "harpreet.singh@college.edu", "IT", 6, "9876543214", 6.8, 71],
  ["Neha Jain", "21IT203", "neha.jain@college.edu", "IT", 4, "9876543215", 7.9, 84],
  ["Karan Mehta", "21ECE301", "karan.mehta@college.edu", "ECE", 6, "9876543216", 7.1, 69],
  ["Anjali Rao", "21ECE302", "anjali.rao@college.edu", "ECE", 4, "9876543217", 8.5, 90],
  ["Vikram Patel", "21ME401", "vikram.patel@college.edu", "ME", 6, "9876543218", 6.4, 62],
  ["Divya Nair", "21ME402", "divya.nair@college.edu", "ME", 2, "9876543219", 7.7, 80],
  ["Arjun Malhotra", "21AIDS501", "arjun.malhotra@college.edu", "AIDS", 4, "9876543220", 9.3, 97],
  ["Meera Iyer", "21EEE601", "meera.iyer@college.edu", "EEE", 6, "9876543221", 8.0, 86],
].map(([name, rollNumber, email, department, semester, phone, cgpa, attendance]) => ({
  name, rollNumber, email, department, semester, phone, cgpa, attendance,
}));

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Student.deleteMany({});
    await Student.insertMany(students);
    console.log(`Seeded ${students.length} students`);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
