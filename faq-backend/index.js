import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import faqRoutes from "./src/routes/faqRoutes.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Base route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Use FAQ routes
app.use("/api/faqs", faqRoutes);

// Start server only if not in test mode
if (process.env.NODE_ENV !== "test") {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  // Handle graceful shutdown
  process.on("SIGTERM", () => {
    console.log("🛑 Shutting down server...");
    server.close(() => {
      console.log("✅ Server shut down");
      process.exit(0);
    });
  });
}

// Export for testing
export default app;
