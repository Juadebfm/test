// const express = require("express");
// const mongoose = require("mongoose");
// const authRoutes = require("./routes/Auth");
// const productRoutes = require("./routes/product");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("DB connection successful");
//   } catch (error) {
//     console.error("DB connection failed:", error.message);
//   }
// };

// connectDB();

// const PORT = process.env.PORT || 5000;

// app.get("/", (req, res) => {
//   res.status(200).json({
//     message: " Hello! Your backend server is running!",
//     data: {
//       name: "e-commerce-backend data",
//       class: "feb 2025",
//       efficiency: "beginner",
//     },
//   });
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);

// app.listen(PORT, () => {
//   console.log(`server is running on port ${PORT}`);
// });

const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/Auth");
const productRoutes = require("./routes/product");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// --- connect to Mongo only once (reused across invocations) ---
let isDbReady = false;
async function connectDB() {
  if (isDbReady || mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGO_URI);
  isDbReady = true;
  console.log("DB connection successful");
}
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
  } catch (e) {
    console.error("DB error:", e);
  }
  next();
});
// --------------------------------------------------------------

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Hello! Your backend server is running!",
    data: {
      name: "e-commerce-backend data",
      class: "feb 2025",
      efficiency: "beginner",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// ⛔️ Do NOT call app.listen on Vercel.
// ✅ Export a handler instead:
module.exports = (req, res) => app(req, res);
// (Alternatively: module.exports = app);
