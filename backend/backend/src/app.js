const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
require("dotenv").config();

const app = express();

app.use((req, res, next) => {
  console.log(`[REQ] ${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});


app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// routes
const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

app.get("/api/ping", (req, res) => res.json({ ok: true }));

const path = require('path');
const { UPLOAD_DIR } = require('./utils/uploader'); // adjust path
app.use('/uploads', express.static(path.resolve(UPLOAD_DIR)));


module.exports = app;




