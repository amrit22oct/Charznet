import Article from "../models/Article.js";
import mongoose from "mongoose";
import Comment from "../models/CommentArticle.js";

// Create new article
export const createArticle = async (req, res) => {
  try {
    const article = await Article.create({ ...req.body, author: req.user._id });
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all articles (with search, category, pagination)
export const getArticles = async (req, res) => {
  const { search, category, page = 1, limit = 10 } = req.query;
  const query = {};

  if (search) query.title = { $regex: search, $options: "i" };
  if (category) query.category = category;

  const total = await Article.countDocuments(query);

  const articles = await Article.find(query)
    .populate("author", "name email")
    .populate("category", "name")
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  res.json({
    articles,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  });
};

// Get single article by ID or slug
export const getArticleById = async (req, res) => {
  const { idOrSlug } = req.params;
  let article = null;

  try {
    console.log("Fetching article with:", idOrSlug);

    if (!idOrSlug) {
      return res.status(400).json({ message: "No id or slug provided" });
    }

    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      console.log("Valid ObjectId, searching by _id");
      article = await Article.findById(idOrSlug)
        .populate("author", "name email")
        .populate("category", "name");
    }

    if (!article) {
      console.log("Searching by slug");
      article = await Article.findOne({ slug: idOrSlug })
        .populate("author", "name email")
        .populate("category", "name");
    }

    if (!article) return res.status(404).json({ message: "Article not found" });

    res.json(article);
  } catch (err) {
    console.error("Error fetching article:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update article
export const updateArticle = async (req, res) => {
  const { idOrSlug } = req.params;
  let article = mongoose.Types.ObjectId.isValid(idOrSlug)
    ? await Article.findById(idOrSlug)
    : await Article.findOne({ slug: idOrSlug });

  if (!article) return res.status(404).json({ message: "Article not found" });

  if (
    article.author.toString() !== req.user._id.toString() &&
    req.user.role !== "superadmin"
  ) {
    return res.status(401).json({ message: "Not authorized" });
  }

  Object.assign(article, req.body);
  await article.save();
  res.json(article);
};

// Delete article
export const deleteArticle = async (req, res) => {
  const { idOrSlug } = req.params;
  let article = mongoose.Types.ObjectId.isValid(idOrSlug)
    ? await Article.findById(idOrSlug)
    : await Article.findOne({ slug: idOrSlug });

  if (!article) return res.status(404).json({ message: "Article not found" });

  if (
    article.author.toString() !== req.user._id.toString() &&
    req.user.role !== "superadmin"
  ) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await article.deleteOne();
  res.json({ message: "Article removed" });
};

//like and unlike the article

export const toggleLikeArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    const userId = req.user._id;
    const alreadyLiked = article.likes.includes(userId);

    if (alreadyLiked) {
      article.likes.pull(userId);
    } else {
      article.likes.push(userId);

      await article.save();
      res.json({ likes: article.likes.length, liked: !alreadyLiked });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//adding the comment in the article
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const comment = await Comment.create({
      text,
      author: req.user._id,
      article: req.params.id,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error adding comment:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// get comment for the articles

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.id })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
