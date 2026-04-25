import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import env from "../../config/env.js";
import { getDatabaseState } from "../../core/database/connection.js";
import AuthAccount from "./auth.model.js";
import { adminAccounts, userAccounts } from "../../seed/auth.seed.js";

function createAccessToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

function createRefreshToken(payload) {
  return jwt.sign({ ...payload, type: "refresh" }, env.jwtSecret, { expiresIn: "30d" });
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function mapDbUser(account) {
  return {
    id: String(account._id),
    username: account.username,
    role: account.role,
    tenantId: account.tenantId,
    name: account.name || account.displayName || "",
    displayName: account.displayName || account.name || "",
    email: account.email || "",
    allowedPortals: account.allowedPortals || [],
    profile: account.profile || {},
  };
}

export function getPortalAccess() {
  return {
    masterAdmin: true,
    academics: true,
    accounts: true,
    hr: true,
  };
}

async function loginAdmin({ username, password, portal = "masterAdmin" }) {
  if (getDatabaseState().connected) {
    const account = await AuthAccount.findOne({
      username: normalizeText(username),
      role: { $in: ["ADMIN", "ACADEMICS", "FINANCE"] },
      isActive: true,
    }).lean();

    if (!account || !account.passwordHash) {
      return null;
    }

    const isValid = await bcrypt.compare(password, account.passwordHash);
    if (!isValid) {
      return null;
    }

    const user = mapDbUser(account);

    if (user.allowedPortals.length && !user.allowedPortals.includes(portal)) {
      return { forbidden: true };
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      tenantId: user.tenantId,
      name: user.name,
      portal,
    };

    return {
      accessToken: createAccessToken(payload),
      refreshToken: createRefreshToken(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        email: user.email,
        tenantId: user.tenantId,
      },
    };
  }

  const account = adminAccounts.find(
    (item) => normalizeText(item.username) === normalizeText(username) && item.password === password,
  );

  if (!account) {
    return null;
  }

  if (!account.allowedPortals.includes(portal)) {
    return { forbidden: true };
  }

  const payload = {
    sub: account.id,
    username: account.username,
    role: account.role,
    tenantId: account.tenantId,
    name: account.name,
    portal,
  };

  return {
    accessToken: createAccessToken(payload),
    refreshToken: createRefreshToken(payload),
    user: {
      id: account.id,
      username: account.username,
      role: account.role,
      name: account.name,
      email: account.email,
      tenantId: account.tenantId,
    },
  };
}

async function loginUser({ tenantId, role, username, password }) {
  if (getDatabaseState().connected) {
    const account = await AuthAccount.findOne({
      tenantId: normalizeText(tenantId),
      role: normalizeText(role).toUpperCase(),
      username: normalizeText(username),
      isActive: true,
    }).lean();

    if (!account || !account.passwordHash) {
      return null;
    }

    const isValid = await bcrypt.compare(password, account.passwordHash);
    if (!isValid) {
      return null;
    }

    const user = mapDbUser(account);

    return {
      accessToken: createAccessToken({
        sub: user.id,
        username: user.username,
        role: user.role,
        tenantId: user.tenantId,
        displayName: user.displayName,
      }),
      refreshToken: createRefreshToken({
        sub: user.id,
        username: user.username,
        role: user.role,
        tenantId: user.tenantId,
        displayName: user.displayName,
      }),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        tenantId: user.tenantId,
        displayName: user.displayName,
        email: user.email,
        profile: user.profile,
      },
    };
  }

  const account = userAccounts.find(
    (item) =>
      normalizeText(item.tenantId) === normalizeText(tenantId) &&
      normalizeText(item.role) === normalizeText(role) &&
      normalizeText(item.username) === normalizeText(username) &&
      item.password === password,
  );

  if (!account) {
    return null;
  }

  const payload = {
    sub: account.id,
    username: account.username,
    role: account.role,
    tenantId: account.tenantId,
    displayName: account.displayName,
  };

  return {
    accessToken: createAccessToken(payload),
    refreshToken: createRefreshToken(payload),
    user: {
      id: account.id,
      username: account.username,
      role: account.role,
      tenantId: account.tenantId,
      displayName: account.displayName,
      profile: account.profile,
    },
  };
}

async function refreshSession(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, env.jwtSecret);

    return {
      accessToken: createAccessToken({
        sub: decoded.sub,
        username: decoded.username,
        role: decoded.role,
        tenantId: decoded.tenantId,
        name: decoded.name,
        displayName: decoded.displayName,
        portal: decoded.portal,
      }),
    };
  } catch {
    return null;
  }
}

async function getMe(user) {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    tenantId: user.tenantId,
    portal: user.portal || null,
    name: user.name || "",
  };
}

async function updateProfile(user, payload = {}) {
  const nextName = String(payload.name || "").trim();
  const nextEmail = String(payload.email || "").trim();
  const nextPhone = String(payload.phone || "").trim();

  if (getDatabaseState().connected && user?.id) {
    const account = await AuthAccount.findByIdAndUpdate(
      user.id,
      {
        ...(nextName ? { name: nextName, displayName: nextName } : {}),
        ...(nextEmail ? { email: nextEmail } : {}),
        profile: {
          ...(user.profile || {}),
          phone: nextPhone,
        },
      },
      { new: true },
    ).lean();

    const mappedUser = mapDbUser(account);
    return {
      admin: {
        id: mappedUser.id,
        username: mappedUser.username,
        role: mappedUser.role,
        name: mappedUser.name,
        email: mappedUser.email,
        phone: mappedUser.profile?.phone || nextPhone,
        tenantId: mappedUser.tenantId,
      },
    };
  }

  return {
    admin: {
      id: user.id,
      username: user.username,
      role: user.role,
      name: nextName || user.name || "",
      email: nextEmail || "",
      phone: nextPhone,
      tenantId: user.tenantId,
    },
  };
}

async function changePassword(user, { currentPassword, newPassword } = {}) {
  if (!currentPassword || !newPassword) {
    return { ok: false, message: "Current password and new password are required." };
  }

  if (newPassword.length < 6) {
    return { ok: false, message: "New password must be at least 6 characters long." };
  }

  if (getDatabaseState().connected && user?.id) {
    const account = await AuthAccount.findById(user.id);

    if (!account?.passwordHash) {
      return { ok: false, message: "Account password could not be verified." };
    }

    const matches = await bcrypt.compare(currentPassword, account.passwordHash);
    if (!matches) {
      return { ok: false, message: "Current password is incorrect." };
    }

    account.passwordHash = await bcrypt.hash(newPassword, 10);
    await account.save();

    return { ok: true, message: "Password updated successfully." };
  }

  return { ok: true, message: "Password updated successfully." };
}

async function logout() {
  return {
    ok: true,
    message: "Logged out successfully.",
  };
}

export default {
  getPortalAccess,
  loginAdmin,
  loginUser,
  refreshSession,
  getMe,
  updateProfile,
  changePassword,
  logout,
};
