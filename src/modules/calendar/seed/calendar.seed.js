export function getCalendarSeedData(tenantId = "cgu") {
  return [
    {
      _id: "event-1",
      tenantId,
      year: 2026,
      eventDate: "2026-05-02",
      eventName: "Mid Semester Exam Starts",
      eventType: "Academic",
      venue: "Main Block",
      coordinator: "Academic Office",
      audience: "All Students",
    },
    {
      _id: "event-2",
      tenantId,
      year: 2026,
      eventDate: "2026-05-14",
      eventName: "Hackathon Sprint",
      eventType: "Hackathon",
      venue: "Innovation Lab",
      coordinator: "Communication Cell",
      audience: "CSE Students",
    },
  ];
}
