export function getNoticeSeedData(tenantId = "cgu") {
  return [
    {
      _id: "alert-1",
      tenantId,
      noticeType: "alert",
      username: "student1",
      title: "Lab Schedule Updated",
      content: "Wednesday lab starts at 2:30 PM this week.",
      audience: "CSE Sem 6 Section A",
      channel: "Portal",
      status: "Delivered",
      publishedAt: "2026-04-23T10:00:00.000Z",
      authorName: "Prof. A. Sharma",
    },
    {
      _id: "advisory-1",
      tenantId,
      noticeType: "advisory",
      title: "Attendance Improvement",
      content: "Keep weekly absence below one class to stay safe for internals.",
      audience: "Semester 6",
      channel: "Portal",
      status: "accept",
      authorName: "Prof. A. Sharma",
    },
    {
      _id: "announcement-1",
      tenantId,
      noticeType: "announcement",
      title: "Semester Registration Window",
      content: "Registration remains open until April 30 for all departments.",
      audience: "All Students",
      channel: "Portal",
      status: "accept",
    },
  ];
}
