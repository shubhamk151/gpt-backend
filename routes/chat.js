import express from "express";
const router = express.Router();
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";
import {auth} from "../middleware/auth.js";

// router.post("/test", async (req, res) => {
//   try {
//     const thread = new Thread({
//       threadId: "abcd1234",
//       title: "testing second thread",
//     });

//     const response = await thread.save();
//     res.send(response);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "failed to save in DB" });
//   }
// });

// //get all threads
// router.get("/thread", auth, async (req, res) => {
//   try {
//     const threads = await Thread.find({}).sort({ createdAt: -1 }); //this sort threads by createdAt in descending order
//     res.json(threads);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "failed to retrieve threads" });
//   }
// });

router.get("/thread/:threadId", async (req, res) => {
  try {
    const thread = await Thread.findOne({ threadId: req.params.threadId });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.json(thread.messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "failed to retrieve thread" });
  }
});

router.delete("/thread/:threadId", async (req, res) => {
  try {
    const deletedThread = await Thread.findOneAndDelete({
      threadId: req.params.threadId,
    });
    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ message: "Thread deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "failed to delete thread" });
  }
});

// router.post("/chat", async (req, res) => {
//   const { threadId, message } = req.body;

//   if (!threadId || !message) {
//     res.status(400).json({ error: "missing required fields" });
//   }

//   try {
//     let thread = await Thread.findOne({ threadId });

//     if (!thread) {
//       //create a new thread in Db
//       thread = new Thread({
//         threadId,
//         title: message,
//         messages: [{ role: "user", content: message }],
//       });
//     } else {
//       thread.messages.push({ role: "user", content: message });
//     }

//     const assistantReply = await getOpenAIAPIResponse(message);

//     thread.messages.push({ role: "assistant", content: assistantReply });
//     thread.updatedAt = new Date();

//     await thread.save();
//     res.json({ reply: assistantReply });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "something went wrong" });
//   }
// });








//get all threads
router.get("/thread", auth, async (req, res) => {
  try {
    const threads = await Thread.find({userId: req.user.id}).sort({ createdAt: -1 }); //this sort threads by createdAt in descending order
    res.json(threads);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "failed to retrieve threads" });
  }
});


//add new thread
router.post("/chat", auth, async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "missing required fields" });
  }

  try {
    let thread = await Thread.findOne({ threadId, userId: req.user.id });

    if (!thread) {
      //create a new thread in Db
      thread = new Thread({
        threadId,
        title: message,
        userId: req.user.id,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await getOpenAIAPIResponse(message);

    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    await thread.save();
    res.json({ reply: assistantReply });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "something went wrong" });
  }
});












export default router;
