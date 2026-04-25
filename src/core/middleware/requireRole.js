export default function requireRole(...allowedRoles) {
  const roles = allowedRoles.map((role) => String(role || "").toUpperCase());

  return function checkRole(req, res, next) {
    const currentRole = String(req.user?.role || "").toUpperCase();

    if (!currentRole || !roles.includes(currentRole)) {
      res.status(403).json({
        ok: false,
        message: "You do not have permission to access this resource.",
      });
      return;
    }

    next();
  };
}
