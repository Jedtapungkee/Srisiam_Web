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
    // const selectedSize = getSelectedSizeData(product || {});
    // const { price, quantity } = selectedSize;
    // if (quantity < count) {
    //   toast.error("สินค้าขนาดนี้มีไม่เพียงพอ");
    //   return;
    // }
    // const cart = {
    //   ...product,
    //   sizeData: selectedSize,
    //   count: count,
    // };
    // // console.log(cart);
    // try {
    //   await createUserCart(token, { cart });
    //   toast.success("เพิ่มสินค้าลงตะกร้าแล้ว");
    //   navigate("/checkout");

    // } catch (error) {
    //   console.error(error);
    //   toast.error(error?.response?.data?.message || "บันทึกตะกร้าไม่สำเร็จ");
    // }
    // actionAddtoCart(product, count, selectedSize);
    // toast.success("เพิ่มสินค้าลงตะกร้าแล้ว");
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
    <div>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center mb-6 bg-[#c3c5ee] p-4 rounded shadow-sm h-[100px]">
        <Breadcrumb className="flex items-center space-x-2 ">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <h2 className="font-bold text-3xl">SriSiam</h2>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="font-bold" />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <h2 className="text-2xl font-medium">{product.title}</h2>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ฝั่งซ้าย - รูปภาพ */}
          <div className="space-y-4">
            {product.images && product.images.length > 0 ? (
              <>
                {/* Swiper รูปภาพหลัก */}
                <div className="px-10 py-10">
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
                  <div className="px-10">
                    <Swiper
                      modules={[FreeMode, Navigation, Thumbs]}
                      onSwiper={setThumbsSwiper}
                      spaceBetween={10}
                      slidesPerView={4}
                      freeMode={true}
                      watchSlidesProgress={true}
                      navigation={{
                        enabled: product.images.length > 4,
                      }}
                      breakpoints={{
                        480: {
                          slidesPerView: 3,
                        },
                        640: {
                          slidesPerView: 4,
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
              <div className="px-10 py-10">
                <div className="aspect-square bg-gray-200 flex items-center justify-center rounded-lg shadow-md">
                  <span className="text-gray-500">ไม่มีรูปภาพ</span>
                </div>
              </div>
            )}
          </div>

          {/* ฝั่งขวา - ข้อมูลสินค้า */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <p className="text-2xl font-semibold text-red-600">
                ฿{sizeData.price?.toLocaleString()}
              </p>
            </div>

            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">รายละเอียดสินค้า</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* ขนาดสินค้า */}
            {product.productsizes && product.productsizes.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-2">เลือกขนาด</h3>
                <Select
                  value={selectedSizes[product.id] || ""}
                  onValueChange={(value) => handleSizeChange(product.id, value)}
                >
                  <SelectTrigger className="w-24">
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
                        <span className="text-sm text-gray-500">
                          (คงเหลือ: {item.quantity})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="text-gray-500">ไม่มีขนาดให้เลือก</div>
            )}

            {/* จำนวน */}
            <div>
              <h3 className="text-lg font-semibold mb-3">จำนวน</h3>
              <div className="flex items-center space-x-3">
                <button
                  className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                  onClick={() => setCount(count > 1 ? count - 1 : 1)}
                >
                  <Minus size={16} />
                </button>
                <span className="px-2 py-1">{count}</span>
                <button
                  className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                  onClick={() => setCount(count + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* ปุ่มเพิ่มลงตะกร้า */}
            <div className=" flex flex-col md:flex-row  gap-4 pt-4">
              <button
                className=" flex gap-2 text-center w-full bg-[#C0C1D6] border-[#050B72] border-1 text-[#050B72] py-3 px-6 rounded-md font-semibold hover:bg-[#050B72] hover:text-white transition-colors "
                onClick={() => actionAddtoCart(product, count, sizeData)}
              >
                <ShoppingCart className="h-5 w-5" /> เพิ่มลงตะกร้าสินค้า
              </button>
              <button
                className="w-full bg-[#00204E] text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
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
