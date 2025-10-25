import React from "react";
import { formatSizeForDisplay } from "../../utils/product";
import { Badge } from "../ui/badge";
import { Package } from "lucide-react";

const OrderItem = ({ item }) => {
//   console.log("OrderItem data:", item);
  
  const getProductImage = () => {
    // ลำดับความสำคัญในการหารูปภาพ
    if (item.product?.images && item.product.images.length > 0) {
      const imageUrl = item.product.images[0].secure_url || item.product.images[0].url;
      return imageUrl;
    }
    
    // Fallback: ใช้รูป placeholder
    return "https://via.placeholder.com/150?text=No+Image";
  };

  const totalPrice = (item.price * item.count).toFixed(2);

  return (
    <div className="flex gap-4 p-3 hover:bg-muted/50 rounded-lg transition-colors">
      {/* Product Image */}
      <div className="relative w-20 h-20 flex-shrink-0">
        <img
          src={getProductImage()}
          alt={item.product?.title || "Product"}
          className="w-full h-full object-cover rounded-md border bg-muted"
          onError={(e) => {
            console.error("Image load error for:", e.target.src);
            e.target.src = "https://via.placeholder.com/150?text=Error";
          }}
        />
        <Badge 
          className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center p-0 text-xs"
        >
          {item.count}
        </Badge>
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-2 mb-1">
          {item.product?.title || "ไม่ระบุชื่อสินค้า"}
        </h4>
        
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {item.size && (
            <Badge variant="outline" className="text-xs">
              ไซส์: {formatSizeForDisplay(item.size)}
            </Badge>
          )}
          {item.product?.category && (
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              {item.product.category.name}
            </span>
          )}
        </div>
      </div>

      {/* Price Details */}
      <div className="text-right flex-shrink-0">
        <div className="font-semibold text-sm">฿{totalPrice}</div>
        <div className="text-xs text-muted-foreground">
          ฿{item.price.toFixed(2)} x {item.count}
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
