import React from 'react';
import { Link } from 'react-router-dom';
import Loader from '../atoms/Loader';

const ArticleCard = ({ article }) => {
  if (!article) return <Loader />;
  return (
    <div className="border p-4 rounded shadow">
      <Link to={`/articles/${article.id}`}>
        <h3 className="font-bold text-lg">{article.title}</h3>
      </Link>
      <p>{article.summary}</p>
    </div>
  );
};

export default ArticleCard;
