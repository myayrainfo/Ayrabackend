export function getDashboardSeedData() {
  return {
    students: {
      total: 1248,
      active: 1186,
    },
    teachers: {
      active: 86,
    },
    finance: {
      collected: 3825000,
      pending: 642000,
      collectionRate: 85,
    },
    studentsByDepartment: [
      { _id: "CSE", count: 420 },
      { _id: "ECE", count: 280 },
      { _id: "ME", count: 210 },
      { _id: "CE", count: 190 },
      { _id: "BBA", count: 148 },
    ],
    monthlyEnrollment: [
      { _id: { year: 2026, month: 1 }, count: 22 },
      { _id: { year: 2026, month: 2 }, count: 35 },
      { _id: { year: 2026, month: 3 }, count: 28 },
      { _id: { year: 2026, month: 4 }, count: 44 },
      { _id: { year: 2026, month: 5 }, count: 39 },
      { _id: { year: 2026, month: 6 }, count: 53 },
    ],
  };
}
