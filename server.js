import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRouter from "./routes/chat.js";
import userRouter from "./routes/user.js";
import path from "path";
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", chatRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

// app.post("/test", async (req, res) => {
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//     },
//     body: JSON.stringify({
//       model: "deepseek/deepseek-r1-0528:free",
//       messages: [{ role: "user", content: req.body.message }],
//     }),
//   };
//   try {
//     const response = await fetch("https://openrouter.ai/api/v1/chat/completions", options);
//     const data = await response.json();
//     res.send(data);
//     console.log(data.choices[0].message.content);
//   } catch (err) {
//     console.error("Error:", err);
//   }
// });
