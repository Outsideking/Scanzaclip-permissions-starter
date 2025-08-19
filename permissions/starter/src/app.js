// src/app.js
const express = require("express");
const permissionRoutes = require("./routes/permissionRoutes");

const app = express();
app.use(express.json());

app.use("/permissions", permissionRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Permissions service running on ${PORT}`));
