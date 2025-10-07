import React from "react";
import ArticleGrid from "./ArticleGrid";

const sections = [
  {
    title: "The Content is on the Image 1",
    text: "This section contains information overlayed on the image.",
    image:
      "https://cdn.pixabay.com/photo/2025/06/14/11/15/dahlia-9659400_1280.jpg",
  },
  {
    title: "The Content is on the Image 2",
    text: "Another image with text inside the image overlay.",
    image:
      "https://cdn.pixabay.com/photo/2025/06/14/11/15/dahlia-9659400_1280.jpg",
  },
  {
    title: "The Content is on the Image 3",
    text: "You can add as many cards as you want.",
    image:
      "https://cdn.pixabay.com/photo/2025/06/14/11/15/dahlia-9659400_1280.jpg",
  },
  {
    title: "The Content is on the Image 4",
    text: "All content overlays the images.",
    image:
   " https://cdn.pixabay.com/photo/2024/09/28/07/11/leaves-9080442_1280.png",
  },
  {
    title: "The Content is on the Image 5",
    text: "All content overlays the images.",
    image:
   " https://cdn.pixabay.com/photo/2024/09/28/07/11/leaves-9080442_1280.png",
  },
  {
    title: "The Content is on the Image 6",
    text: "All content overlays the images.",
    image:
   " https://cdn.pixabay.com/photo/2024/09/28/07/11/leaves-9080442_1280.png",
  },
];

const ArticleContentSection = () => {
  return (
    <section className="md:p-12 bg-gray-100 mx-32 shadow-lg rounded-2xl space-y-16">
      <ArticleGrid items={sections} />
    </section>
  );
};

export default ArticleContentSection;
