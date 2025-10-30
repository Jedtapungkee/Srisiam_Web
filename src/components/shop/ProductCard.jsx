import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  ShoppingCart,
  Shirt,
} from "lucide-react";
import { formatSizeForDisplay } from "../../utils/product";
import AddToCartDialog from "./AddToCartDialog";

const ProductCard = ({ product, className = "" }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

//   console.log("Product in ProductCard:", product);

  // Helper function to get price from productSizes
  const getProductPrice = () => {
    if (product.productsizes && product.productsizes.length > 0) {
      // Get the first available size's price or find lowest price
      const prices = product.productsizes.map(size => parseFloat(size.price)).filter(price => !isNaN(price));
      return prices.length > 0 ? Math.min(...prices) : 0;
    }
    return parseFloat(product.price) || 0;
  };

  // Helper function to get total quantity from all sizes
  const getTotalQuantity = () => {
    if (product.productsizes && product.productsizes.length > 0) {
      return product.productsizes.reduce((total, size) => {
        const qty = parseInt(size.quantity) || 0;
        return total + qty;
      }, 0);
    }
    return parseInt(product.quantity) || 0;
  };

  // Helper function to get available sizes
  const getAvailableSizes = () => {
    if (product.productsizes && product.productsizes.length > 0) {
      return product.productsizes.map(size => size.size).filter(size => size);
    }
    return product.sizes || [];
  };

  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return '฿0';
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDialogOpen(true);
  };

  return (
    <>
      <AddToCartDialog
        product={product}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
      
      <Link to={`/product/${product.id}`} className="block group">
      <Card
        className={`overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 sm:hover:-translate-y-2 bg-white border-0 shadow-md ${className}`}
      >
        <CardContent className="p-0">
          {/* Image Container */}
          <div className="relative overflow-hidden bg-gray-100 aspect-square">
            <img
              src={
                product.images && product.images[0]
                  ? product.images[0].url
                  : "/images/placeholder.jpg"
              }
              alt={product.title}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setIsImageLoaded(true)}
            />

            {/* Loading Skeleton */}
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <Shirt className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
              </div>
            )}

            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">

              {/* Quick Add to Cart */}
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                <Button
                  onClick={handleAddToCart}
                  size="sm"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg text-xs sm:text-sm py-2 sm:py-3"
                >
                  <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">เพิ่มในตะกร้า</span>
                  <span className="sm:hidden">เพิ่ม</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-2 sm:p-3 lg:p-4 space-y-1.5 sm:space-y-2 lg:space-y-3">
            {/* Category & Education Level */}
            <div className="flex items-center justify-between text-xs">
              {product.category && (
                <Badge
                  variant="outline"
                  className="text-blue-600 border-blue-200 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1"
                >
                  {product.category.name}
                </Badge>
              )}
              {product.educationLevel && (
                <Badge
                  variant="outline"
                  className="text-gray-600 border-gray-200 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1"
                >
                  {product.educationLevel.name}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h3 className="font-bold text-xs sm:text-sm lg:text-base text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
              {product.title}
            </h3>

            {/* Description - Hidden on mobile for space */}
            {product.description && (
              <p className="hidden sm:block text-xs lg:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {product.description.substring(0, 20)}...
              </p>
            )}

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <div className="flex flex-col">
                  <span className="font-bold text-sm sm:text-base lg:text-lg text-gray-800">
                    {formatPrice(getProductPrice())}
                  </span>
                  {product.originalPrice && product.originalPrice > getProductPrice() && (
                    <span className="text-xs text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="text-right">
                {getTotalQuantity() > 0 ? (
                  <span className="text-xs text-green-600 font-medium">
                    <span className="hidden sm:inline">มีสินค้า </span>{getTotalQuantity()}<span className="hidden lg:inline"> ชิ้น</span>
                  </span>
                ) : (
                  <span className="text-xs text-red-500 font-medium">
                    <span className="hidden sm:inline">สินค้า</span>หมด
                  </span>
                )}
              </div>
            </div>

            {/* Available Sizes */}
            {getAvailableSizes().length > 0 && (
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-600 flex-shrink-0">ขนาด:</span>
                <div className="flex space-x-1 flex-wrap">
                  {getAvailableSizes().slice(0, 2).map((size, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 px-1 sm:px-1.5 lg:px-2 py-0.5 lg:py-1 rounded"
                    >
                      {formatSizeForDisplay(size)}
                    </span>
                  ))}
                  {getAvailableSizes().length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{getAvailableSizes().length - 2}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Add to Cart Button */}
            <div className="block sm:hidden mt-2">
              <Button
                onClick={handleAddToCart}
                size="sm"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-md shadow-md text-xs py-2 touch-manipulation"
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                เพิ่มในตะกร้า
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
    </>
  );
};

export default ProductCard;
