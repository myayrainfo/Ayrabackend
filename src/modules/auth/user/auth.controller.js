import User from "../../../internal/user/models/User.js";
import Student from "../../../internal/user/models/Student.js";

export async function login(req, res, next) {
  try {
    const { role, username, password } = req.body;
    const tenantSlug = req.params.tenant;

    let user = await User.findOne({
      tenantSlug,
      role,
      username,
      password,
    });

    let studentProfile = null;

    if (!user && role === "student") {
      studentProfile = await Student.findOne({
        tenantSlug,
        $or: [{ username }, { studentId: username }],
      }).lean();

      if (studentProfile) {
        user = await User.findOne({
          tenantSlug,
          role,
          username: studentProfile.username,
          password,
        });
      }
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!studentProfile && user.role === "student") {
      studentProfile = await Student.findOne({
        tenantSlug,
        username: user.username,
      }).lean();
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        tenantSlug: user.tenantSlug,
        role: user.role,
        username: user.username,
        displayName: user.displayName,
        photoDataUrl: studentProfile?.photoDataUrl || "",
        profile: studentProfile
          ? {
              studentId: studentProfile.studentId,
              department: studentProfile.department,
              semester: studentProfile.semester,
              section: studentProfile.section,
              email: studentProfile.email,
              phone: studentProfile.phone,
              status: studentProfile.status,
            }
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
}


