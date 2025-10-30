import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { readProduct } from "../api/Product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import "./ProductDetails.css";
import { formatSizeForDisplay } from "../utils/product";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import useSrisiamStore from "../store/Srisiam-store";
import { toast } from "sonner";
import { createUserCart } from "../api/User";
import AddToCartDialog from "../components/shop/AddToCartDialog";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});
  // console.log("Product state:", product);
  // console.log("Selected Sizes state:", selectedSizes);
  const actionAddtoCart = useSrisiamStore((state) => state.actionAddtoCart);
  const token = useSrisiamStore((state) => state.token);

  const [count, setCount] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const fetchProductDetails = async (id) => {
    try {
      const res = await readProduct(id);
      setProduct(res.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    fetchProductDetails(id);
  }, [id]);

  useEffect(() => {
    // Guard against product being null on initial mount
    if (!product) return;

    const initialSizes = {};
    if (product.productsizes && product.productsizes.length > 0) {
      initialSizes[product.id] = product.productsizes[0].size;
    }
    setSelectedSizes(initialSizes);
  }, [product]);
  
  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  const getSelectedSizeData = (product) => {
    const selectedSize = selectedSizes[product.id];
    const sizeData = product.productsizes?.find(
      (ps) => ps.size === selectedSize
    );
    return (
      sizeData ||
      product.productsizes?.[0] || { price: 0, quantity: 0, sold: 0 }
    );
  };

  const sizeData = getSelectedSizeData(product || {});
  // console.log("Size Data:", sizeData);

  // console.log(product)

  const handleBuynow = async () => {
    const selectedSize = getSelectedSizeData(product || {});
    const { price, quantity } = selectedSize;
    if (quantity < count) {
      toast.error("สินค้าขนาดนี้มีไม่เพียงพอ");
      return;
    }
    const cartItem = {
      ...product,
      sizeData: selectedSize,
      count: count,
    };
    // console.log(cartItem);
    if (!token) {
      toast.error("กรุณาเข้าสู่ระบบเพื่อทำการสั่งซื้อ");
      navigate("/auth/login");
      return;
    }
    try {
      // ส่งเป็น array ที่มี 1 item
      await createUserCart(token, { cart: [cartItem] });
      toast.success("เพิ่มสินค้าลงตะกร้าแล้ว");
      navigate("/checkout");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "บันทึกตะกร้าไม่สำเร็จ");
      return; // หยุดการทำงานถ้าเกิด error
    }
    actionAddtoCart(product, count, selectedSize);
  };

  if (!product) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">กำลังโหลด...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add to Cart Dialog */}
      <AddToCartDialog
        product={product}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
      {/* Breadcrumb Navigation */}
      <div className="flex items-center mb-4 sm:mb-6 bg-[#c3c5ee] p-3 sm:p-4 rounded shadow-sm h-[80px] sm:h-[100px]">
        <Breadcrumb className="flex items-center space-x-2">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl">
                Srisiam
              </h2>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="font-bold" />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <h2 className="text-sm sm:text-lg lg:text-2xl font-medium line-clamp-1">
                {product.title}
              </h2>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* ฝั่งซ้าย - รูปภาพ */}
          <div className="space-y-3 sm:space-y-4">
            {product.images && product.images.length > 0 ? (
              <>
                {/* Swiper รูปภาพหลัก */}
                <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-10">
                  <Swiper
                    modules={[Navigation, Thumbs]}
                    thumbs={{
                      swiper:
                        thumbsSwiper && !thumbsSwiper.destroyed
                          ? thumbsSwiper
                          : null,
                    }}
                    className="main-swiper product-main-swiper aspect-square rounded-lg overflow-hidden shadow-md"
                  >
                    {product.images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={image.url}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* Swiper รูปภาพย่อย (Thumbnails) */}
                {product.images.length > 1 && (
                  <div className="px-4 sm:px-6 lg:px-10">
                    <Swiper
                      modules={[FreeMode, Navigation, Thumbs]}
                      onSwiper={setThumbsSwiper}
                      spaceBetween={8}
                      slidesPerView={3}
                      freeMode={true}
                      watchSlidesProgress={true}
                      navigation={{
                        enabled: product.images.length > 4,
                      }}
                      breakpoints={{
                        480: {
                          slidesPerView: 3,
                          spaceBetween: 10,
                        },
                        640: {
                          slidesPerView: 4,
                          spaceBetween: 10,
                        },
                      }}
                      className="thumbs-swiper product-thumbs-swiper"
                    >
                      {product.images.map((image, index) => (
                        <SwiperSlide key={index}>
                          <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all duration-200 cursor-pointer">
                            <img
                              src={image.url}
                              alt={`${product.name} thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}
              </>
            ) : (
              <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-10">
                <div className="aspect-square bg-gray-200 flex items-center justify-center rounded-lg shadow-md">
                  <span className="text-gray-500 text-sm sm:text-base">
                    ไม่มีรูปภาพ
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ฝั่งขวา - ข้อมูลสินค้า */}
          <div className="space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 line-clamp-2">
                {product.title}
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-red-600">
                ฿{sizeData.price?.toLocaleString()}
              </p>
            </div>

            {product.description && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  รายละเอียดสินค้า
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* ขนาดสินค้า */}
            {product.productsizes && product.productsizes.length > 0 ? (
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  เลือกขนาด
                </h3>
                <Select
                  value={selectedSizes[product.id] || ""}
                  onValueChange={(value) => handleSizeChange(product.id, value)}
                >
                  <SelectTrigger className="w-full sm:w-32 h-10 sm:h-11">
                    <SelectValue>
                      {selectedSizes[product.id]
                        ? formatSizeForDisplay(selectedSizes[product.id])
                        : "เลือกขนาด"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {product.productsizes.map((item) => (
                      <SelectItem key={item.size} value={item.size}>
                        {formatSizeForDisplay(item.size)}{" "}
                        <span className="text-xs sm:text-sm text-gray-500">
                          (คงเหลือ: {item.quantity})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="text-gray-500 text-sm sm:text-base">
                ไม่มีขนาดให้เลือก
              </div>
            )}

            {/* จำนวน */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3">จำนวน</h3>
              <div className="flex items-center space-x-3">
                <button
                  className="w-10 h-10 sm:w-12 sm:h-12 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
                  onClick={() => setCount(count > 1 ? count - 1 : 1)}
                >
                  <Minus size={16} className="sm:w-5 sm:h-5" />
                </button>
                <span className="px-3 py-2 text-base sm:text-lg font-medium min-w-[50px] text-center">
                  {count}
                </span>
                <button
                  className="w-10 h-10 sm:w-12 sm:h-12 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
                  onClick={() => setCount(count + 1)}
                >
                  <Plus size={16} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* ปุ่มเพิ่มลงตะกร้า */}
            <div className="flex flex-col gap-3 sm:gap-4 pt-4">
              <button
                className="flex items-center justify-center gap-2 w-full bg-[#C0C1D6] border border-[#050B72] text-[#050B72] py-3 px-4 sm:px-6 rounded-md font-semibold hover:bg-[#050B72] hover:text-white transition-colors text-sm sm:text-base touch-manipulation"
                onClick={() => setIsDialogOpen(true)}
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />{" "}
                เพิ่มลงตะกร้าสินค้า
              </button>
              <button
                className="w-full bg-[#00204E] text-white py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm sm:text-base touch-manipulation"
                onClick={handleBuynow}
              >
                ซื้อทันที
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
