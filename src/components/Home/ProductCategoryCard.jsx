import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

const ProductCategoryCard = ({ image, title, link, className = "" }) => {
  return (
    <Link to={link} className="block">
      <Card className={`group relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 sm:hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg ${className}`}>
        <CardContent className="p-2 sm:p-4 lg:p-6">

          {/* Image Container */}
          <div className="relative mb-2 sm:mb-4 lg:mb-6 overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="aspect-square p-1 sm:p-2 lg:p-4 flex items-center justify-center">
              <img 
                src={image} 
                alt={title}
                className="w-full h-full max-w-[80px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-[200px] max-h-[80px] sm:max-h-[120px] md:max-h-[150px] lg:max-h-[200px] object-cover transition-all duration-500 group-hover:scale-110 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg"
              />
            </div>
            
            {/* Floating Badge - Hidden on small mobile */}
            <div className="hidden sm:block absolute top-2 lg:top-3 right-2 lg:right-3 bg-white/90 backdrop-blur-sm px-2 lg:px-3 py-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <span className="text-xs font-semibold text-blue-600">ดูทั้งหมด</span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-1 sm:space-y-2 lg:space-y-3">
            <h3 className="text-xs sm:text-sm md:text-base lg:text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center line-clamp-2">
              {title}
            </h3>

            {/* Action Button - Simplified for mobile */}
            <Button 
              variant="ghost" 
              className="w-full mt-1 sm:mt-2 lg:mt-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 font-semibold py-1 sm:py-2 lg:py-3 rounded-md sm:rounded-lg lg:rounded-xl border-0 group-hover:shadow-md transition-all duration-300 text-xs sm:text-sm lg:text-base touch-manipulation"
            >
              <span className="hidden lg:inline">เลือกดู {title}</span>
              <span className="hidden sm:inline lg:hidden">ดู {title}</span>
              <span className="sm:hidden">ดู</span>
              <ArrowRight className="ml-0.5 sm:ml-1 lg:ml-2 w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>

          {/* Decorative Elements - Scaled down for mobile */}
          <div className="absolute top-0 left-0 w-6 h-6 sm:w-12 sm:h-12 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full -translate-x-3 sm:-translate-x-6 lg:-translate-x-10 -translate-y-3 sm:-translate-y-6 lg:-translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="absolute bottom-0 right-0 w-5 h-5 sm:w-10 sm:h-10 lg:w-16 lg:h-16 bg-gradient-to-tl from-blue-50/50 to-transparent rounded-full translate-x-2.5 sm:translate-x-5 lg:translate-x-8 translate-y-2.5 sm:translate-y-5 lg:translate-y-8 group-hover:scale-125 transition-transform duration-700"></div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCategoryCard;