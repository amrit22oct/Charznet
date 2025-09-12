import React, { useState, useEffect } from "react";
import API from "../api";
import Hero from "./Hero";
import Articles from "./Articles";
import Blog from "./Blog";
import Forum from "./Forum";
import Contact from "./Contact";

const Home = () => {
  const [loading, setLoading] = useState(true);

  const [article, setArticle] = useState(null);
  const [blog, setBlog] = useState(null);
  const [articles, setArticles] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          articleRes,
          blogRes,
          articlesRes,
          blogsRes,
          threadsRes,
        ] = await Promise.all([
          API.get("/articles?limit=1&page=1"),
          API.get("/blogs?limit=1&page=1"),
          API.get("/articles?limit=4"),
          API.get("/blogs?limit=5"),
          API.get("/threads"),
        ]);

        setArticle(articleRes.data.articles?.[0] || null);
        setBlog(blogRes.data.blogs?.[0] || null);
        setArticles(articlesRes.data.articles || []);
        setBlogs(blogsRes.data.blogs || []);
        setThreads(threadsRes.data.threads || []);
      } catch (err) {
        console.error("Failed to fetch home data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-lg text-gray-500 animate-pulse">Loading Home...</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col">
      <section id="home">
        <Hero article={article} blog={blog} />
      </section>

      <section id="articles" className="mt-16">
        <Articles articles={articles} />
      </section>

      <section id="blog" className="mt-16">
        <Blog blogs={blogs} />
      </section>

      <section id="forum" className="mt-16">
        <Forum threads={threads} />
      </section>

      <section id="contact" className="mt-16 mb-30">
        <Contact />
      </section>
    </main>
  );
};

export default Home;
