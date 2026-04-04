import 'dotenv/config';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Course from '../models/Course.js';
import Fee from '../models/Fee.js';
import Announcement from '../models/Announcement.js';

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/erp_admin';

// ─── Seed Data ─────────────────────────────────────────────

const adminData = {
  name: process.env.SEED_ADMIN_NAME || 'Super Admin',
  username: process.env.SEED_ADMIN_USERNAME || process.env.SUPERADMIN_USERNAME || 'superadmin',
  email: process.env.SEED_ADMIN_EMAIL || process.env.SUPERADMIN_EMAIL || 'superadmin@erp-system.com',
  password: process.env.SEED_ADMIN_PASSWORD || process.env.SUPERADMIN_PASSWORD || 'Admin@1234',
  role: 'superadmin',
  department: 'Administration',
  isActive: true,
};

const departments = ['Computer Science', 'Electronics', 'Mechanical Engineering', 'Mathematics', 'Physics', 'Business Administration'];

const studentsData = [
  { rollNo: 'CS2024001', name: 'Aarav Sharma', email: 'aarav.s@uni.edu', phone: '9876543210', department: 'Computer Science', year: '3rd Year', semester: 5, cgpa: 8.9, status: 'Active', feeStatus: 'Paid', gender: 'Male' },
  { rollNo: 'CS2024002', name: 'Priya Verma', email: 'priya.v@uni.edu', phone: '9876543211', department: 'Computer Science', year: '2nd Year', semester: 3, cgpa: 9.1, status: 'Active', feeStatus: 'Pending', gender: 'Female' },
  { rollNo: 'EC2023015', name: 'Rohit Nayak', email: 'rohit.n@uni.edu', phone: '9876543212', department: 'Electronics', year: '4th Year', semester: 7, cgpa: 7.8, status: 'Active', feeStatus: 'Paid', gender: 'Male' },
  { rollNo: 'ME2024008', name: 'Sneha Patil', email: 'sneha.p@uni.edu', phone: '9876543213', department: 'Mechanical Engineering', year: '1st Year', semester: 1, cgpa: 8.2, status: 'Active', feeStatus: 'Paid', gender: 'Female' },
  { rollNo: 'BA2023022', name: 'Kiran Das', email: 'kiran.d@uni.edu', phone: '9876543214', department: 'Business Administration', year: '2nd Year', semester: 3, cgpa: 7.5, status: 'Inactive', feeStatus: 'Pending', gender: 'Male' },
  { rollNo: 'CS2024003', name: 'Meera Joshi', email: 'meera.j@uni.edu', phone: '9876543215', department: 'Computer Science', year: '3rd Year', semester: 5, cgpa: 9.4, status: 'Active', feeStatus: 'Paid', gender: 'Female' },
  { rollNo: 'PH2023010', name: 'Arjun Reddy', email: 'arjun.r@uni.edu', phone: '9876543216', department: 'Physics', year: '2nd Year', semester: 3, cgpa: 8.7, status: 'Active', feeStatus: 'Paid', gender: 'Male' },
  { rollNo: 'MA2024011', name: 'Divya Singh', email: 'divya.s@uni.edu', phone: '9876543217', department: 'Mathematics', year: '1st Year', semester: 1, cgpa: 8.0, status: 'Active', feeStatus: 'Partial', gender: 'Female' },
];

const teachersData = [
  { facultyId: 'FAC001', name: 'Dr. Ramesh Kumar', email: 'r.kumar@uni.edu', phone: '9800000001', department: 'Computer Science', designation: 'Professor', subjects: ['DBMS', 'Algorithms'], experienceYears: 14, rating: 4.8, status: 'Active', gender: 'Male' },
  { facultyId: 'FAC002', name: 'Prof. Neha Verma', email: 'n.verma@uni.edu', phone: '9800000002', department: 'Computer Science', designation: 'Assistant Professor', subjects: ['Operating Systems', 'Networks'], experienceYears: 7, rating: 4.6, status: 'Active', gender: 'Female' },
  { facultyId: 'FAC003', name: 'Dr. Suresh Panda', email: 's.panda@uni.edu', phone: '9800000003', department: 'Electronics', designation: 'Associate Professor', subjects: ['Digital Electronics', 'VLSI'], experienceYears: 11, rating: 4.5, status: 'Active', gender: 'Male' },
  { facultyId: 'FAC004', name: 'Dr. Anita Mishra', email: 'a.mishra@uni.edu', phone: '9800000004', department: 'Mathematics', designation: 'Professor', subjects: ['Calculus', 'Linear Algebra'], experienceYears: 18, rating: 4.9, status: 'Active', gender: 'Female' },
  { facultyId: 'FAC005', name: 'Mr. Vivek Rao', email: 'v.rao@uni.edu', phone: '9800000005', department: 'Business Administration', designation: 'Lecturer', subjects: ['Marketing', 'Management'], experienceYears: 4, rating: 4.2, status: 'On Leave', gender: 'Male' },
  { facultyId: 'FAC006', name: 'Dr. Priya Nair', email: 'p.nair@uni.edu', phone: '9800000006', department: 'Physics', designation: 'Assistant Professor', subjects: ['Quantum Physics', 'Optics'], experienceYears: 9, rating: 4.7, status: 'Active', gender: 'Female' },
];

// ─── Seeder Function ────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    // Drop existing data
    await Promise.all([
      Admin.deleteMany({}),
      Student.deleteMany({}),
      Teacher.deleteMany({}),
      Course.deleteMany({}),
      Fee.deleteMany({}),
      Announcement.deleteMany({}),
    ]);
    console.log('🗑  Cleared existing data');

    // Seed Admin
    const admin = await Admin.create(adminData);
    console.log(`👤 Admin created: ${admin.username} / ${process.env.SEED_ADMIN_PASSWORD || 'admin@123'}`);

    // Seed Students
    const students = await Student.insertMany(studentsData);
    console.log(`🎓 ${students.length} students seeded`);

    // Seed Teachers
    const teachers = await Teacher.insertMany(teachersData);
    console.log(`👩‍🏫 ${teachers.length} teachers seeded`);

    // Seed Courses (linked to first teacher)
    const coursesData = [
      { code: 'CS301', name: 'Data Structures & Algorithms', department: 'Computer Science', credits: 4, semester: '5th', faculty: teachers[0]._id, enrolledStudents: 82, capacity: 90, status: 'Active', academicYear: '2024-25' },
      { code: 'CS302', name: 'Database Management Systems', department: 'Computer Science', credits: 3, semester: '5th', faculty: teachers[1]._id, enrolledStudents: 78, capacity: 85, status: 'Active', academicYear: '2024-25' },
      { code: 'EC201', name: 'Digital Electronics', department: 'Electronics', credits: 4, semester: '3rd', faculty: teachers[2]._id, enrolledStudents: 60, capacity: 75, status: 'Active', academicYear: '2024-25' },
      { code: 'MA101', name: 'Engineering Mathematics I', department: 'Mathematics', credits: 4, semester: '1st', faculty: teachers[3]._id, enrolledStudents: 200, capacity: 220, status: 'Active', academicYear: '2024-25' },
      { code: 'CS401', name: 'Machine Learning', department: 'Computer Science', credits: 3, semester: '7th', faculty: teachers[0]._id, enrolledStudents: 45, capacity: 50, status: 'Active', academicYear: '2024-25' },
    ];
    const courses = await Course.insertMany(coursesData);
    console.log(`📚 ${courses.length} courses seeded`);

    // Seed Fee records
    const feesData = students.slice(0, 5).map((s, i) => ({
      student: s._id,
      totalAmount: 45000,
      paidAmount: i % 3 === 1 ? 0 : i % 3 === 2 ? 22500 : 45000,
      feeType: 'Tuition Fee',
      academicYear: '2024-25',
      semester: 1,
      status: i % 3 === 1 ? 'Pending' : i % 3 === 2 ? 'Partial' : 'Paid',
      paymentDate: i % 3 !== 1 ? new Date() : null,
      paymentMode: 'Online',
    }));
    await Fee.insertMany(feesData);
    console.log(`💰 ${feesData.length} fee records seeded`);

    // Seed Announcements
    const announcementsData = [
      { title: 'Mid-Semester Exam Schedule Released', content: 'The mid-semester examination schedule for all departments has been released. Students are advised to check the timetable.', category: 'Examinations', priority: 'High', audience: 'Students', status: 'Published', publishedAt: new Date(), createdBy: admin._id },
      { title: 'Fee Payment Deadline Extended to March 31', content: 'The deadline for semester fee payment has been extended to March 31, 2026. Kindly ensure timely payment to avoid penalties.', category: 'Finance', priority: 'High', audience: 'Students', status: 'Published', publishedAt: new Date(), createdBy: admin._id },
      { title: 'Annual Sports Day Registration Open', content: 'Registrations for the Annual Sports Day are now open. Students can register at the Sports Department office.', category: 'Events', priority: 'Medium', audience: 'All', status: 'Published', publishedAt: new Date(), createdBy: admin._id },
      { title: 'Faculty Development Program — April Batch', content: 'A faculty development program is scheduled for April 2026. All interested faculty members may register.', category: 'Faculty', priority: 'Medium', audience: 'Faculty', status: 'Draft', createdBy: admin._id },
    ];
    await Announcement.insertMany(announcementsData);
    console.log(`📢 ${announcementsData.length} announcements seeded`);

    console.log('\n✅ Database seeded successfully!');
    console.log('─────────────────────────────────');
    console.log(`  Login → username: admin`);
    console.log(`         password: ${process.env.SEED_ADMIN_PASSWORD || 'admin@123'}`);
    console.log('─────────────────────────────────\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder error:', error.message);
    process.exit(1);
  }
};

seed();
