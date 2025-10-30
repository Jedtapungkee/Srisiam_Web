import React, { useState } from "react";
import { Button } from "../ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group cursor-pointer w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src="/images/Hero.jpg"
        alt="Hero"
        className={`w-full h-60 sm:h-72 md:h-80 lg:h-96 xl:h-[28rem] 2xl:h-[32rem] object-cover transition-all duration-500 ${
          isHovered ? "blur-sm scale-105" : "blur-0 scale-100"
        }`}
      />

      {/* Background Overlay */}
      <div
        className={`absolute inset-0 bg-black/20 transition-all duration-500 overflow-hidden ${
          isHovered ? "bg-black/40" : "bg-black/10"
        }`}
      ></div>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <h1
          className={`text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-2 sm:mb-4 transition-all duration-500 ${
            isHovered ? "scale-110 text-blue-300" : "scale-100"
          }`}
        >
          SRISIAM
        </h1>

        <h2
          className={`text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 sm:mb-6 lg:mb-8 transition-all duration-500 ${
            isHovered ? "scale-105" : "scale-100"
          }`}
        >
          School Uniform Store
        </h2>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-3 sm:gap-4 transition-all duration-500 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link to="/shop">
            <Button
              variant="outline"
              size="lg"
              className="border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-blue-900 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-full shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              เลือกซื้อเลย
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <p
          className={`text-white text-sm sm:text-base lg:text-lg font-medium mt-3 sm:mt-4 bg-white/20 backdrop-blur-sm px-4 sm:px-6 py-2 rounded-full transition-all duration-700 max-w-xs sm:max-w-none ${
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
