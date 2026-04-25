export function getDepartmentSeedData(tenantId = "cgu") {
  return [
    {
      _id: "department-1",
      tenantId,
      name: "Computer Science and Engineering",
      code: "CSE",
      hodName: "Dr. P. Mohanty",
      description: "Core engineering department for computing programs.",
      status: "active",
    },
    {
      _id: "department-2",
      tenantId,
      name: "Electronics and Communication Engineering",
      code: "ECE",
      hodName: "Dr. R. Sen",
      description: "Electronics and communication programs.",
      status: "active",
    },
  ];
}
