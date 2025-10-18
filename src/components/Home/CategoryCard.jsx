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
    <section className="py-20 bg-white relative overflow-hidden" style={{ backgroundColor: "#f8fafc" }}>
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Angular cuts on edges */}
        <div className="absolute top-0 left-0 w-40 h-full bg-blue-50/50 transform -skew-x-12"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-blue-100/30 transform skew-x-12"></div>
        
        {/* Small geometric shapes */}
        <div className="absolute top-20 left-1/4 w-4 h-4 bg-blue-200/40 transform rotate-45"></div>
        <div className="absolute top-32 right-1/3 w-3 h-3 bg-blue-300/50 transform rotate-45"></div>
        <div className="absolute bottom-20 left-1/3 w-3 h-3 bg-blue-400/30"></div>
        
        {/* Triangle accent */}
        <div
          className="absolute top-16 right-40 w-10 h-10 bg-blue-200/40"
          style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header with Angular Design */}
        <div className="text-center mb-16">
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100/30 to-blue-200/30 transform -skew-x-12 rounded-lg"></div>
            <h2 className="relative text-5xl font-bold mb-6" style={{ color: "#00204E" }}>
              หมวดหมู่สินค้า
            </h2>
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="w-32 h-1.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full shadow-lg"></div>
          </div>

        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <ProductCategoryCard
              key={category.id}
              image={category.image}
              title={category.title}
              link={category.link}
              className="h-[400px]"
            />
          ))}
        </div>

        {/* CTA Section with Angular Background */}
        <div className="text-center mt-20">
          <div className="relative inline-block">
            <div className="absolute -inset-6 bg-gradient-to-r from-blue-50 to-blue-100 transform skew-x-12 rounded-2xl shadow-lg"></div>
            <Link to="/shop">
              <Button 
                size="lg" 
                className="relative px-10 py-5 text-lg font-bold shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl"
                style={{ 
                  backgroundColor: "#00204E",
                  color: "white"
                }}
              >
                ดูสินค้าทั้งหมด
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
