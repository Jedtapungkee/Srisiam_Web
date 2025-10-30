import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import ProductCategoryCard from './ProductCategoryCard';

// Main Cards Component
const CategoryCards = () => {
  const categories = [
    {
      id: 1,
      title: "เสื้อนักเรียน",
      image: "/images/shirt.jpg",
      link: "/shop?category=shirt"
    },
    {
      id: 2,
      title: "กระโปรง/กางเกง",
      image: "/images/bottom.jpg", 
      link: "/shop?category=bottom"
    },
    {
      id: 3,
      title: "รองเท้า",
      image: "/images/shoes.jpg",
      link: "/shop?category=shoes"
    },
    {
      id: 4,
      title: "อุปกรณ์",
      image: "/images/accessories.jpg",
      link: "/shop?category=accessories"
    }
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 xl:py-20 bg-white relative overflow-hidden" style={{ backgroundColor: "#f8fafc" }}>
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Angular cuts on edges - adjusted for mobile */}
        <div className="absolute top-0 left-0 w-16 sm:w-24 lg:w-32 xl:w-40 h-full bg-blue-50/50 transform -skew-x-12"></div>
        <div className="absolute top-0 right-0 w-12 sm:w-20 lg:w-24 xl:w-32 h-full bg-blue-100/30 transform skew-x-12"></div>
        
        {/* Small geometric shapes - hidden on mobile for cleaner look */}
        <div className="hidden sm:block absolute top-20 left-1/4 w-3 h-3 lg:w-4 lg:h-4 bg-blue-200/40 transform rotate-45"></div>
        <div className="hidden sm:block absolute top-32 right-1/3 w-2 h-2 lg:w-3 lg:h-3 bg-blue-300/50 transform rotate-45"></div>
        <div className="hidden sm:block absolute bottom-20 left-1/3 w-2 h-2 lg:w-3 lg:h-3 bg-blue-400/30"></div>
        
        {/* Triangle accent */}
        <div
          className="hidden lg:block absolute top-16 right-40 w-8 h-8 lg:w-10 lg:h-10 bg-blue-200/40"
          style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
        ></div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 relative z-10">
        {/* Section Header with Angular Design */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12 xl:mb-16">
          <div className="relative inline-block">
            <div className="absolute -inset-1 sm:-inset-2 lg:-inset-4 bg-gradient-to-r from-blue-100/30 to-blue-200/30 transform -skew-x-12 rounded-lg"></div>
            <h2 className="relative text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6" style={{ color: "#00204E" }}>
              หมวดหมู่สินค้า
            </h2>
          </div>
          
          <div className="flex justify-center mb-3 sm:mb-4 lg:mb-6">
            <div className="w-16 sm:w-20 md:w-24 lg:w-32 h-0.5 sm:h-1 lg:h-1.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full shadow-lg"></div>
          </div>
        </div>

        {/* Cards Grid - Improved Mobile Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {categories.map((category) => (
            <ProductCategoryCard
              key={category.id}
              image={category.image}
              title={category.title}
              link={category.link}
              className="h-40 sm:h-48 md:h-64 lg:h-80 xl:h-[400px]"
            />
          ))}
        </div>

        {/* CTA Section with Angular Background */}
        <div className="text-center mt-8 sm:mt-12 lg:mt-16 xl:mt-20">
          <div className="relative inline-block">
            <div className="absolute -inset-2 sm:-inset-4 lg:-inset-6 bg-gradient-to-r from-blue-50 to-blue-100 transform skew-x-12 rounded-xl lg:rounded-2xl shadow-lg"></div>
            <Link to="/shop">
              <Button 
                size="lg" 
                className="relative px-4 sm:px-6 md:px-8 lg:px-10 py-2.5 sm:py-3 md:py-4 lg:py-5 text-sm sm:text-base lg:text-lg font-bold shadow-xl transform hover:scale-105 transition-all duration-300 rounded-lg lg:rounded-xl touch-manipulation"
                style={{ 
                  backgroundColor: "#00204E",
                  color: "white"
                }}
              >
                ดูสินค้าทั้งหมด
                <ArrowRight className="ml-1.5 sm:ml-2 lg:ml-3 h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
