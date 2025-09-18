import Blog from "../models/Blog.js";
import Article from "../models/Article.js";
import ForumThread from "../models/ForumThread.js";

export const searchAll = async (req, res) => {
  try {
    const { q, limit = 20, skip = 0, type } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ error: "Search query (q) is required" });
    }

    const searchQuery = { $text: { $search: q } };
    const projection = { score: { $meta: "textScore" } };

    // Ensure numeric values for pagination
    const limitNum = Math.min(Math.max(Number(limit), 1), 100); // cap at 100
    const skipNum = Math.max(Number(skip), 0);

    const modelMap = {
      article: Article,
      blog: Blog,
      forum: ForumThread,
    };

    // Helper to run text search on a model
    const runSearch = async (model, type) => {
      const results = await model
        .find(searchQuery, projection)
        .sort({ score: { $meta: "textScore" } })
        .skip(skipNum)
        .limit(limitNum)
        

      return results.map((r) => ({
        ...r,
        _type: type,
        _score: r.score,
      }));
    };

    const searchTypes = type ? [type] : Object.keys(modelMap);

    const results = await Promise.all(
      searchTypes.map((t) => runSearch(modelMap[t], t))
    );

    let allResults = results.flat();

    // Global sort by score, then by createdAt
    allResults.sort((a, b) => {
      if (b._score !== a._score) return b._score - a._score;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    res.json({
      query: q,
      type: type || "all",
      skip: skipNum,
      limit: limitNum,
      totalCount: allResults.length,
      results: allResults,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
