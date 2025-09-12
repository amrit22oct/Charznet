import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Charznet.png";

const Logo = () => {
  const navigate = useNavigate();
  return (
    <div className="cursor-pointer flex items-center" onClick={() => navigate("/")}>
      <img src={logo} alt="Logo" className="w-[100px] h-[42px] object-contain" />
    </div>
  );
};

export default Logo;
