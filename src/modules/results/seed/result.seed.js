export function getResultSeedData(tenantId = "cgu") {
  return [
    {
      _id: "progress-1",
      tenantId,
      studentId: "CGU2024CSE001",
      semester: 6,
      subjectCode: "CS601",
      subjectName: "Operating Systems",
      attendance: 91,
      marks: 88,
      grade: "A",
      projectTitle: "Kernel Scheduler Analysis",
      projectType: "Individual",
      projectScore: 9,
      remarks: "Strong practical understanding",
    },
    {
      _id: "progress-2",
      tenantId,
      studentId: "CGU2024CSE001",
      semester: 6,
      subjectCode: "CS602",
      subjectName: "Computer Networks",
      attendance: 94,
      marks: 84,
      grade: "A",
      projectTitle: "Campus Routing Simulation",
      projectType: "Group",
      projectScore: 8,
      remarks: "Good collaboration",
    },
  ];
}
