import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { formatSizeForDisplay } from "../../utils/product";
import { toast } from "sonner";
import { createUserCart } from "../../api/User";
import useSrisiamStore from "../../store/Srisiam-store";

const AddToCartDialog = ({ product, open, onOpenChange }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const token = useSrisiamStore((state) => state.token);
  const actionAddtoCart = useSrisiamStore((state) => state.actionAddtoCart);
  const navigate = useNavigate();

  // Helper functions
  const getAvailableSizes = () => {
    if (product?.productsizes && product.productsizes.length > 0) {
      return product.productsizes
        .filter((size) => size.quantity > 0)
        .map((size) => ({
          size: size.size,
          price: parseFloat(size.price),
          quantity: parseInt(size.quantity),
        }));
    }
    return [];
  };

  const getMaxQuantity = () => {
    if (!selectedSize) return 0;
    const sizeData = getAvailableSizes().find(
      (s) => s.size === selectedSize.size
    );
    return sizeData ? sizeData.quantity : 0;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      const sizes = getAvailableSizes();
      setSelectedSize(sizes.length > 0 ? sizes[0] : null);
      setQuantity(1);
      setShowSuccess(false);
    }
  }, [open, product]);

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    const maxQty = getMaxQuantity();
    if (newQuantity >= 1 && newQuantity <= maxQty) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("กรุณาเลือกไซส์");
      return;
    }

    setIsAdding(true);
    try {
      const cartItem = {
        ...product,
        sizeData: selectedSize,
        count: quantity,
      };

      // เพิ่มลง local state
      actionAddtoCart(product, quantity, selectedSize);

      // แสดง Success Animation
      setShowSuccess(true);
      toast.success(
        `เพิ่ม "${product.title}" ไซส์ ${formatSizeForDisplay(
          selectedSize.size
        )} จำนวน ${quantity} ชิ้น ลงตะกร้าแล้ว`
      );

      // ปิด dialog หลังจาก animation เสร็จ
      setTimeout(() => {
        onOpenChange(false);
        setShowSuccess(false);
      }, 1500);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(
        error?.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มสินค้า"
      );
    } finally {
      setIsAdding(false);
    }
  };

  const availableSizes = getAvailableSizes();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {/* Success Animation Overlay */}
        {showSuccess && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
            <div className="text-center space-y-4 animate-in zoom-in duration-300">
              <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                <Check className="w-12 h-12 text-white" strokeWidth={3} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-green-600">
                  เพิ่มสินค้าสำเร็จ!
                </h3>
                <p className="text-gray-600">
                  เพิ่ม {quantity} ชิ้น ลงในตะกร้าแล้ว
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            เพิ่มสินค้าลงตะกร้า
          </DialogTitle>
          <DialogDescription>
            กรุณาเลือกไซส์และจำนวนที่ต้องการ
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Product Info */}
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={
                  product?.images?.[0]?.url || "/images/placeholder.jpg"
                }
                alt={product?.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {product?.title}
              </h3>
              {product?.category && (
                <Badge variant="outline" className="text-xs">
                  {product.category.name}
                </Badge>
              )}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              เลือกไซส์ <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {availableSizes.map((sizeData, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSize(sizeData)}
                  className={`
                    relative px-4 py-3 rounded-lg border-2 transition-all
                    ${
                      selectedSize?.size === sizeData.size
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }
                  `}
                >
                  <div className="font-semibold text-sm">
                    {formatSizeForDisplay(sizeData.size)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatPrice(sizeData.price)}
                  </div>
                  {selectedSize?.size === sizeData.size && (
                    <div className="absolute top-1 right-1">
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            {selectedSize && (
              <p className="text-xs text-gray-500">
                มีสินค้า {selectedSize.quantity} ชิ้น
              </p>
            )}
          </div>

          {/* Quantity Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              จำนวน <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="h-10 w-10"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="flex-1 text-center">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    const maxQty = getMaxQuantity();
                    if (val >= 1 && val <= maxQty) {
                      setQuantity(val);
                    }
                  }}
                  className="w-full text-center text-2xl font-bold border-2 border-gray-200 rounded-lg py-2 focus:border-blue-500 focus:outline-none"
                  min="1"
                  max={getMaxQuantity()}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= getMaxQuantity()}
                className="h-10 w-10"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Price Summary */}
          {selectedSize && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>ราคาต่อชิ้น</span>
                <span>{formatPrice(selectedSize.price)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>จำนวน</span>
                <span>{quantity} ชิ้น</span>
              </div>
              <div className="h-px bg-gray-200"></div>
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>ยอดรวม</span>
                <span className="text-blue-600">
                  {formatPrice(selectedSize.price * quantity)}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isAdding}
          >
            ยกเลิก
          </Button>
          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={!selectedSize || isAdding}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                กำลังเพิ่ม...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                เพิ่มลงตะกร้า
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCartDialog;
