import express from "express";
import {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  toggleLikeArticle,
  addComment,
  getComments
} from "../Controllers/articleController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/")
  .get(getArticles)                     // Public
  .post(authMiddleware, createArticle); // Protected

//  Place like/comments routes BEFORE dynamic :idOrSlug route
router.post("/:id/like", authMiddleware, toggleLikeArticle);

router.post("/:id/comments", authMiddleware, addComment);
router.get("/:id/comments", getComments);

router
  .route("/:idOrSlug")
  .get(getArticleById)
  .put(authMiddleware, updateArticle)
  .delete(authMiddleware, deleteArticle);

export default router;
