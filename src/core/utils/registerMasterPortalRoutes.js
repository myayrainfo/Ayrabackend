import requireAuth from "../middleware/requireAuth.js";
import tenantMiddleware from "../tenant/tenantMiddleware.js";
import { createLegacyCollectionItem, deleteLegacyCollectionItem, getLegacyCollectionData, updateLegacyCollectionItem } from "./legacyCollectionService.js";
import adminService from "../../modules/admin/admin.service.js";
import academicService from "../../modules/academics/academic.service.js";
import authController from "../../modules/auth/auth.controller.js";
import courseService from "../../modules/courses/course.service.js";
import dashboardService from "../../modules/dashboard/dashboard.service.js";
import examService from "../../modules/exams/exam.service.js";
import financeService from "../../modules/finance/finance.service.js";
import studentService from "../../modules/students/student.service.js";
import teacherService from "../../modules/teachers/teacher.service.js";

const enrollmentDrafts = new Map();
const hrStores = new Map();
const payrollStores = new Map();

function createCompatId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function titleCase(value) {
  const text = String(value || "").trim();
  if (!text) {
    return "";
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
}

function normalizeStudentStatus(value) {
  const status = String(value || "").trim().toLowerCase();

  if (["accept", "active"].includes(status)) {
    return "Active";
  }

  if (["inactive", "rejected"].includes(status)) {
    return "Inactive";
  }

  return titleCase(status || "Active");
}

function normalizeTeacherStatus(value) {
  const status = String(value || "").trim().toLowerCase();

  if (["accept", "active"].includes(status)) {
    return "Active";
  }

  if (status === "on leave") {
    return "On Leave";
  }

  return titleCase(status || "Active");
}

function toYearLabel(semester) {
  const numericSemester = Number(semester) || 1;

  if (numericSemester <= 2) {
    return "1";
  }

  if (numericSemester <= 4) {
    return "2";
  }

  if (numericSemester <= 6) {
    return "3";
  }

  return "4";
}

function normalizeFinanceStatus(value) {
  const status = String(value || "").trim().toLowerCase();

  if (["paid", "completed"].includes(status)) {
    return "Paid";
  }

  if (status === "partial") {
    return "Partial";
  }

  if (status === "overdue") {
    return "Overdue";
  }

  return "Pending";
}

function daysUntilNextBirthday(dateOfBirth) {
  if (!dateOfBirth) {
    return Number.MAX_SAFE_INTEGER;
  }

  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }

  return Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
}

function buildEmployeeFromTeacher(teacher, index = 0) {
  const fallbackStatuses = ["Active", "On Leave", "Active"];
  return {
    _id: `employee-${teacher._id || index + 1}`,
    fullName: teacher.fullName || teacher.displayName || teacher.teacherName || "Faculty Member",
    employeeId: teacher.employeeId || teacher.facultyId || `EMP-${String(index + 1).padStart(3, "0")}`,
    gender: index % 2 === 0 ? "Male" : "Female",
    dateOfBirth: index % 2 === 0 ? "1988-04-12" : "1990-09-21",
    email: teacher.email || `employee${index + 1}@cgu.edu.in`,
    phone: teacher.phone || `90000000${String(index + 1).padStart(2, "0")}`,
    address: "Campus Residency, Bhubaneswar",
    department: teacher.department || "Administration",
    designation: teacher.designation || "Officer",
    employmentType: "Full Time",
    dateOfJoining: `2024-0${(index % 6) + 1}-15`,
    managerName: "Registrar Office",
    salaryCTC: 720000 + index * 60000,
    status: fallbackStatuses[index] || normalizeTeacherStatus(teacher.status),
    profilePhoto: teacher.avatar || "",
    emergencyContact: {
      name: `Emergency Contact ${index + 1}`,
      relationship: "Sibling",
      phone: `98888000${String(index + 1).padStart(2, "0")}`,
    },
    notes: "Seeded workforce record for HR compatibility.",
    documents: [
      { label: "ID Proof", name: "id-proof.pdf" },
      { label: "Joining Letter", name: "joining-letter.pdf" },
    ],
    performanceNotes: [
      { title: "Quarterly Review", description: "Consistently meeting expectations." },
    ],
  };
}

async function getHrTenantStore(tenantId) {
  if (!hrStores.has(tenantId)) {
    const teachers = (await teacherService.listAllRaw(tenantId)).filter((item) => !item.assignmentOnly);
    const sourceTeachers = teachers.length
      ? teachers
      : [
          { _id: "seed-1", fullName: "Ananya Rao", employeeId: "EMP-001", department: "CSE", designation: "Assistant Professor", email: "ananya.rao@cgu.edu.in", phone: "9000000011" },
          { _id: "seed-2", fullName: "Rohit Sen", employeeId: "EMP-002", department: "Accounts", designation: "Finance Officer", email: "rohit.sen@cgu.edu.in", phone: "9000000012" },
          { _id: "seed-3", fullName: "Mitali Das", employeeId: "EMP-003", department: "Administration", designation: "HR Executive", email: "mitali.das@cgu.edu.in", phone: "9000000013" },
        ];

    const employees = sourceTeachers.map(buildEmployeeFromTeacher);
    const attendanceRecords = [];
    const leaveRecords = [];

    employees.forEach((employee, index) => {
      attendanceRecords.push({
        _id: createCompatId("attendance"),
        employeeId: employee._id,
        date: "2026-04-24",
        status: index === 1 ? "Late" : "Present",
        checkInTime: index === 1 ? "09:22" : "08:57",
        checkOutTime: "18:05",
        workingHours: index === 1 ? "8h 10m" : "8h 45m",
        notes: index === 1 ? "Traffic delay" : "",
      });
    });

    leaveRecords.push({
      _id: createCompatId("leave"),
      employeeId: employees[1]?._id || employees[0]?._id || "",
      leaveType: "Medical Leave",
      startDate: "2026-04-26",
      endDate: "2026-04-27",
      reason: "Seasonal illness",
      status: "Pending",
      reviewNote: "",
    });

    hrStores.set(tenantId, { employees, attendanceRecords, leaveRecords });
  }

  return hrStores.get(tenantId);
}

function getEmployeeAttendance(store, employeeId) {
  return store.attendanceRecords.filter((item) => item.employeeId === employeeId);
}

function getEmployeeLeaves(store, employeeId) {
  return store.leaveRecords.filter((item) => item.employeeId === employeeId);
}

function buildHrDashboard(store) {
  const todayIso = new Date().toISOString().slice(0, 10);
  const employeesOnLeaveToday = store.leaveRecords.filter(
    (leave) => leave.status === "Approved" && leave.startDate <= todayIso && leave.endDate >= todayIso,
  ).length;

  return {
    cards: {
      totalEmployees: store.employees.length,
      activeEmployees: store.employees.filter((item) => item.status === "Active").length,
      newJoinees: store.employees.filter((item) => new Date(item.dateOfJoining) >= new Date("2026-01-01")).length,
      employeesOnLeaveToday,
      pendingLeaveRequests: store.leaveRecords.filter((item) => item.status === "Pending").length,
      payrollLinkedEmployees: store.employees.length,
      upcomingBirthdays: store.employees.filter((item) => daysUntilNextBirthday(item.dateOfBirth) <= 30).length,
      attritionCount: store.employees.filter((item) => ["Inactive", "Resigned"].includes(item.status)).length,
    },
  };
}

function buildHrFilters(store) {
  return {
    departments: [...new Set(store.employees.map((item) => item.department).filter(Boolean))],
  };
}

function paginateItems(items, { page = 1, limit = 10 } = {}) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.max(1, Number(limit) || 10);
  const start = (safePage - 1) * safeLimit;
  const pagedItems = items.slice(start, start + safeLimit);

  return {
    items: pagedItems,
    pagination: {
      total: items.length,
      totalPages: Math.max(1, Math.ceil(items.length / safeLimit)),
      page: safePage,
      limit: safeLimit,
    },
  };
}

function buildEmployeeDetails(store, employee) {
  const attendanceRecords = getEmployeeAttendance(store, employee._id).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const leaveRecords = getEmployeeLeaves(store, employee._id).sort((a, b) => String(b.startDate).localeCompare(String(a.startDate)));

  return {
    employee,
    attendanceSummary: {
      totalRecords: attendanceRecords.length,
      presentDays: attendanceRecords.filter((item) => item.status === "Present").length,
      lateMarks: attendanceRecords.filter((item) => item.status === "Late").length,
      absences: attendanceRecords.filter((item) => item.status === "Absent").length,
    },
    leaveSummary: {
      totalRequests: leaveRecords.length,
      pending: leaveRecords.filter((item) => item.status === "Pending").length,
      approved: leaveRecords.filter((item) => item.status === "Approved").length,
      rejected: leaveRecords.filter((item) => item.status === "Rejected").length,
    },
    payrollInfo: {
      linked: true,
      salaryCTC: employee.salaryCTC || 0,
    },
    attendanceRecords,
    leaveRecords,
  };
}

function buildPayrollRecordFromEmployee(employee, month = "April", year = 2026) {
  const basicSalary = Math.round((Number(employee.salaryCTC) || 600000) / 12);
  const allowances = {
    hra: Math.round(basicSalary * 0.2),
    da: Math.round(basicSalary * 0.08),
    travelAllowance: 2500,
    medicalAllowance: 1800,
    bonus: 1500,
    extraShiftPay: 0,
  };
  const deductions = {
    pf: Math.round(basicSalary * 0.12),
    esi: 1200,
    tax: Math.round(basicSalary * 0.05),
    loanDeduction: 0,
    otherDeductions: 500,
    lossOfPayAmount: 0,
  };
  const totalAllowances = Object.values(allowances).reduce((sum, value) => sum + Number(value || 0), 0);
  const totalDeductions = Object.values(deductions).reduce((sum, value) => sum + Number(value || 0), 0);
  const grossSalary = basicSalary + totalAllowances;
  const netSalary = grossSalary - totalDeductions;

  return {
    _id: createCompatId("payroll"),
    employeeRef: employee._id,
    employeeName: employee.fullName,
    employeeId: employee.employeeId,
    employeeEmail: employee.email,
    department: employee.department,
    designation: employee.designation,
    salaryType: "Monthly",
    basicSalary,
    allowances,
    deductions,
    totalAllowances,
    totalDeductions,
    grossSalary,
    netSalary,
    paymentMethod: "Bank Transfer",
    bankAccountNumber: "XXXXXX4521",
    ifscCode: "SBIN0001234",
    month,
    year,
    effectiveFromDate: `${year}-04-01`,
    attendance: {
      totalWorkingDays: 30,
      presentDays: 29,
      leaveTaken: 1,
      lossOfPay: 0,
      overtimeHours: 3,
      extraShiftPay: 0,
    },
    approval: {
      preparedBy: "Finance Desk",
      reviewedBy: "Accounts Manager",
      approvedBy: "",
      approvalDate: null,
      remarks: "",
    },
    remarks: "Seeded payroll structure.",
    payrollStatus: "Pending Approval",
    paymentDate: null,
    payslipPreview: null,
  };
}

async function getPayrollTenantStore(tenantId) {
  if (!payrollStores.has(tenantId)) {
    const hrStore = await getHrTenantStore(tenantId);
    const records = hrStore.employees.map((employee, index) => buildPayrollRecordFromEmployee(employee, "April", 2026 + (index > 10 ? 1 : 0)));
    payrollStores.set(tenantId, { records, recentActivity: [] });
  }

  return payrollStores.get(tenantId);
}

function createPayslipPreview(record) {
  const earnings = [
    ["Basic Salary", record.basicSalary],
    ["HRA", record.allowances?.hra || 0],
    ["DA", record.allowances?.da || 0],
    ["Travel Allowance", record.allowances?.travelAllowance || 0],
    ["Medical Allowance", record.allowances?.medicalAllowance || 0],
    ["Bonus", record.allowances?.bonus || 0],
    ["Extra Shift Pay", record.allowances?.extraShiftPay || 0],
  ];

  const deductions = [
    ["Provident Fund", record.deductions?.pf || 0],
    ["ESI", record.deductions?.esi || 0],
    ["Tax", record.deductions?.tax || 0],
    ["Loan Deduction", record.deductions?.loanDeduction || 0],
    ["Other Deductions", record.deductions?.otherDeductions || 0],
    ["Loss of Pay", record.deductions?.lossOfPayAmount || 0],
  ];

  return {
    employeeDetails: {
      employeeName: record.employeeName,
      employeeId: record.employeeId,
      department: record.department,
      designation: record.designation,
      salaryType: record.salaryType,
    },
    paymentMethod: record.paymentMethod,
    paymentDate: record.paymentDate || new Date().toISOString(),
    month: record.month,
    year: record.year,
    earnings,
    deductions,
    grossSalary: record.grossSalary,
    totalDeductions: record.totalDeductions,
    netSalary: record.netSalary,
  };
}

function buildPayrollSummary(store) {
  const departments = [...new Set(store.records.map((item) => item.department).filter(Boolean))];
  const statuses = [...new Set(store.records.map((item) => item.payrollStatus).filter(Boolean))];
  const months = [...new Set(store.records.map((item) => item.month).filter(Boolean))];
  const salaryTypes = [...new Set(store.records.map((item) => item.salaryType).filter(Boolean))];

  return {
    month: "April",
    year: 2026,
    cards: {
      totalEmployees: store.records.length,
      payrollThisMonth: store.records.reduce((sum, item) => sum + Number(item.netSalary || 0), 0),
      pendingApprovals: store.records.filter((item) => item.payrollStatus === "Pending Approval").length,
      totalDeductions: store.records.reduce((sum, item) => sum + Number(item.totalDeductions || 0), 0),
      payslipsGenerated: store.records.filter((item) => item.payslipPreview).length,
      failedPayments: store.records.filter((item) => item.payrollStatus === "Failed").length,
    },
    filters: {
      departments,
      statuses,
      months,
      salaryTypes,
    },
    recentActivity: store.recentActivity.slice(0, 6),
  };
}

async function buildFeeIndex(tenantId) {
  const fees = await financeService.listAllRaw(tenantId);
  const feeMap = new Map();

  fees.forEach((fee) => {
    const keys = [fee.studentId, fee.student, fee.studentRef].filter(Boolean);
    keys.forEach((key) => feeMap.set(String(key), fee));
  });

  return { fees, feeMap };
}

function mapStudentRecord(student, feeMap = new Map()) {
  const feeRecord =
    feeMap.get(String(student._id || "")) ||
    feeMap.get(String(student.studentId || "")) ||
    feeMap.get(String(student.rollNo || ""));

  return {
    ...student,
    name: student.name || student.fullName || student.displayName || "",
    rollNo: student.rollNo || student.studentId || "",
    year: student.year || toYearLabel(student.semester),
    status: normalizeStudentStatus(student.status),
    feeStatus: student.feeStatus || normalizeFinanceStatus(feeRecord?.status),
    avatar: student.avatar || student.photoDataUrl || "",
  };
}

function mapTeacherRecord(teacher) {
  return {
    ...teacher,
    name: teacher.name || teacher.fullName || teacher.displayName || teacher.teacherName || "",
    facultyId: teacher.facultyId || teacher.employeeId || "",
    status: normalizeTeacherStatus(teacher.status),
    subjects: teacher.subjects || (teacher.subjectName ? [teacher.subjectName] : []),
    experienceYears: Number(teacher.experienceYears) || 0,
    avatar: teacher.avatar || "",
    accountStatus: teacher.accountStatus || "Pending Setup",
  };
}

function mapFinanceTransaction(record) {
  return {
    ...record,
    date: record.date || record.paymentDate || record.paidAt || record.createdAt,
    description: record.description || record.title || record.feeType || "Finance Entry",
    details: record.details || record.remarks || "",
    category: record.category || record.feeType || "Tuition",
    type: record.type || (normalizeFinanceStatus(record.status) === "Paid" ? "income" : "expense"),
    amount: Number(record.amount || record.totalAmount || record.paidAmount || 0),
    status: normalizeFinanceStatus(record.status) === "Paid" ? "Completed" : "Pending",
  };
}

function mapFeeRecord(record) {
  const status = normalizeFinanceStatus(record.status);
  const paidAmount = Number(record.paidAmount || (status === "Paid" ? record.amount || record.totalAmount || 0 : 0));
  const totalAmount = Number(record.totalAmount || record.amount || paidAmount || 0);

  return {
    ...record,
    student: record.student || record.studentRef || record.studentId || "",
    feeType: record.feeType || record.title || "Semester Fee",
    totalAmount,
    paidAmount,
    paymentDate: record.paymentDate || record.paidAt || record.createdAt,
    paymentMode: record.paymentMode || "Online",
    receiptNo: record.receiptNo || `REC-${String(record._id || "").slice(-6).toUpperCase()}`,
    semester: Number(record.semester) || 1,
    status,
  };
}

function buildFinanceOverview(records, students) {
  const paidRecords = records.filter((record) => normalizeFinanceStatus(record.status) === "Paid");
  const pendingRecords = records.filter((record) => normalizeFinanceStatus(record.status) !== "Paid");
  const totalRevenue = paidRecords.reduce((sum, record) => sum + Number(record.amount || record.totalAmount || 0), 0);
  const outstandingFees = pendingRecords.reduce((sum, record) => sum + Number(record.amount || record.totalAmount || 0), 0);
  const groupedByMonth = new Map();

  records.forEach((record) => {
    const dateValue = new Date(record.date || record.paymentDate || record.createdAt || Date.now());
    const label = dateValue.toLocaleString("en-IN", { month: "short" });
    const current = groupedByMonth.get(label) || { month: label, income: 0, expenses: 0 };
    const normalized = mapFinanceTransaction(record);

    if (normalized.type === "expense") {
      current.expenses += normalized.amount;
    } else {
      current.income += normalized.amount;
    }

    groupedByMonth.set(label, current);
  });

  return {
    reportingPeriod: "FY 2026",
    kpis: {
      totalRevenue: { value: totalRevenue, growth: 12 },
      outstandingFees: { value: outstandingFees, students: students.filter((student) => mapStudentRecord(student).feeStatus !== "Paid").length },
      pendingVendorPayments: { value: 0, invoices: 0 },
      monthlyPayrollExpense: { value: 0, employees: 0 },
    },
    chart: [...groupedByMonth.values()],
    budgetAllocation: [
      { category: "Academics", amount: totalRevenue * 0.4 },
      { category: "Operations", amount: totalRevenue * 0.25 },
      { category: "Student Services", amount: totalRevenue * 0.2 },
      { category: "Reserve", amount: totalRevenue * 0.15 },
    ],
  };
}

function withMasterGuards(router) {
  router.use(requireAuth, tenantMiddleware);
}

export default function registerMasterPortalRoutes(router) {
  router.get("/master/auth/portal-settings", authController.portalSettings);
  router.post("/master/auth/login", authController.loginAdmin);
  router.post("/master/auth/refresh", authController.refresh);
  router.post("/master/auth/logout", authController.logout);

  router.get("/master/auth/me", requireAuth, tenantMiddleware, authController.me);
  router.put("/master/auth/profile", requireAuth, tenantMiddleware, authController.updateProfile);
  router.put("/master/auth/change-password", requireAuth, tenantMiddleware, authController.changePassword);
  router.put("/master/auth/portal-settings", requireAuth, tenantMiddleware, authController.portalSettings);

  router.get("/master/dashboard/stats", requireAuth, tenantMiddleware, async (req, res) => {
    const data = await dashboardService.getSummary(req.tenantId);
    res.json({ ok: true, data });
  });

  router.get("/master/admins", requireAuth, tenantMiddleware, async (req, res) => {
    const data = await adminService.getAll(req.tenantId, req.query || {});
    res.json({ ok: true, data: { admins: data.items, pagination: data.pagination } });
  });

  router.get("/master/admins/stats", requireAuth, tenantMiddleware, async (req, res) => {
    const stats = await adminService.getStats(req.tenantId);
    res.json({
      ok: true,
      data: {
        total: stats.totalAdmins,
        active: stats.activeAdmins,
        inactive: stats.inactiveAdmins,
        departments: stats.departments,
      },
    });
  });

  router.post("/master/admins", requireAuth, tenantMiddleware, async (req, res) => {
    const admin = await adminService.create(req.tenantId, req.body || {});
    res.status(201).json({ ok: true, data: admin });
  });

  router.put("/master/admins/:id", requireAuth, tenantMiddleware, async (req, res) => {
    const admin = await adminService.update(req.tenantId, req.params.id, req.body || {});
    res.json({ ok: true, data: admin });
  });

  router.put("/master/admins/:id/toggle-status", requireAuth, tenantMiddleware, async (req, res) => {
    const existing = await adminService.getById(req.tenantId, req.params.id);
    const admin = await adminService.update(req.tenantId, req.params.id, { isActive: !existing?.isActive });
    res.json({ ok: true, data: admin });
  });

  router.delete("/master/admins/:id", requireAuth, tenantMiddleware, async (req, res) => {
    await adminService.remove(req.tenantId, req.params.id);
    res.json({ ok: true, message: "Deleted successfully." });
  });

  router.get("/master/students", requireAuth, tenantMiddleware, async (req, res) => {
    const [data, { feeMap }] = await Promise.all([
      studentService.getAll(req.tenantId, req.query || {}),
      buildFeeIndex(req.tenantId),
    ]);

    res.json({
      ok: true,
      data: {
        students: data.items.map((item) => mapStudentRecord(item, feeMap)),
        pagination: data.pagination,
      },
    });
  });

  router.get("/master/students/stats", requireAuth, tenantMiddleware, async (req, res) => {
    const students = (await studentService.listAllRaw(req.tenantId)).map((item) => mapStudentRecord(item));
    res.json({
      ok: true,
      data: {
        total: students.length,
        active: students.filter((item) => item.status === "Active").length,
        inactive: students.filter((item) => item.status !== "Active").length,
      },
    });
  });

  router.post("/master/students", requireAuth, tenantMiddleware, async (req, res) => {
    const payload = req.body || {};
    const student = await studentService.create(req.tenantId, {
      ...payload,
      fullName: payload.name || payload.fullName,
      displayName: payload.name || payload.displayName || payload.fullName,
      studentId: payload.rollNo || payload.studentId,
      rollNo: payload.rollNo || payload.studentId,
      semester: Number(payload.semester) || Number(payload.year) * 2 || 1,
      year: String(payload.year || toYearLabel(payload.semester)),
      avatar: payload.avatar || "",
      photoDataUrl: payload.avatar || payload.photoDataUrl || "",
    });

    res.status(201).json({ ok: true, data: mapStudentRecord(student) });
  });

  router.put("/master/students/:id", requireAuth, tenantMiddleware, async (req, res) => {
    const payload = req.body || {};
    const student = await studentService.update(req.tenantId, req.params.id, {
      ...payload,
      fullName: payload.name || payload.fullName,
      displayName: payload.name || payload.displayName || payload.fullName,
      studentId: payload.rollNo || payload.studentId || payload.rollNumber,
      rollNo: payload.rollNo || payload.studentId || payload.rollNumber,
      semester: Number(payload.semester) || Number(payload.year) * 2 || undefined,
      avatar: payload.avatar || "",
      photoDataUrl: payload.avatar || payload.photoDataUrl || "",
    });

    res.json({ ok: true, data: mapStudentRecord(student) });
  });

  router.delete("/master/students/:id", requireAuth, tenantMiddleware, async (req, res) => {
    await studentService.remove(req.tenantId, req.params.id);
    res.json({ ok: true, message: "Deleted successfully." });
  });

  router.get("/master/teachers", requireAuth, tenantMiddleware, async (req, res) => {
    const data = await teacherService.getAll(req.tenantId, req.query || {});
    const teachers = data.items.filter((item) => !item.assignmentOnly).map(mapTeacherRecord);
    res.json({ ok: true, data: { teachers, pagination: { ...data.pagination, total: teachers.length } } });
  });

  router.get("/master/teachers/stats", requireAuth, tenantMiddleware, async (req, res) => {
    const teachers = (await teacherService.listAllRaw(req.tenantId))
      .filter((item) => !item.assignmentOnly)
      .map(mapTeacherRecord);

    res.json({
      ok: true,
      data: {
        total: teachers.length,
        active: teachers.filter((item) => item.status === "Active").length,
        onLeave: teachers.filter((item) => item.status === "On Leave").length,
      },
    });
  });

  router.post("/master/teachers", requireAuth, tenantMiddleware, async (req, res) => {
    const payload = req.body || {};
    const teacher = await teacherService.create(req.tenantId, {
      ...payload,
      fullName: payload.name || payload.fullName,
      displayName: payload.name || payload.displayName || payload.fullName,
      employeeId: payload.facultyId || payload.employeeId,
    });
    res.status(201).json({ ok: true, data: mapTeacherRecord(teacher) });
  });

  router.put("/master/teachers/:id", requireAuth, tenantMiddleware, async (req, res) => {
    const payload = req.body || {};
    const teacher = await teacherService.update(req.tenantId, req.params.id, {
      ...payload,
      fullName: payload.name || payload.fullName,
      displayName: payload.name || payload.displayName || payload.fullName,
      employeeId: payload.facultyId || payload.employeeId,
    });
    res.json({ ok: true, data: mapTeacherRecord(teacher) });
  });

  router.delete("/master/teachers/:id", requireAuth, tenantMiddleware, async (req, res) => {
    await teacherService.remove(req.tenantId, req.params.id);
    res.json({ ok: true, message: "Deleted successfully." });
  });

  router.get("/master/finance/overview", requireAuth, tenantMiddleware, async (req, res) => {
    const [records, students] = await Promise.all([
      financeService.listAllRaw(req.tenantId),
      studentService.listAllRaw(req.tenantId),
    ]);

    res.json({ ok: true, data: buildFinanceOverview(records, students) });
  });

  router.get("/master/finance/transactions", requireAuth, tenantMiddleware, async (req, res) => {
    const data = await financeService.getAll(req.tenantId, req.query || {});
    res.json({ ok: true, data: { transactions: data.items.map(mapFinanceTransaction), pagination: data.pagination } });
  });

  router.post("/master/finance/transactions", requireAuth, tenantMiddleware, async (req, res) => {
    const payload = req.body || {};
    const record = await financeService.create(req.tenantId, {
      ...payload,
      recordType: "transaction",
      title: payload.description || payload.title,
      amount: Number(payload.amount) || 0,
      status: payload.status || "Completed",
    });

    res.status(201).json({ ok: true, data: mapFinanceTransaction(record) });
  });

  router.get("/master/finance/fees", requireAuth, tenantMiddleware, async (req, res) => {
    const data = await financeService.getAll(req.tenantId, { ...req.query, limit: req.query.limit || 50 });
    let fees = data.items.map(mapFeeRecord);

    if (req.query.studentId) {
      const student = await studentService.getById(req.tenantId, req.query.studentId);
      const studentKeys = new Set([req.query.studentId, student?.studentId, student?.rollNo].filter(Boolean).map(String));
      fees = fees.filter((item) => studentKeys.has(String(item.student)) || studentKeys.has(String(item.studentId)));
    }

    res.json({ ok: true, data: { fees, pagination: data.pagination } });
  });

  router.post("/master/finance/fees", requireAuth, tenantMiddleware, async (req, res) => {
    const payload = req.body || {};
    const student = await studentService.getById(req.tenantId, payload.student);
    const fee = await financeService.create(req.tenantId, {
      ...payload,
      recordType: "fee-payment",
      student: payload.student,
      studentId: student?.studentId || student?.rollNo || payload.studentId || payload.student,
      studentName: student?.fullName || student?.displayName || payload.studentName || "",
      amount: Number(payload.totalAmount || payload.amount) || 0,
      totalAmount: Number(payload.totalAmount || payload.amount) || 0,
      paidAmount: Number(payload.paidAmount || payload.totalAmount || payload.amount) || 0,
      title: payload.feeType || "Semester Fee",
      feeType: payload.feeType || "Semester Fee",
      paymentDate: payload.paymentDate,
      paidAt: payload.paymentDate,
      status: payload.status || "Paid",
    });

    if (student) {
      await studentService.update(req.tenantId, student._id, { feeStatus: normalizeFinanceStatus(fee.status) });
    }

    res.status(201).json({ ok: true, data: mapFeeRecord(fee) });
  });

  router.post("/master/reminders/send-fee-reminder", requireAuth, tenantMiddleware, async (req, res) => {
    res.json({
      ok: true,
      message: `Fee reminder queued for ${req.body?.email || "student"}.`,
      data: req.body || {},
    });
  });

  router.get("/master/communication/announcements", requireAuth, tenantMiddleware, async (req, res) => {
    const search = String(req.query.search || "").trim().toLowerCase();
    let announcements = await getLegacyCollectionData(req.tenantId, "communication/announcements", req.query || {});

    if (search) {
      announcements = announcements.filter((item) =>
        [item.title, item.content, item.audience, item.category, item.priority].some((field) =>
          String(field || "").toLowerCase().includes(search),
        ),
      );
    }

    res.json({ ok: true, data: { announcements } });
  });

  router.get("/master/communication/stats", requireAuth, tenantMiddleware, async (req, res) => {
    const announcements = await getLegacyCollectionData(req.tenantId, "communication/announcements");
    res.json({
      ok: true,
      data: {
        total: announcements.length,
        published: announcements.filter((item) => String(item.status || "").toLowerCase() === "published").length,
        drafts: announcements.filter((item) => String(item.status || "").toLowerCase() !== "published").length,
      },
    });
  });

  router.post("/master/communication/announcements", requireAuth, tenantMiddleware, async (req, res) => {
    const item = await createLegacyCollectionItem(req.tenantId, "communication/announcements", req.body || {});
    res.status(201).json({ ok: true, data: item });
  });

  router.put("/master/communication/announcements/:id", requireAuth, tenantMiddleware, async (req, res) => {
    const item = await updateLegacyCollectionItem(req.tenantId, "communication/announcements", req.params.id, req.body || {});
    res.json({ ok: true, data: item });
  });

  router.delete("/master/communication/announcements/:id", requireAuth, tenantMiddleware, async (req, res) => {
    await deleteLegacyCollectionItem(req.tenantId, "communication/announcements", req.params.id);
    res.json({ ok: true, message: "Deleted successfully." });
  });

  router.get("/master/academics/overview", requireAuth, tenantMiddleware, async (req, res) => {
    const [students, teachers, curriculumPlans, leaveRequests] = await Promise.all([
      studentService.listAllRaw(req.tenantId),
      teacherService.listAllRaw(req.tenantId),
      getLegacyCollectionData(req.tenantId, "academic/curriculum-plans"),
      getLegacyCollectionData(req.tenantId, "academic/leave-requests"),
    ]);

    res.json({
      ok: true,
      data: {
        teachers: teachers.filter((item) => !item.assignmentOnly).length,
        students: students.length,
        curriculumPlans: curriculumPlans.length,
        pendingLeaveRequests: leaveRequests.filter((item) => String(item.status || "").toLowerCase().includes("pending")).length,
      },
    });
  });

  router.get("/master/academics/teacher-accounts", requireAuth, tenantMiddleware, async (req, res) => {
    const data = await teacherService.getAll(req.tenantId, req.query || {});
    res.json({ ok: true, data: { teachers: data.items.filter((item) => !item.assignmentOnly).map(mapTeacherRecord) } });
  });

  router.post("/master/academics/teacher-accounts", requireAuth, tenantMiddleware, async (req, res) => {
    const teacher = await teacherService.create(req.tenantId, {
      ...(req.body || {}),
      fullName: req.body?.name || req.body?.fullName,
      displayName: req.body?.name || req.body?.displayName,
      employeeId: req.body?.facultyId || req.body?.employeeId,
    });
    res.status(201).json({ ok: true, data: teacher });
  });

  router.put("/master/academics/teacher-accounts/:id", requireAuth, tenantMiddleware, async (req, res) => {
    const teacher = await teacherService.update(req.tenantId, req.params.id, {
      ...(req.body || {}),
      fullName: req.body?.name || req.body?.fullName,
      displayName: req.body?.name || req.body?.displayName,
      employeeId: req.body?.facultyId || req.body?.employeeId,
    });
    res.json({ ok: true, data: teacher });
  });

  router.delete("/master/academics/teacher-accounts/:id", requireAuth, tenantMiddleware, async (req, res) => {
    await teacherService.remove(req.tenantId, req.params.id);
    res.json({ ok: true, message: "Deleted successfully." });
  });

  router.post("/master/academics/teacher-accounts/:id/generate-password", requireAuth, tenantMiddleware, async (req, res) => {
    res.json({ ok: true, data: { generatedPassword: `Ayra@${String(req.params.id).slice(-4).padStart(4, "0")}` } });
  });

  router.get("/master/academics/registries/students", requireAuth, tenantMiddleware, async (req, res) => {
    const [data, { feeMap }] = await Promise.all([
      studentService.getAll(req.tenantId, req.query || {}),
      buildFeeIndex(req.tenantId),
    ]);
    res.json({ ok: true, data: { students: data.items.map((item) => mapStudentRecord(item, feeMap)) } });
  });

  router.post("/master/academics/registries/students", requireAuth, tenantMiddleware, async (req, res) => {
    const payload = req.body || {};
    const student = await studentService.create(req.tenantId, {
      ...payload,
      fullName: payload.personalDetails?.fullLegalName || payload.name || payload.fullName,
      displayName: payload.personalDetails?.preferredName || payload.personalDetails?.fullLegalName || payload.name || payload.displayName,
      studentId: payload.personalDetails?.rollNumber || payload.rollNo || payload.studentId,
      rollNo: payload.personalDetails?.rollNumber || payload.rollNo || payload.studentId,
      email: payload.personalDetails?.email || payload.email,
      phone: payload.personalDetails?.phone || payload.phone,
      department: payload.academicInfo?.department || payload.department,
      semester: Number(payload.academicInfo?.semester || payload.semester || 1),
      year: payload.academicInfo?.year || payload.year,
      section: payload.academicInfo?.section || payload.section || "A",
      avatar: payload.profilePhoto?.content || payload.avatar || "",
      photoDataUrl: payload.profilePhoto?.content || payload.avatar || "",
      programName: payload.academicInfo?.programName || payload.programName,
      dateOfBirth: payload.personalDetails?.dateOfBirth || payload.dateOfBirth,
      admissionDate: payload.academicInfo?.admissionDate || payload.admissionDate,
      profile: {
        contactInfo: payload.contactInfo || {},
        address: payload.address || {},
        documents: payload.documents || [],
      },
    });

    res.status(201).json({ ok: true, data: mapStudentRecord(student) });
  });

  router.put("/master/academics/registries/students/:id", requireAuth, tenantMiddleware, async (req, res) => {
    const student = await studentService.update(req.tenantId, req.params.id, {
      ...(req.body || {}),
      fullName: req.body?.name || req.body?.fullName,
      displayName: req.body?.name || req.body?.displayName || req.body?.fullName,
      studentId: req.body?.rollNo || req.body?.studentId || req.body?.rollNumber,
      rollNo: req.body?.rollNo || req.body?.studentId || req.body?.rollNumber,
      avatar: req.body?.avatar || "",
      photoDataUrl: req.body?.avatar || req.body?.photoDataUrl || "",
    });
    res.json({ ok: true, data: mapStudentRecord(student) });
  });

  router.delete("/master/academics/registries/students/:id", requireAuth, tenantMiddleware, async (req, res) => {
    await studentService.remove(req.tenantId, req.params.id);
    res.json({ ok: true, message: "Deleted successfully." });
  });

  router.get("/master/academics/registries/teachers", requireAuth, tenantMiddleware, async (req, res) => {
    const data = await teacherService.getAll(req.tenantId, req.query || {});
    res.json({ ok: true, data: { teachers: data.items.filter((item) => !item.assignmentOnly).map(mapTeacherRecord) } });
  });

  router.get("/master/academics/courses", requireAuth, tenantMiddleware, async (req, res) => {
    const data = await courseService.getAll(req.tenantId, req.query || {});
    res.json({ ok: true, data: { courses: data.items } });
  });

  router.post("/master/academics/courses", requireAuth, tenantMiddleware, async (req, res) => {
    const item = await courseService.create(req.tenantId, req.body || {});
    res.status(201).json({ ok: true, data: item });
  });

  router.put("/master/academics/courses/:id", requireAuth, tenantMiddleware, async (req, res) => {
    const item = await courseService.update(req.tenantId, req.params.id, req.body || {});
    res.json({ ok: true, data: item });
  });

  router.delete("/master/academics/courses/:id", requireAuth, tenantMiddleware, async (req, res) => {
    await courseService.remove(req.tenantId, req.params.id);
    res.json({ ok: true, message: "Deleted successfully." });
  });

  router.get("/master/academics/exams", requireAuth, tenantMiddleware, async (req, res) => {
    const data = await examService.getAll(req.tenantId, req.query || {});
    res.json({ ok: true, data: { exams: data.items } });
  });

  router.post("/master/academics/exams", requireAuth, tenantMiddleware, async (req, res) => {
    const item = await examService.create(req.tenantId, {
      ...(req.body || {}),
      courseName: req.body?.course || req.body?.courseName,
      courseCode: req.body?.courseCode || req.body?.code,
    });
    res.status(201).json({ ok: true, data: item });
  });

  router.delete("/master/academics/exams/:id", requireAuth, tenantMiddleware, async (req, res) => {
    await examService.remove(req.tenantId, req.params.id);
    res.json({ ok: true, message: "Deleted successfully." });
  });

  router.get("/master/academics/curriculum-plans", requireAuth, tenantMiddleware, async (req, res) => {
    const plans = await getLegacyCollectionData(req.tenantId, "academic/curriculum-plans", req.query || {});
    res.json({ ok: true, data: { plans } });
  });

  router.post("/master/academics/curriculum-plans", requireAuth, tenantMiddleware, async (req, res) => {
    const item = await createLegacyCollectionItem(req.tenantId, "academic/curriculum-plans", req.body || {});
    res.status(201).json({ ok: true, data: item });
  });

  router.put("/master/academics/curriculum-plans/:id", requireAuth, tenantMiddleware, async (req, res) => {
    const item = await updateLegacyCollectionItem(req.tenantId, "academic/curriculum-plans", req.params.id, req.body || {});
    res.json({ ok: true, data: item });
  });

  router.delete("/master/academics/curriculum-plans/:id", requireAuth, tenantMiddleware, async (req, res) => {
    await deleteLegacyCollectionItem(req.tenantId, "academic/curriculum-plans", req.params.id);
    res.json({ ok: true, message: "Deleted successfully." });
  });

  router.get("/master/academics/academic-plans", requireAuth, tenantMiddleware, async (req, res) => {
    const plans = await academicService.listAllRaw(req.tenantId, req.query || {});
    res.json({ ok: true, data: { plans: plans.filter((item) => item.category === "academic-plan") } });
  });

  router.post("/master/academics/academic-plans", requireAuth, tenantMiddleware, async (req, res) => {
    const item = await academicService.create(req.tenantId, { ...(req.body || {}), category: "academic-plan" });
    res.status(201).json({ ok: true, data: item });
  });

  router.put("/master/academics/academic-plans/:id", requireAuth, tenantMiddleware, async (req, res) => {
    const item = await academicService.update(req.tenantId, req.params.id, req.body || {});
    res.json({ ok: true, data: item });
  });

  router.delete("/master/academics/academic-plans/:id", requireAuth, tenantMiddleware, async (req, res) => {
    await academicService.remove(req.tenantId, req.params.id);
    res.json({ ok: true, message: "Deleted successfully." });
  });

  router.get("/master/academics/leave-requests", requireAuth, tenantMiddleware, async (req, res) => {
    const requests = await getLegacyCollectionData(req.tenantId, "academic/leave-requests", req.query || {});
    res.json({ ok: true, data: { requests } });
  });

  router.post("/master/academics/leave-requests", requireAuth, tenantMiddleware, async (req, res) => {
    const item = await createLegacyCollectionItem(req.tenantId, "academic/leave-requests", req.body || {});
    res.status(201).json({ ok: true, data: item });
  });

  router.put("/master/academics/leave-requests/:id", requireAuth, tenantMiddleware, async (req, res) => {
    const item = await updateLegacyCollectionItem(req.tenantId, "academic/leave-requests", req.params.id, req.body || {});
    res.json({ ok: true, data: item });
  });

  router.delete("/master/academics/leave-requests/:id", requireAuth, tenantMiddleware, async (req, res) => {
    await deleteLegacyCollectionItem(req.tenantId, "academic/leave-requests", req.params.id);
    res.json({ ok: true, message: "Deleted successfully." });
  });

  router.get("/master/academics/enrollment/programs", requireAuth, tenantMiddleware, async (req, res) => {
    const courses = await courseService.listAllRaw(req.tenantId);
    const programs = [...new Map(
      courses.map((course) => [
        `${course.department || "GENERAL"}-${course.semester || 1}`,
        {
          id: `${course.department || "GENERAL"}-${course.semester || 1}`,
          name: course.programName || `B.Tech ${course.department || "General"}`,
          department: course.department || "General",
          durationYears: 4,
          feePerSemester: 45000,
        },
      ]),
    ).values()];

    res.json({ ok: true, data: { programs } });
  });

  router.get("/master/academics/enrollment/draft", requireAuth, tenantMiddleware, async (req, res) => {
    res.json({ ok: true, data: { draft: enrollmentDrafts.get(req.tenantId) || null } });
  });

  router.post("/master/academics/enrollment/draft", requireAuth, tenantMiddleware, async (req, res) => {
    enrollmentDrafts.set(req.tenantId, req.body || {});
    res.json({ ok: true, data: { draft: req.body || {} } });
  });

  router.get("/master/academics/enrollment/validate-roll", requireAuth, tenantMiddleware, async (req, res) => {
    const rollNumber = String(req.query.rollNumber || "").trim().toUpperCase();
    const students = await studentService.listAllRaw(req.tenantId);
    const exists = students.some((item) => String(item.rollNo || item.studentId || "").trim().toUpperCase() === rollNumber);
    res.json({ ok: true, data: { available: !exists } });
  });

  router.post("/master/academics/enrollment/students", requireAuth, tenantMiddleware, async (req, res) => {
    const payload = req.body || {};
    const student = await studentService.create(req.tenantId, {
      fullName: payload.personalDetails?.fullLegalName || "",
      displayName: payload.personalDetails?.preferredName || payload.personalDetails?.fullLegalName || "",
      studentId: payload.personalDetails?.rollNumber || "",
      rollNo: payload.personalDetails?.rollNumber || "",
      email: payload.personalDetails?.email || "",
      phone: payload.personalDetails?.phone || "",
      department: payload.academicInfo?.department || "",
      semester: Number(payload.academicInfo?.semester || 1),
      year: payload.academicInfo?.year || toYearLabel(payload.academicInfo?.semester || 1),
      section: payload.academicInfo?.section || "A",
      avatar: payload.profilePhoto?.content || "",
      photoDataUrl: payload.profilePhoto?.content || "",
      programName: payload.academicInfo?.programName || "",
      dateOfBirth: payload.personalDetails?.dateOfBirth || "",
      admissionDate: payload.academicInfo?.admissionDate || "",
      profile: {
        contactInfo: payload.contactInfo || {},
        address: payload.address || {},
        documents: payload.documents || [],
      },
    });

    enrollmentDrafts.delete(req.tenantId);
    res.status(201).json({ ok: true, data: mapStudentRecord(student) });
  });

  router.get("/master/hr/dashboard", requireAuth, tenantMiddleware, async (req, res) => {
    const store = await getHrTenantStore(req.tenantId);
    res.json({ ok: true, data: buildHrDashboard(store) });
  });

  router.get("/master/hr/filters", requireAuth, tenantMiddleware, async (req, res) => {
    const store = await getHrTenantStore(req.tenantId);
    res.json({ ok: true, data: buildHrFilters(store) });
  });

  router.get("/master/hr/employees", requireAuth, tenantMiddleware, async (req, res) => {
    const store = await getHrTenantStore(req.tenantId);
    const search = String(req.query.search || "").trim().toLowerCase();
    const department = String(req.query.department || "").trim();
    const employmentType = String(req.query.employmentType || "").trim();
    const status = String(req.query.status || "").trim();

    const filtered = store.employees.filter((employee) => {
      if (
        search &&
        ![employee.fullName, employee.employeeId, employee.email, employee.designation]
          .some((field) => String(field || "").toLowerCase().includes(search))
      ) {
        return false;
      }

      if (department && employee.department !== department) {
        return false;
      }

      if (employmentType && employee.employmentType !== employmentType) {
        return false;
      }

      if (status && employee.status !== status) {
        return false;
      }

      return true;
    });

    const { items, pagination } = paginateItems(filtered, req.query || {});
    res.json({ ok: true, data: { employees: items, pagination } });
  });

  router.post("/master/hr/employees", requireAuth, tenantMiddleware, async (req, res) => {
    const store = await getHrTenantStore(req.tenantId);
    const employee = {
      _id: createCompatId("employee"),
      ...(req.body || {}),
      emergencyContact: req.body?.emergencyContact || {},
      documents: req.body?.documents || [],
      performanceNotes: req.body?.performanceNotes || [],
    };
    store.employees.unshift(employee);

    const payrollStore = await getPayrollTenantStore(req.tenantId);
    payrollStore.records.unshift(buildPayrollRecordFromEmployee(employee));

    res.status(201).json({ ok: true, data: employee });
  });

  router.get("/master/hr/employees/:id", requireAuth, tenantMiddleware, async (req, res) => {
    const store = await getHrTenantStore(req.tenantId);
    const employee = store.employees.find((item) => item._id === req.params.id);
    if (!employee) {
      res.status(404).json({ ok: false, message: "Employee not found." });
      return;
    }
    res.json({ ok: true, data: buildEmployeeDetails(store, employee) });
  });

  router.put("/master/hr/employees/:id", requireAuth, tenantMiddleware, async (req, res) => {
    const store = await getHrTenantStore(req.tenantId);
    const index = store.employees.findIndex((item) => item._id === req.params.id);

    if (index === -1) {
      res.status(404).json({ ok: false, message: "Employee not found." });
      return;
    }

    store.employees[index] = {
      ...store.employees[index],
      ...(req.body || {}),
      _id: store.employees[index]._id,
      emergencyContact: req.body?.emergencyContact || store.employees[index].emergencyContact || {},
    };

    const payrollStore = await getPayrollTenantStore(req.tenantId);
    payrollStore.records = payrollStore.records.map((record) =>
      record.employeeRef === req.params.id
        ? {
            ...record,
            employeeName: store.employees[index].fullName,
            employeeId: store.employees[index].employeeId,
            employeeEmail: store.employees[index].email,
            department: store.employees[index].department,
            designation: store.employees[index].designation,
          }
        : record,
    );

    res.json({ ok: true, data: store.employees[index] });
  });

  router.delete("/master/hr/employees/:id", requireAuth, tenantMiddleware, async (req, res) => {
    const store = await getHrTenantStore(req.tenantId);
    store.employees = store.employees.filter((item) => item._id !== req.params.id);
    store.attendanceRecords = store.attendanceRecords.filter((item) => item.employeeId !== req.params.id);
    store.leaveRecords = store.leaveRecords.filter((item) => item.employeeId !== req.params.id);

    const payrollStore = await getPayrollTenantStore(req.tenantId);
    payrollStore.records = payrollStore.records.filter((item) => item.employeeRef !== req.params.id);

    res.json({ ok: true, message: "Deleted successfully." });
  });

  router.post("/master/hr/employees/:id/attendance", requireAuth, tenantMiddleware, async (req, res) => {
    const store = await getHrTenantStore(req.tenantId);
    store.attendanceRecords.unshift({
      _id: createCompatId("attendance"),
      employeeId: req.params.id,
      ...(req.body || {}),
    });
    const employee = store.employees.find((item) => item._id === req.params.id);
    res.json({ ok: true, data: buildEmployeeDetails(store, employee) });
  });

  router.post("/master/hr/employees/:id/leaves", requireAuth, tenantMiddleware, async (req, res) => {
    const store = await getHrTenantStore(req.tenantId);
    store.leaveRecords.unshift({
      _id: createCompatId("leave"),
      employeeId: req.params.id,
      ...(req.body || {}),
    });
    const employee = store.employees.find((item) => item._id === req.params.id);
    res.json({ ok: true, data: buildEmployeeDetails(store, employee) });
  });

  router.get("/master/payroll/summary", requireAuth, tenantMiddleware, async (req, res) => {
    const store = await getPayrollTenantStore(req.tenantId);
    res.json({ ok: true, data: buildPayrollSummary(store) });
  });

  router.get("/master/payroll/records", requireAuth, tenantMiddleware, async (req, res) => {
    const store = await getPayrollTenantStore(req.tenantId);
    const search = String(req.query.search || "").trim().toLowerCase();
    const filtered = store.records.filter((record) => {
      if (
        search &&
        ![record.employeeName, record.employeeId, record.department, record.designation]
          .some((field) => String(field || "").toLowerCase().includes(search))
      ) {
        return false;
      }

      if (req.query.department && record.department !== req.query.department) {
        return false;
      }

      if (req.query.payrollStatus && record.payrollStatus !== req.query.payrollStatus) {
        return false;
      }

      if (req.query.month && record.month !== req.query.month) {
        return false;
      }

      if (req.query.salaryType && record.salaryType !== req.query.salaryType) {
        return false;
      }

      return true;
    });

    const { items, pagination } = paginateItems(filtered, req.query || {});
    res.json({ ok: true, data: { records: items, pagination } });
  });

  router.post("/master/payroll/salary-structures", requireAuth, tenantMiddleware, async (req, res) => {
    const store = await getPayrollTenantStore(req.tenantId);
    const payload = req.body || {};
    const totalAllowances = Object.values(payload.allowances || {}).reduce((sum, value) => sum + Number(value || 0), 0);
    const totalDeductions = Object.values(payload.deductions || {}).reduce((sum, value) => sum + Number(value || 0), 0);
    const basicSalary = Number(payload.basicSalary || 0);
    const record = {
      _id: createCompatId("payroll"),
      ...payload,
      totalAllowances,
      totalDeductions,
      grossSalary: basicSalary + totalAllowances,
      netSalary: Math.max(0, basicSalary + totalAllowances - totalDeductions),
      payrollStatus: "Draft",
      payslipPreview: null,
    };
    store.records.unshift(record);
    store.recentActivity.unshift({ title: `Salary structure created for ${record.employeeName}`, time: new Date().toISOString() });
    res.status(201).json({ ok: true, data: { record } });
  });

  router.put("/master/payroll/salary-structures/:id", requireAuth, tenantMiddleware, async (req, res) => {
    const store = await getPayrollTenantStore(req.tenantId);
    const index = store.records.findIndex((item) => item._id === req.params.id);

    if (index === -1) {
      res.status(404).json({ ok: false, message: "Payroll record not found." });
      return;
    }

    const payload = req.body || {};
    const totalAllowances = Object.values(payload.allowances || {}).reduce((sum, value) => sum + Number(value || 0), 0);
    const totalDeductions = Object.values(payload.deductions || {}).reduce((sum, value) => sum + Number(value || 0), 0);
    const basicSalary = Number(payload.basicSalary || 0);

    store.records[index] = {
      ...store.records[index],
      ...payload,
      totalAllowances,
      totalDeductions,
      grossSalary: basicSalary + totalAllowances,
      netSalary: Math.max(0, basicSalary + totalAllowances - totalDeductions),
      payslipPreview: null,
    };

    res.json({ ok: true, data: { record: store.records[index] } });
  });

  router.post("/master/payroll/preview", requireAuth, tenantMiddleware, async (req, res) => {
    const store = await getPayrollTenantStore(req.tenantId);
    const filtered = store.records.filter((record) => {
      if (req.body?.department && record.department !== req.body.department) {
        return false;
      }
      if (req.body?.month && record.month !== req.body.month) {
        return false;
      }
      if (req.body?.year && Number(record.year) !== Number(req.body.year)) {
        return false;
      }
      return true;
    });

    res.json({
      ok: true,
      data: {
        totals: {
          employees: filtered.length,
          grossSalary: filtered.reduce((sum, item) => sum + Number(item.grossSalary || 0), 0),
          deductions: filtered.reduce((sum, item) => sum + Number(item.totalDeductions || 0), 0),
          netSalary: filtered.reduce((sum, item) => sum + Number(item.netSalary || 0), 0),
        },
      },
    });
  });

  router.post("/master/payroll/process", requireAuth, tenantMiddleware, async (req, res) => {
    const store = await getPayrollTenantStore(req.tenantId);
    store.records = store.records.map((record) =>
      (!req.body?.department || record.department === req.body.department) &&
      (!req.body?.month || record.month === req.body.month) &&
      (!req.body?.year || Number(record.year) === Number(req.body.year))
        ? { ...record, payrollStatus: "Processed" }
        : record,
    );
    store.recentActivity.unshift({ title: "Payroll batch processed", time: new Date().toISOString() });
    res.json({ ok: true, message: "Payroll processed successfully." });
  });

  router.post("/master/payroll/payslips/generate-all", requireAuth, tenantMiddleware, async (req, res) => {
    const store = await getPayrollTenantStore(req.tenantId);
    store.records = store.records.map((record) => {
      if (
        (req.body?.department && record.department !== req.body.department) ||
        (req.body?.month && record.month !== req.body.month) ||
        (req.body?.year && Number(record.year) !== Number(req.body.year))
      ) {
        return record;
      }

      return {
        ...record,
        payslipPreview: createPayslipPreview(record),
      };
    });
    store.recentActivity.unshift({ title: "Payslips generated for payroll cycle", time: new Date().toISOString() });
    res.json({ ok: true, message: "Payslips generated." });
  });

  router.get("/master/payroll/records/:id", requireAuth, tenantMiddleware, async (req, res) => {
    const store = await getPayrollTenantStore(req.tenantId);
    const record = store.records.find((item) => item._id === req.params.id);
    if (!record) {
      res.status(404).json({ ok: false, message: "Payroll record not found." });
      return;
    }
    res.json({ ok: true, data: { record } });
  });

  router.post("/master/payroll/records/:id/payslip", requireAuth, tenantMiddleware, async (req, res) => {
    const store = await getPayrollTenantStore(req.tenantId);
    const index = store.records.findIndex((item) => item._id === req.params.id);

    if (index === -1) {
      res.status(404).json({ ok: false, message: "Payroll record not found." });
      return;
    }

    store.records[index] = {
      ...store.records[index],
      payslipPreview: createPayslipPreview(store.records[index]),
      payrollStatus: req.body?.delivery === "email" ? store.records[index].payrollStatus : store.records[index].payrollStatus,
    };

    res.json({ ok: true, data: { record: store.records[index] } });
  });

  router.patch("/master/payroll/records/:id/mark-paid", requireAuth, tenantMiddleware, async (req, res) => {
    const store = await getPayrollTenantStore(req.tenantId);
    const index = store.records.findIndex((item) => item._id === req.params.id);
    if (index === -1) {
      res.status(404).json({ ok: false, message: "Payroll record not found." });
      return;
    }
    store.records[index] = {
      ...store.records[index],
      payrollStatus: "Paid",
      paymentDate: new Date().toISOString(),
      payslipPreview: createPayslipPreview(store.records[index]),
    };
    res.json({ ok: true, data: { record: store.records[index] } });
  });

  router.patch("/master/payroll/records/:id/approve", requireAuth, tenantMiddleware, async (req, res) => {
    const store = await getPayrollTenantStore(req.tenantId);
    const index = store.records.findIndex((item) => item._id === req.params.id);
    if (index === -1) {
      res.status(404).json({ ok: false, message: "Payroll record not found." });
      return;
    }
    store.records[index] = {
      ...store.records[index],
      payrollStatus: "Approved",
      approval: {
        ...(store.records[index].approval || {}),
        approvedBy: req.user?.name || req.user?.username || "Admin",
        approvalDate: new Date().toISOString(),
        reviewedBy: req.body?.reviewedBy || store.records[index].approval?.reviewedBy || "",
        remarks: req.body?.remarks || store.records[index].approval?.remarks || "",
      },
    };
    res.json({ ok: true, data: { record: store.records[index] } });
  });

  router.patch("/master/payroll/records/:id/reject", requireAuth, tenantMiddleware, async (req, res) => {
    const store = await getPayrollTenantStore(req.tenantId);
    const index = store.records.findIndex((item) => item._id === req.params.id);
    if (index === -1) {
      res.status(404).json({ ok: false, message: "Payroll record not found." });
      return;
    }
    store.records[index] = {
      ...store.records[index],
      payrollStatus: "On Hold",
      approval: {
        ...(store.records[index].approval || {}),
        reviewedBy: req.body?.reviewedBy || store.records[index].approval?.reviewedBy || "",
        remarks: req.body?.remarks || store.records[index].approval?.remarks || "",
      },
    };
    res.json({ ok: true, data: { record: store.records[index] } });
  });

  router.get("/master/payroll/export", requireAuth, tenantMiddleware, async (req, res) => {
    const store = await getPayrollTenantStore(req.tenantId);
    const rows = store.records.map((record) => ({
      employeeId: record.employeeId,
      employeeName: record.employeeName,
      department: record.department,
      designation: record.designation,
      netSalary: record.netSalary,
      payrollStatus: record.payrollStatus,
      month: record.month,
      year: record.year,
    }));
    res.json({ ok: true, data: { rows } });
  });
}
