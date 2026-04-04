import Admin from '../models/Admin.js';
import AppSetting from '../models/AppSetting.js';

export default async function ensureMasterAdmin() {
  const username = (process.env.SUPERADMIN_USERNAME || 'superadmin').toLowerCase();
  const email = (process.env.SUPERADMIN_EMAIL || 'superadmin@erp-system.com').toLowerCase();
  const password = process.env.SUPERADMIN_PASSWORD || 'Admin@1234';

  let admin = await Admin.findOne({
    $or: [{ username }, { email }],
  }).select('+password');

  if (!admin) {
    admin = await Admin.create({
      name: 'Super Admin',
      username,
      email,
      password,
      role: 'superadmin',
      department: 'Administration',
      isActive: true,
      isDeleted: false,
      lastActivityAt: new Date(),
    });
  } else {
    let shouldSave = false;

    if (admin.username !== username) {
      admin.username = username;
      shouldSave = true;
    }

    if (admin.email !== email) {
      admin.email = email;
      shouldSave = true;
    }

    if (admin.role !== 'superadmin') {
      admin.role = 'superadmin';
      shouldSave = true;
    }

    if (!admin.isActive) {
      admin.isActive = true;
      shouldSave = true;
    }

    if (admin.isDeleted) {
      admin.isDeleted = false;
      admin.deletedAt = null;
      admin.deletedBy = null;
      admin.deletionReason = '';
      shouldSave = true;
    }

    const passwordMatches = await admin.matchPassword(password);
    if (!passwordMatches) {
      admin.password = password;
      shouldSave = true;
    }

    if (shouldSave) {
      await admin.save();
    }
  }

  let settings = await AppSetting.findOne({ key: 'portal-access' });
  if (!settings) {
    settings = await AppSetting.create({
      key: 'portal-access',
      portalAccess: {
        accounts: true,
        hr: true,
        academics: true,
        masterAdmin: true,
      },
      updatedBy: admin._id,
    });
  } else {
    settings.portalAccess = {
      accounts: Boolean(settings.portalAccess?.accounts),
      hr: Boolean(settings.portalAccess?.hr),
      academics: Boolean(settings.portalAccess?.academics),
      masterAdmin: true,
    };

    if (!settings.updatedBy) {
      settings.updatedBy = admin._id;
    }

    await settings.save();
  }

  return admin;
}
