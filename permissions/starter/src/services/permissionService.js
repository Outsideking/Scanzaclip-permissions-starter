// src/services/permissionService.js
const { getRolePermissions } = require("../models/permissions");

function hasPermission(role, action) {
  const roleData = getRolePermissions(role);

  if (roleData.bypassCheck) return true;
  if (roleData.access === "all") return true;
  if (Array.isArray(roleData.access) && roleData.access.includes(action)) {
    return true;
  }

  return false;
}

module.exports = { hasPermission };
