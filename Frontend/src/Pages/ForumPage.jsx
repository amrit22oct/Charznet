import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import API from "../api";
import Button from "../Components/Buttons/Button";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const ForumPage = () => {
  const [forums, setForums] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const limit = 8;

  useEffect(() => {
    const fetchForums = async () => {
      setLoading(true);
      try {
        const res = await API.get("/threads");
        setForums(res.data.threads || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch forums");
      } finally {
        setLoading(false);
      }
    };
    fetchForums();
  }, []);

  const totalPages = Math.ceil(forums.length / limit);
  const startIndex = (page - 1) * limit;
  const paginatedForums = forums.slice(startIndex, startIndex + limit);

  const handlePrev = () => page > 1 && setPage((prev) => prev - 1);
  const handleNext = () => page < totalPages && setPage((prev) => prev + 1);

  if (loading) return <p className="text-center py-10">Loading forums...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;
  if (!forums.length) return <p className="text-center py-10">No forums found.</p>;

  return (
    <section className="max-w-[800px] mx-auto px-4 md:px-8 py-10">
      <motion.h1
        className="text-3xl md:text-4xl font-bold text-gray-800 mb-8"
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        All Forums
      </motion.h1>

      <div className="flex flex-col gap-4">
        {paginatedForums.map((forum) => {
          const isOpen = expanded === forum._id;
          return (
            <motion.div
              key={forum._id}
              className="rounded-lg  hover:bg-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
              initial="hidden"
              whileInView="visible"
              variants={fadeInUp}
              viewport={{ once: true }}
            >
              <div className="flex justify-between items-center p-4">
                <Link
                  to={`/forum/${forum._id}`}
                  className="font-semibold text-gray-800 text-lg hover:text-indigo-600 transition-colors"
                >
                  {forum.title}
                </Link>
                <button
                  onClick={() => setExpanded(isOpen ? null : forum._id)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {isOpen ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
                </button>
              </div>

              {isOpen && (
                <div className="px-10 pb-4 pt-3 text-gray-700 text-sm space-y-3 border border-gray-200 bg-white rounded-b-lg shadow-inner">
                  <p className="line-clamp-4">{forum.content || "No description available..."}</p>
                  <div className="flex gap-4 mt-2">
                    <Link
                      to={`/forum/${forum._id}`}
                      className="  text-indigo-700 font-medium rounded transition"
                    >
                      View Full
                    </Link>
                   
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <Button onClick={handlePrev} disabled={page === 1}>
          Prev
        </Button>
        <span className="flex items-center text-gray-700 font-semibold">
          Page {page} of {totalPages}
        </span>
        <Button onClick={handleNext} disabled={page === totalPages}>
          Next
        </Button>
      </div>
    </section>
  );
};

export default ForumPage;
