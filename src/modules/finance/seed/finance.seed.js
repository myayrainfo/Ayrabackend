export function getFinanceSeedData(tenantId = "cgu") {
  return [
    {
      _id: "finance-1",
      tenantId,
      recordType: "fee-payment",
      title: "Semester Fee",
      studentId: "CGU2024CSE001",
      studentName: "Rahul Nayak",
      amount: 85000,
      status: "paid",
      dueDate: "2026-04-15",
      paidAt: "2026-04-12T10:00:00.000Z",
    },
    {
      _id: "finance-2",
      tenantId,
      recordType: "fee-payment",
      title: "Transport Fee",
      studentId: "CGU2024CSE002",
      studentName: "Ananya Das",
      amount: 3200,
      status: "pending",
      dueDate: "2026-04-20",
    },
  ];
}
