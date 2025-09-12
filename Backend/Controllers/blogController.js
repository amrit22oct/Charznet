
import Blog from "../models/Blog.js";
import Comment from "../models/CommentBlog.js";
import multer from "multer";
import path from "path";

// Setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads")); // store inside /uploads 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });

// Create blog with image
export const createBlog = async (req, res) => {
  try {
    const { title, content, summary, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    // Ensure tags is always an array of strings
    const tagsArray =
      typeof tags === "string"
        ? tags.split(",").map((t) => t.trim())
        : Array.isArray(tags)
        ? tags.map((t) => t.toString().trim())
        : [];

    const blog = await Blog.create({
      title,
      content,
      summary,
      tags: tagsArray,
      image: req.file ? `/uploads/${req.file.filename}` : undefined, // ✅ full path
      author: req.user._id,
    });

    res.status(201).json(blog);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const query = {};
    if (search) query.title = { $regex: search, $options: "i" };

    const totalBlogs = await Blog.countDocuments(query); 
    const blogs = await Blog.find(query)
      .populate("author", "name email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalBlogs / limit);

    res.json({
      blogs,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("author", "name email");
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  res.json(blog);
};

export const updateBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  if (blog.author.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  Object.assign(blog, req.body);
  await blog.save();
  res.json(blog);
};

export const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  if (blog.author.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await blog.deleteOne();
  res.json({ message: "Blog removed" });
};

//like or unlike the  blog
export const toggleLikeBlog = async(req,res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if(!blog) return res.status(404).json({ message: "Blog not found"});

    const userId = req.user._id;
    const alreadyLiked = blog.likes.includes(userId);

    if(alreadyLiked) {
      blog.likes.pull(userId); // unlike
    } else {
      blog.likes.push(userId);

    }
    await blog.save();
    res.json({ likes: blog.likes.length, liked: !alreadyLiked});

  } catch (error) {
    console.err(error);
    res.status(500).json({ message: "Server Error"});
    
  }
};

// Adding the comment

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text is required" });

    const comment = await Comment.create({
      text,
      author: req.user._id,
      blog: req.params.id,
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getComments = async(req,res) => {
  try {
    const comments = await Comment.find({ blog: req.params.id}).populate("author","name email").sort({ createdAt: -1});
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: " Server Error"});
  }
};