import React, { useState, useEffect } from "react";
import API from "../api";
import Hero from "./Hero";
import Articles from "./Articles";
import Blog from "./Blog";
import Forum from "./Forum";
import Contact from "./Contact";

// Remove the if (loading) block in Home
const Home = () => {
  const [article, setArticle] = useState(null);
  const [blog, setBlog] = useState(null);
  const [articles, setArticles] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [threads, setThreads] = useState([]);

  const [errors, setErrors] = useState({
    article: false,
    blog: false,
    articles: false,
    blogs: false,
    threads: false,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const results = await Promise.allSettled([
          API.get("/articles?limit=1&page=1"),
          API.get("/blogs?limit=1&page=1"),
          API.get("/articles?limit=4"),
          API.get("/blogs?limit=5"),
          API.get("/threads"),
        ]);

        if (results[0].status === "fulfilled")
          setArticle(results[0].value.data.articles?.[0] || null);
        else setErrors((prev) => ({ ...prev, article: true }));

        if (results[1].status === "fulfilled")
          setBlog(results[1].value.data.blogs?.[0] || null);
        else setErrors((prev) => ({ ...prev, blog: true }));

        if (results[2].status === "fulfilled")
          setArticles(results[2].value.data.articles || []);
        else setErrors((prev) => ({ ...prev, articles: true }));

        if (results[3].status === "fulfilled")
          setBlogs(results[3].value.data.blogs || []);
        else setErrors((prev) => ({ ...prev, blogs: true }));

        if (results[4].status === "fulfilled")
          setThreads(results[4].value.data.threads || []);
        else setErrors((prev) => ({ ...prev, threads: true }));
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="flex flex-col">
      {article || blog ? (
        <section id="home">
          <Hero article={article} blog={blog} />
        </section>
      ) : null}
      {articles.length > 0 && !errors.articles ? (
        <section id="articles" className="mt-16">
          <Articles articles={articles} />
        </section>
      ) : null}
      {blogs.length > 0 && !errors.blogs ? (
        <section id="blog" className="mt-16">
          <Blog blogs={blogs} />
        </section>
      ) : null}
      {threads.length > 0 && !errors.threads ? (
        <section id="forum" className="mt-16">
          <Forum threads={threads} />
        </section>
      ) : null}
      <section id="contact" className="mt-16 mb-30">
        <Contact />
      </section>
    </main>
  );
};

export default Home;
