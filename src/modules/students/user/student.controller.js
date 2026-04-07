import Student from "../../../internal/user/models/Student.js";
import AttendanceRecord from "../../../internal/user/models/AttendanceRecord.js";
import LeaveRequest from "../../../internal/user/models/LeaveRequest.js";
import StudentProgress from "../../../internal/user/models/StudentProgress.js";
import SupportContact from "../../../internal/user/models/SupportContact.js";
import TeacherAlert from "../../../internal/user/models/TeacherAlert.js";
import { createDocument, deleteDocument, listDocuments, updateDocument } from "../../../internal/user/utils/crudHandlers.js";

export const listStudents = listDocuments(Student);
export const createStudent = createDocument(Student);
export const updateStudent = updateDocument(Student);
export const deleteStudent = deleteDocument(Student);

export const listLeaveRequests = listDocuments(LeaveRequest);
export const listStudentProgress = listDocuments(StudentProgress);
export const listStudentAttendance = listDocuments(AttendanceRecord);
export const listStudentAlerts = listDocuments(TeacherAlert);
export const listSupportContacts = listDocuments(SupportContact);

export async function createLeaveRequest(req, res, next) {
  try {
    const item = await LeaveRequest.create({
      ...req.body,
      tenantSlug: req.params.tenant,
      status: "pending",
      rejectReason: "",
    });

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
}

export async function updateLeaveRequest(req, res, next) {
  try {
    const item = await LeaveRequest.findOneAndUpdate(
      { _id: req.params.id, tenantSlug: req.params.tenant },
      {
        ...req.body,
        status: "pending",
        rejectReason: "",
      },
      { new: true, runValidators: true },
    );

    if (!item) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(item);
  } catch (error) {
    next(error);
  }
}

export const deleteLeaveRequest = deleteDocument(LeaveRequest);


