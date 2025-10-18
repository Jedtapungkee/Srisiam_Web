import React, { useState } from "react";
import { Button } from "../ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src="/images/Hero.jpg"
        alt="Hero"
        className={`w-full h-[500px] object-cover rounded-lg shadow-md transition-all duration-500 ${
          isHovered ? "blur-sm scale-105" : "blur-0 scale-100"
        }`}
      />

      {/* Background Overlay */}
      <div
        className={`absolute inset-0 bg-black/20 rounded-lg transition-all duration-500 overflow-hidden ${
          isHovered ? "bg-black/40" : "bg-black/10"
        }`}
      ></div>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h1
          className={`text-white text-8xl font-extrabold mb-4 transition-all duration-500 ${
            isHovered ? "scale-110 text-blue-300" : "scale-100"
          }`}
        >
          SRISIAM
        </h1>

        <h2
          className={`text-white text-4xl font-bold mb-8 transition-all duration-500 ${
            isHovered ? "scale-105" : "scale-100"
          }`}
        >
          School Uniform Store
        </h2>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 transition-all duration-500 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link to="/shop">
            <Button
              variant="outline"
              size="lg"
              className="border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-blue-900 px-8 py-4 text-lg font-bold rounded-full shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              เลือกซื้อเลย
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <p
          className={`text-white text-lg font-medium mt-4 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full transition-all duration-700 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          เครื่องแบบนักเรียนคุณภาพสูง • ส่งฟรีทั่วไทย
        </p>
      </div>
    </div>
  );
};

export default Hero;
