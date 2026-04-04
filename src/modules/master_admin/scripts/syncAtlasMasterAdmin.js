import 'dotenv/config';
import mongoose from 'mongoose';

import AcademicEnrollmentDraft from '../models/AcademicEnrollmentDraft.js';
import AcademicPlan from '../models/AcademicPlan.js';
import Admin from '../models/Admin.js';
import Announcement from '../models/Announcement.js';
import AppSetting from '../models/AppSetting.js';
import Course from '../models/Course.js';
import CurriculumPlan from '../models/CurriculumPlan.js';
import ExamSchedule from '../models/ExamSchedule.js';
import Fee from '../models/Fee.js';
import FinanceTransaction from '../models/FinanceTransaction.js';
import LeaveRequest from '../models/LeaveRequest.js';
import Payroll from '../models/Payroll.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/AYRAERP';

const superadminCredentials = {
  name: 'Super Admin',
  username: process.env.SUPERADMIN_USERNAME || 'superadmin',
  email: process.env.SUPERADMIN_EMAIL || 'superadmin@erp-system.com',
  password: process.env.SUPERADMIN_PASSWORD || 'Admin@1234',
};

const admins = [
  { name: superadminCredentials.name, username: superadminCredentials.username, email: superadminCredentials.email, password: superadminCredentials.password, role: 'superadmin', department: 'Administration', phone: '9000000001' },
  { name: 'Aditi Finance', username: 'aditi.finance', email: 'aditi.finance@myayra.in', password: 'Admin@1234', role: 'admin', department: 'Accounts', phone: '9000000002' },
  { name: 'Rohan Academics', username: 'rohan.academics', email: 'rohan.academics@myayra.in', password: 'Admin@1234', role: 'admin', department: 'Academics', phone: '9000000003' },
  { name: 'Megha HR', username: 'megha.hr', email: 'megha.hr@myayra.in', password: 'Admin@1234', role: 'admin', department: 'Human Resources', phone: '9000000004' },
  { name: 'Karan Ops', username: 'karan.ops', email: 'karan.ops@myayra.in', password: 'Admin@1234', role: 'staff', department: 'Operations', phone: '9000000005' },
  { name: 'Isha Support', username: 'isha.support', email: 'isha.support@myayra.in', password: 'Admin@1234', role: 'staff', department: 'Support', phone: '9000000006' },
];

const teachers = [
  { facultyId: 'FAC001', name: 'Dr. Ramesh Kumar', email: 'r.kumar@myayra.in', phone: '9800000001', department: 'Computer Science', designation: 'Professor', subjects: ['DBMS', 'Algorithms'], experienceYears: 14, rating: 4.8, status: 'Active', gender: 'Male', accountStatus: 'Active', portalUsername: 'r.kumar@myayra.in' },
  { facultyId: 'FAC002', name: 'Prof. Neha Verma', email: 'n.verma@myayra.in', phone: '9800000002', department: 'Computer Science', designation: 'Assistant Professor', subjects: ['Operating Systems', 'Networks'], experienceYears: 7, rating: 4.6, status: 'Active', gender: 'Female', accountStatus: 'Active', portalUsername: 'n.verma@myayra.in' },
  { facultyId: 'FAC003', name: 'Dr. Suresh Panda', email: 's.panda@myayra.in', phone: '9800000003', department: 'Electronics', designation: 'Associate Professor', subjects: ['Digital Electronics', 'VLSI'], experienceYears: 11, rating: 4.5, status: 'Active', gender: 'Male', accountStatus: 'Pending Setup', portalUsername: 's.panda@myayra.in' },
  { facultyId: 'FAC004', name: 'Dr. Anita Mishra', email: 'a.mishra@myayra.in', phone: '9800000004', department: 'Mathematics', designation: 'Professor', subjects: ['Calculus', 'Linear Algebra'], experienceYears: 18, rating: 4.9, status: 'Active', gender: 'Female', accountStatus: 'Active', portalUsername: 'a.mishra@myayra.in' },
  { facultyId: 'FAC005', name: 'Mr. Vivek Rao', email: 'v.rao@myayra.in', phone: '9800000005', department: 'Business Administration', designation: 'Lecturer', subjects: ['Marketing', 'Management'], experienceYears: 4, rating: 4.2, status: 'On Leave', gender: 'Male', accountStatus: 'Active', portalUsername: 'v.rao@myayra.in' },
  { facultyId: 'FAC006', name: 'Dr. Priya Nair', email: 'p.nair@myayra.in', phone: '9800000006', department: 'Physics', designation: 'Assistant Professor', subjects: ['Quantum Physics', 'Optics'], experienceYears: 9, rating: 4.7, status: 'Active', gender: 'Female', accountStatus: 'Password Reset Required', portalUsername: 'p.nair@myayra.in' },
  { facultyId: 'FAC007', name: 'Dr. Arjun Sen', email: 'a.sen@myayra.in', phone: '9800000007', department: 'Mechanical Engineering', designation: 'Associate Professor', subjects: ['Thermodynamics', 'Design'], experienceYears: 10, rating: 4.4, status: 'Active', gender: 'Male', accountStatus: 'Active', portalUsername: 'a.sen@myayra.in' },
  { facultyId: 'FAC008', name: 'Prof. Ishita Paul', email: 'i.paul@myayra.in', phone: '9800000008', department: 'Civil Engineering', designation: 'Assistant Professor', subjects: ['Surveying', 'Structures'], experienceYears: 6, rating: 4.3, status: 'Active', gender: 'Female', accountStatus: 'Active', portalUsername: 'i.paul@myayra.in' },
];

const students = [
  { rollNo: 'CS2024001', name: 'Aarav Sharma', email: 'aarav.sharma@myayra.in', phone: '9876543201', department: 'Computer Science', year: '3rd Year', semester: 5, cgpa: 8.9, status: 'Active', feeStatus: 'Paid', gender: 'Male', section: 'A' },
  { rollNo: 'CS2024002', name: 'Priya Verma', email: 'priya.verma@myayra.in', phone: '9876543202', department: 'Computer Science', year: '2nd Year', semester: 3, cgpa: 9.1, status: 'Active', feeStatus: 'Pending', gender: 'Female', section: 'A' },
  { rollNo: 'EC2023015', name: 'Rohit Nayak', email: 'rohit.nayak@myayra.in', phone: '9876543203', department: 'Electronics', year: '4th Year', semester: 7, cgpa: 7.8, status: 'Active', feeStatus: 'Paid', gender: 'Male', section: 'B' },
  { rollNo: 'ME2024008', name: 'Sneha Patil', email: 'sneha.patil@myayra.in', phone: '9876543204', department: 'Mechanical Engineering', year: '1st Year', semester: 1, cgpa: 8.2, status: 'Active', feeStatus: 'Paid', gender: 'Female', section: 'A' },
  { rollNo: 'BA2023022', name: 'Kiran Das', email: 'kiran.das@myayra.in', phone: '9876543205', department: 'Business Administration', year: '2nd Year', semester: 3, cgpa: 7.5, status: 'Inactive', feeStatus: 'Pending', gender: 'Male', section: 'C' },
  { rollNo: 'CS2024003', name: 'Meera Joshi', email: 'meera.joshi@myayra.in', phone: '9876543206', department: 'Computer Science', year: '3rd Year', semester: 5, cgpa: 9.4, status: 'Active', feeStatus: 'Paid', gender: 'Female', section: 'B' },
  { rollNo: 'PH2023010', name: 'Arjun Reddy', email: 'arjun.reddy@myayra.in', phone: '9876543207', department: 'Physics', year: '2nd Year', semester: 3, cgpa: 8.7, status: 'Active', feeStatus: 'Paid', gender: 'Male', section: 'A' },
  { rollNo: 'MA2024011', name: 'Divya Singh', email: 'divya.singh@myayra.in', phone: '9876543208', department: 'Mathematics', year: '1st Year', semester: 1, cgpa: 8.0, status: 'Active', feeStatus: 'Partial', gender: 'Female', section: 'A' },
  { rollNo: 'CE2024012', name: 'Rahul Patra', email: 'rahul.patra@myayra.in', phone: '9876543209', department: 'Civil Engineering', year: '1st Year', semester: 1, cgpa: 7.9, status: 'Active', feeStatus: 'Pending', gender: 'Male', section: 'A' },
  { rollNo: 'CS2024013', name: 'Ishita Dey', email: 'ishita.dey@myayra.in', phone: '9876543210', department: 'Computer Science', year: '1st Year', semester: 1, cgpa: 8.4, status: 'Active', feeStatus: 'Pending', gender: 'Female', section: 'C' },
  { rollNo: 'EE2024014', name: 'Monojit Kar', email: 'monojit.kar@myayra.in', phone: '9876543211', department: 'Electronics', year: '1st Year', semester: 1, cgpa: 7.6, status: 'Active', feeStatus: 'Paid', gender: 'Male', section: 'B' },
  { rollNo: 'MBA2024005', name: 'Ananya Ghosh', email: 'ananya.ghosh@myayra.in', phone: '9876543212', department: 'Business Administration', year: '1st Year', semester: 1, cgpa: 8.8, status: 'Active', feeStatus: 'Pending', gender: 'Female', section: 'A' },
];

const salaryByFacultyId = {
  FAC001: 98000,
  FAC002: 72000,
  FAC003: 86000,
  FAC004: 99000,
  FAC005: 52000,
  FAC006: 76000,
  FAC007: 83000,
  FAC008: 70000,
};

async function resetCollections() {
  await Promise.all([
    Fee.deleteMany({}),
    ExamSchedule.deleteMany({}),
    Payroll.deleteMany({}),
    FinanceTransaction.deleteMany({}),
    LeaveRequest.deleteMany({}),
    Announcement.deleteMany({}),
    Course.deleteMany({}),
    Student.deleteMany({}),
    Teacher.deleteMany({}),
    AcademicEnrollmentDraft.deleteMany({}),
    AcademicPlan.deleteMany({}),
    CurriculumPlan.deleteMany({}),
    AppSetting.deleteMany({}),
    Admin.deleteMany({}),
  ]);
}

function calculatePayrollFigures(basicSalary, monthIndex) {
  const allowances = {
    hra: Math.round(basicSalary * 0.2),
    da: Math.round(basicSalary * 0.1),
    travelAllowance: 3500,
    medicalAllowance: 2000,
    bonus: monthIndex === 1 ? 2500 : 0,
    extraShiftPay: monthIndex === 0 ? 1000 : 0,
  };
  const totalAllowances = Object.values(allowances).reduce((sum, value) => sum + value, 0);

  const deductions = {
    pf: Math.round(basicSalary * 0.12),
    esi: 1500,
    tax: Math.round(basicSalary * 0.08),
    loanDeduction: monthIndex === 1 ? 1200 : 0,
    otherDeductions: 800,
    lossOfPayAmount: 0,
  };
  const totalDeductions = Object.values(deductions).reduce((sum, value) => sum + value, 0);
  const grossSalary = basicSalary + totalAllowances;
  const netSalary = grossSalary - totalDeductions;

  return { allowances, deductions, totalAllowances, totalDeductions, grossSalary, netSalary };
}

async function seedExactDataset() {
  const createdAdmins = [];
  for (const admin of admins) {
    createdAdmins.push(
      await Admin.create({
        ...admin,
        isActive: true,
        isDeleted: false,
        lastLogin: null,
        lastActivityAt: new Date(),
      }),
    );
  }

  const superadmin = createdAdmins.find((admin) => admin.username === superadminCredentials.username);

  await AppSetting.create({
    key: 'portal-access',
    portalAccess: {
      accounts: true,
      hr: true,
      academics: true,
      masterAdmin: true,
    },
    updatedBy: superadmin?._id || null,
  });

  const createdTeachers = await Teacher.insertMany(teachers);
  const teacherByFacultyId = new Map(createdTeachers.map((teacher) => [teacher.facultyId, teacher]));

  const createdStudents = await Student.insertMany(
    students.map((student) => ({
      ...student,
      admissionDate: new Date('2025-07-01T00:00:00.000Z'),
      feePerSemester: 45000,
      durationYears: 4,
      programId: `${student.department.toLowerCase().replace(/[^a-z]+/g, '-')}-program`,
      programName: student.department,
      guardian: {
        name: `${student.name.split(' ')[0]} Guardian`,
        relation: 'Parent',
        phone: `9${student.phone.slice(1)}`,
        email: `guardian.${student.rollNo.toLowerCase()}@myayra.in`,
      },
    })),
  );

  const studentByRoll = new Map(createdStudents.map((student) => [student.rollNo, student]));

  const createdCourses = await Course.insertMany([
    { code: 'CS301', name: 'Data Structures & Algorithms', department: 'Computer Science', credits: 4, semester: '5th', faculty: teacherByFacultyId.get('FAC001')._id, enrolledStudents: 82, capacity: 90, status: 'Active', academicYear: '2025-26' },
    { code: 'CS302', name: 'Database Management Systems', department: 'Computer Science', credits: 3, semester: '5th', faculty: teacherByFacultyId.get('FAC002')._id, enrolledStudents: 78, capacity: 85, status: 'Active', academicYear: '2025-26' },
    { code: 'EC201', name: 'Digital Electronics', department: 'Electronics', credits: 4, semester: '3rd', faculty: teacherByFacultyId.get('FAC003')._id, enrolledStudents: 60, capacity: 75, status: 'Active', academicYear: '2025-26' },
    { code: 'MA101', name: 'Engineering Mathematics I', department: 'Mathematics', credits: 4, semester: '1st', faculty: teacherByFacultyId.get('FAC004')._id, enrolledStudents: 120, capacity: 150, status: 'Active', academicYear: '2025-26' },
    { code: 'ME305', name: 'Thermal Engineering', department: 'Mechanical Engineering', credits: 4, semester: '5th', faculty: teacherByFacultyId.get('FAC007')._id, enrolledStudents: 54, capacity: 60, status: 'Active', academicYear: '2025-26' },
    { code: 'CE103', name: 'Engineering Drawing', department: 'Civil Engineering', credits: 3, semester: '1st', faculty: teacherByFacultyId.get('FAC008')._id, enrolledStudents: 46, capacity: 60, status: 'Active', academicYear: '2025-26' },
  ]);

  const courseByCode = new Map(createdCourses.map((course) => [course.code, course]));

  await ExamSchedule.insertMany([
    { course: courseByCode.get('CS301')._id, examType: 'Mid-Semester', date: new Date('2026-04-15T09:00:00.000Z'), startTime: '09:00', endTime: '12:00', venue: 'Hall A', duration: 180, maxMarks: 100, passingMarks: 40, invigilators: [teacherByFacultyId.get('FAC001')._id], status: 'Scheduled', academicYear: '2025-26' },
    { course: courseByCode.get('EC201')._id, examType: 'Internal', date: new Date('2026-04-18T10:00:00.000Z'), startTime: '10:00', endTime: '12:00', venue: 'Lab 2', duration: 120, maxMarks: 50, passingMarks: 20, invigilators: [teacherByFacultyId.get('FAC003')._id], status: 'Scheduled', academicYear: '2025-26' },
    { course: courseByCode.get('MA101')._id, examType: 'Practical', date: new Date('2026-04-21T11:00:00.000Z'), startTime: '11:00', endTime: '13:00', venue: 'Room M1', duration: 120, maxMarks: 50, passingMarks: 20, invigilators: [teacherByFacultyId.get('FAC004')._id], status: 'Scheduled', academicYear: '2025-26' },
  ]);

  const feeDocs = [
    { receiptNo: 'FEE00001', student: studentByRoll.get('CS2024001')._id, totalAmount: 45000, paidAmount: 45000, feeType: 'Tuition Fee', academicYear: '2025-26', semester: 5, status: 'Paid', paymentDate: new Date('2026-03-01T00:00:00.000Z'), paymentMode: 'Online' },
    { receiptNo: 'FEE00002', student: studentByRoll.get('CS2024002')._id, totalAmount: 45000, paidAmount: 0, feeType: 'Tuition Fee', academicYear: '2025-26', semester: 3, status: 'Pending', paymentMode: 'UPI' },
    { receiptNo: 'FEE00003', student: studentByRoll.get('MA2024011')._id, totalAmount: 45000, paidAmount: 22000, feeType: 'Exam Fee', academicYear: '2025-26', semester: 1, status: 'Partial', paymentDate: new Date('2026-03-12T00:00:00.000Z'), paymentMode: 'Online' },
    { receiptNo: 'FEE00004', student: studentByRoll.get('MBA2024005')._id, totalAmount: 60000, paidAmount: 0, feeType: 'Hostel Fee', academicYear: '2025-26', semester: 1, status: 'Pending', paymentMode: 'Cash' },
  ];
  await Fee.insertMany(feeDocs);

  await Announcement.insertMany([
    { title: 'Mid-Semester Exam Schedule Released', content: 'The mid-semester examination schedule for AYRA ERP has been released for all active departments.', category: 'Examinations', priority: 'High', audience: 'Students', status: 'Published', publishedAt: new Date('2026-04-01T00:00:00.000Z'), createdBy: superadmin._id },
    { title: 'Fee Reminder Window Open', content: 'Accounts can now trigger fee reminders from the master finance workspace for pending and partial fee records.', category: 'Finance', priority: 'Medium', audience: 'Fee Defaulters', status: 'Published', publishedAt: new Date('2026-04-02T00:00:00.000Z'), createdBy: superadmin._id },
  ]);

  await FinanceTransaction.insertMany([
    { date: new Date('2026-04-01T09:00:00.000Z'), description: 'Semester tuition receipts', details: 'Collected from 4 students after reconciliation', category: 'Tuition', type: 'income', amount: 180000, status: 'Completed', entityCount: 4, reference: 'TXN-TUI-0401' },
    { date: new Date('2026-04-02T15:00:00.000Z'), description: 'Payroll disbursement batch', details: 'Advance payout for faculty payroll cycle', category: 'Payroll', type: 'expense', amount: 640000, status: 'Pending', entityCount: 8, reference: 'TXN-PAY-0402' },
  ]);

  await LeaveRequest.create({
    teacher: teacherByFacultyId.get('FAC005')._id,
    leaveType: 'Casual Leave',
    startDate: new Date('2026-04-10T00:00:00.000Z'),
    endDate: new Date('2026-04-10T00:00:00.000Z'),
    days: 1,
    reason: 'Department coordination meeting outside campus.',
    status: 'Pending',
    reviewedBy: teacherByFacultyId.get('FAC001')._id,
  });

  const payrollDocs = [];
  const months = [
    { month: 'March', year: 2026, monthIndex: 0, status: 'Paid', paymentDate: new Date('2026-03-31T00:00:00.000Z') },
    { month: 'April', year: 2026, monthIndex: 1, status: 'Processed', paymentDate: new Date('2026-04-30T00:00:00.000Z') },
  ];

  for (const cycle of months) {
    for (const teacher of createdTeachers) {
      const basicSalary = salaryByFacultyId[teacher.facultyId] || 65000;
      const { allowances, deductions, totalAllowances, totalDeductions, grossSalary, netSalary } = calculatePayrollFigures(basicSalary, cycle.monthIndex);
      payrollDocs.push({
        teacher: teacher._id,
        employeeId: teacher.facultyId,
        employeeName: teacher.name,
        employeeEmail: teacher.email,
        department: teacher.department,
        designation: teacher.designation,
        avatar: teacher.avatar,
        salaryType: 'Monthly',
        basicSalary,
        allowances,
        deductions,
        attendance: {
          totalWorkingDays: 30,
          presentDays: cycle.monthIndex === 0 ? 29 : 30,
          leaveTaken: cycle.monthIndex === 0 ? 1 : 0,
          lossOfPay: 0,
          overtimeHours: cycle.monthIndex === 1 ? 4 : 2,
          extraShiftPay: allowances.extraShiftPay,
        },
        grossSalary,
        totalAllowances,
        totalDeductions,
        netSalary,
        payrollStatus: cycle.status,
        month: cycle.month,
        year: cycle.year,
        effectiveFromDate: new Date(`${cycle.year}-${cycle.monthIndex === 0 ? '03' : '04'}-01T00:00:00.000Z`),
        paymentDate: cycle.paymentDate,
        paymentMethod: 'Bank Transfer',
        bankAccountNumber: `00012345${teacher.facultyId.slice(-3)}`,
        ifscCode: 'AYRA0001234',
        approval: {
          preparedBy: superadmin.name,
          reviewedBy: createdAdmins[1].name,
          approvedBy: superadmin.name,
          approvalDate: new Date(`${cycle.year}-${cycle.monthIndex === 0 ? '03' : '04'}-28T00:00:00.000Z`),
          remarks: 'Synchronized payroll cycle for master admin dataset.',
        },
        remarks: `${cycle.month} ${cycle.year} payroll cycle`,
        payslip: {
          generated: true,
          generatedAt: new Date(`${cycle.year}-${cycle.monthIndex === 0 ? '03' : '04'}-29T00:00:00.000Z`),
          emailedAt: cycle.status === 'Paid' ? new Date(`${cycle.year}-${cycle.monthIndex === 0 ? '03' : '04'}-31T00:00:00.000Z`) : null,
          downloadCount: cycle.monthIndex === 0 ? 1 : 0,
          lastGeneratedBy: superadmin.username,
        },
        lastProcessedAt: new Date(`${cycle.year}-${cycle.monthIndex === 0 ? '03' : '04'}-29T00:00:00.000Z`),
        timeline: [
          { label: 'Prepared', by: superadmin.username, at: new Date(`${cycle.year}-${cycle.monthIndex === 0 ? '03' : '04'}-26T00:00:00.000Z`), note: 'Payroll draft created.' },
          { label: 'Reviewed', by: createdAdmins[1].username, at: new Date(`${cycle.year}-${cycle.monthIndex === 0 ? '03' : '04'}-27T00:00:00.000Z`), note: 'Attendance and allowances checked.' },
          { label: cycle.status, by: superadmin.username, at: new Date(`${cycle.year}-${cycle.monthIndex === 0 ? '03' : '04'}-29T00:00:00.000Z`), note: 'Cycle synchronized to Atlas.' },
        ],
      });
    }
  }

  await Payroll.insertMany(payrollDocs);
}

async function printCounts() {
  const counts = {
    payrolls: await Payroll.countDocuments(),
    announcements: await Announcement.countDocuments(),
    teachers: await Teacher.countDocuments(),
    fees: await Fee.countDocuments(),
    admins: await Admin.countDocuments(),
    leaverequests: await LeaveRequest.countDocuments(),
    appsettings: await AppSetting.countDocuments(),
    students: await Student.countDocuments(),
    courses: await Course.countDocuments(),
    examschedules: await ExamSchedule.countDocuments(),
    financetransactions: await FinanceTransaction.countDocuments(),
    curriculumplans: await CurriculumPlan.countDocuments(),
    academicplans: await AcademicPlan.countDocuments(),
    academicenrollmentdrafts: await AcademicEnrollmentDraft.countDocuments(),
  };

  Object.entries(counts).forEach(([key, value]) => {
    console.log(`${key}:${value}`);
  });
}

async function run() {
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });

  try {
    console.log(`Connected to Atlas database: ${mongoose.connection.db.databaseName}`);
    await resetCollections();
    await seedExactDataset();
    console.log(`Master admin credentials fixed: ${superadminCredentials.username} / ${superadminCredentials.password}`);
    await printCounts();
  } finally {
    await mongoose.disconnect();
  }
}

run().catch((error) => {
  console.error('Failed to synchronize master admin Atlas data:', error);
  process.exit(1);
});
