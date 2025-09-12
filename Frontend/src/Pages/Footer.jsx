import React from "react";
import Logo from "../assets/Charznet.png";
import CarImg from "../assets/FooterCar.png";
import { FaFacebookF, FaInstagram, FaTelegramPlane } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-gray-900 text-gray-200 pt-12 pb-6 px-6">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo & Description */}
        <div className="flex flex-col gap-4 z-10 relative">
          <img src={Logo} alt="Charznet Logo" className="w-40" />
          <p className="text-base md:text-lg leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo modi debitis explicabo porro
            delectus iste facilis alias, veritatis nobis ipsum, facere deleniti doloribus, provident sit hic.
          </p>
          <div className="flex gap-4 mt-2 text-xl text-yellow-400">
            <a href="#" className="hover:text-white"><FaFacebookF /></a>
            <a href="#" className="hover:text-white"><FaTelegramPlane /></a>
            <a href="#" className="hover:text-white"><FaInstagram /></a>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex justify-between md:justify-center gap-12 z-10 relative">
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-lg mb-2">Navigation</h3>
            <a href="#home" className="hover:text-yellow-400 text-base">Home</a>
            <a href="#news" className="hover:text-yellow-400 text-base">News</a>
            <a href="#blog" className="hover:text-yellow-400 text-base">Blog</a>
            <a href="#forum" className="hover:text-yellow-400 text-base">Forum</a>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-lg mb-2">More</h3>
            <a href="#about" className="hover:text-yellow-400 text-base">About</a>
            <a href="#contact" className="hover:text-yellow-400 text-base">Contact</a>
            <a href="#privacy" className="hover:text-yellow-400 text-base">Privacy</a>
            <a href="#terms" className="hover:text-yellow-400 text-base">Terms</a>
          </div>
        </div>

        {/* Empty placeholder to balance the grid */}
       
      </div>

      {/* Footer image in bottom-right corner */}
      {/* Footer image in bottom-right corner */}
      <div className="absolute bottom-0 right-0 opacity-80 pointer-events-none">
  <img
    src={CarImg}
    alt="Car"
    className="object-contain   object-bottom-right h-[325px] w-[476px]"
  />
</div>



    </footer>
  );
};

export default Footer;
