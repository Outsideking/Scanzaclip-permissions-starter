// src/models/permissions.js
const roles = require("../config/roles.json");

function getRolePermissions(role) {
  return roles[role] || { access: [], bypassCheck: false };
}

module.exports = { getRolePermissions };
