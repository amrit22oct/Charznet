import ForumThread from "../models/ForumThread.js";
import ForumReply from "../models/ForumReply.js";

// -------------------- THREADS --------------------

// Create a new thread
export const createThread = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const thread = await ForumThread.create({
      title,
      content,
      author: req.user._id,
    });

    res.status(201).json({
      message: "Thread created successfully",
      thread,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all threads (with pagination & search)
// Get all threads (no pagination, optional search)
export const getThreads = async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const threads = await ForumThread.find(query)
      .populate("author", "name email avatar")
      .sort({ createdAt: -1 }); // latest first

    res.json({
      total: threads.length,
      threads,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single thread with replies
export const getThreadById = async (req, res) => {
  try {
    const thread = await ForumThread.findById(req.params.id).populate(
      "author",
      "name email avatar"
    );

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    const replies = await ForumReply.find({ thread: thread._id })
      .populate("author", "name email avatar")
      .sort({ createdAt: 1 });

    res.json({
      ...thread.toObject(),
      replies,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a thread and its replies
export const deleteThread = async (req, res) => {
  try {
    const thread = await ForumThread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    if (thread.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this thread" });
    }

    await ForumReply.deleteMany({ thread: thread._id });
    await thread.deleteOne();

    res.json({ message: "Thread and its replies removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------- REPLIES --------------------

// Add reply to a thread
export const addReply = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Reply text is required" });
    }

    const reply = await ForumReply.create({
      thread: req.params.threadId,
      author: req.user._id,
      text,
    });

    res.status(201).json({
      message: "Reply added successfully",
      reply,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
