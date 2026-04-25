export function getExamSeedData(tenantId = "cgu") {
  return [
    {
      _id: "exam-1",
      tenantId,
      courseCode: "CS601",
      courseName: "Data Structures",
      date: "2026-05-03T09:00:00.000Z",
      startTime: "09:30",
      venue: "Block A - 301",
      examType: "Mid Semester",
      department: "CSE",
      semester: 6,
    },
    {
      _id: "exam-2",
      tenantId,
      courseCode: "EC401",
      courseName: "Digital Electronics",
      date: "2026-05-06T09:00:00.000Z",
      startTime: "11:00",
      venue: "Block B - 204",
      examType: "Internal",
      department: "ECE",
      semester: 4,
    },
  ];
}
