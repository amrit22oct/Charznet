import React from "react";

const logoText = "Brainium";
const baseColor = "#1f2937";
const accentColor = "#2563eb";

const Logo = () => {
  return (
    <h1
      className="inline-flex font-bold w-40 cursor-pointer p-0 " // fixed width
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "2.4rem",
        letterSpacing: "0.05em",
      }}
    >
      {logoText.split("").map((letter, index) => (
        <span
          key={index}
          className="inline-block"
          style={{ color: index === 0 ? accentColor : baseColor }}
        >
          {letter}
        </span>
      ))}
    </h1>
  );
};

export default Logo;
