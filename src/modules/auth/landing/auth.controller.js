import User from "../../../internal/landing/models/User.js";

const demoUsers = [
  { username: "user", password: "user123", role: "user" },
];

const ensureDemoUsers = async () => {
  for (const demoUser of demoUsers) {
    const existingUser = await User.findOne({ username: demoUser.username });

    if (!existingUser) {
      await User.create(demoUser);
    }
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    await ensureDemoUsers();

    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    return res.status(200).json({
      success: true,
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed.",
      error: error.message,
    });
  }
};

export { loginUser };


