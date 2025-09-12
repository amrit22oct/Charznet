import React from "react";
import Image from "../assets/FooterImg.jpg";
import Button from "../Components/Buttons/Button";

const Contact = () => {
  return (
    <section className="w-full max-w-[1240px] mx-auto py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden">
        {/* Left Content */}
        <div className="flex flex-col items-start justify-center bg-black px-20 py-12 text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join our <br />
            <span className="text-yellow-400">Newsletter</span>
          </h1>
          <p className="text-gray-300 max-w-md mb-6">
            Read and share new perspectives on just about any topic. Everyone’s
            welcome.
          </p>

          {/* Input + Button */}
          <div className="flex w-full max-w-md bg-white rounded-full overflow-hidden shadow">
            <input
              type="email"
              placeholder="Type your email"
              className="flex-1 px-4 py-3 text-gray-800 focus:outline-none"
            />
            <Button> send</Button>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full h-[389px] md:h-auto">
          <img
            src={Image}
            alt="Newsletter"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Contact;
