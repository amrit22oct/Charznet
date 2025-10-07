import React from "react";
import CardImage from "../molecules/CardImage"; // make sure path is correct

const cardImages = [
  "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1758801304977-fbb605f3858f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1759590029861-cd53285ab514?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1759434225861-e834192ccdaf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
];

const BrandCarousel = () => {
  return (
    <div className="w-full bg-gray-50 py-12 shadow-lg">
      {/* Card container */}
      <div className="flex flex-wrap justify-center gap-6 sm:gap-8 items-center">
        {cardImages.map((image, index) => (
          <div
            key={index}
            className="relative group w-36 h-24 sm:w-44 sm:h-28 md:w-56 md:h-36 
                       rounded-xl overflow-hidden shadow-lg 
                       transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            <CardImage bgImage={image} />
            {/* Brightness overlay */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
          </div>
        ))}
      </div>

      {/* Follow text */}
      
    </div>
  );
};

export default BrandCarousel;
