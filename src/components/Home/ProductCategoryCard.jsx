import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

const ProductCategoryCard = ({ image, title, link, className = "" }) => {
  return (
    <Link to={link} className="block">
      <Card className={`group relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg ${className}`}>
        <CardContent className="p-6">

          {/* Image Container */}
          <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="aspect-square p-4 flex items-center justify-center">
              <img 
                src={image} 
                alt={title}
                className="w-full h-full max-w-[200px] max-h-[200px] object-cover transition-all duration-500 group-hover:scale-110 rounded-2xl shadow-lg"
              />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <span className="text-xs font-semibold text-blue-600">ดูทั้งหมด</span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
              {title}
            </h3>

            {/* Action Button */}
            <Button 
              variant="ghost" 
              className="w-full mt-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 font-semibold py-3 rounded-xl border-0 group-hover:shadow-md transition-all duration-300"
            >
              เลือกดู {title}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full -translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-blue-50/50 to-transparent rounded-full translate-x-8 translate-y-8 group-hover:scale-125 transition-transform duration-700"></div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCategoryCard;