// src/routes/permissionRoutes.js
const express = require("express");
const { hasPermission } = require("../services/permissionService");
const router = express.Router();

router.get("/check", (req, res) => {
  const { role, action } = req.query;

  if (!role || !action) {
    return res.status(400).json({ error: "role and action are required" });
  }

  const allowed = hasPermission(role, action);
  res.json({ role, action, allowed });
});

module.exports = router;
