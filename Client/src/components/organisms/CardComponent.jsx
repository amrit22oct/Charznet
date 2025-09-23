import React from "react";

const CardComponent = ({ color, index }) => {
  return (
    <div
      className={`bg-${color}-400 h-[400px] w-[500px] shadow-lg flex items-center justify-center text-white text-2xl font-bold `}
    >
      Card {index + 1}
    </div>
  );
};

export default CardComponent;
