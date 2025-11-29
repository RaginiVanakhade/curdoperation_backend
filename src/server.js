import express from "express"; // ES Modules
import cors from "cors";
import userRoutes from "../routes/uth.js"; // Import router

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", userRoutes);

app.listen(3001, () => {
  console.log("✅ Server running on http://localhost:3001");
});
