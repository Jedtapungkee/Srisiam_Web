import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Badge } from "../../ui/badge";
import { 
  ShoppingBag, 
  Package, 
  Tag,
  ShoppingCart 
} from "lucide-react";

const OrderProductDialog = ({ order, open, onOpenChange }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(price);
  };

  const getTotalItems = (products) => {
    return products?.reduce((total, product) => total + product.count, 0) || 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      
      <DialogContent className="max-w-[95vw] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <ShoppingBag className="h-7 w-7 text-blue-600" />
            รายละเอียดคำสั่งซื้อ #{String(order.id).slice(-8)}
          </DialogTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
            {/* Customer Info */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">ข้อมูลลูกค้า</h4>
              <div className="space-y-1 text-gray-700">
                <div><strong>ชื่อ:</strong> {order.orderedBy?.firstName} {order.orderedBy?.lastName}</div>
                <div><strong>อีเมล:</strong> {order.orderedBy?.email}</div>
                <div><strong>เบอร์โทร:</strong> {order.orderedBy?.phone || 'ไม่ระบุ'}</div>
                <div><strong>ที่อยู่:</strong> {order.orderedBy?.address || 'ไม่ระบุ'}</div>
              </div>
            </div>
            
            {/* Order Info */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">ข้อมูลคำสั่งซื้อ</h4>
              <div className="space-y-1 text-gray-700">
                <div><strong>วันที่สั่ง:</strong> {new Date(order.createdAt).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</div>
                <div className="flex items-center gap-2">
                  <strong>สถานะ:</strong> 
                  <Badge className={`${
                    order.orderStatus === 'Completed' ? 'bg-green-100 text-green-800 border-green-300' :
                    order.orderStatus === 'Processing' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                    order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800 border-red-300' :
                    'bg-yellow-100 text-yellow-800 border-yellow-300'
                  }`}>
                    {order.orderStatus === "Not Process" && "รอดำเนินการ"}
                    {order.orderStatus === "Processing" && "กำลังดำเนินการ"}
                    {order.orderStatus === "Completed" && "สำเร็จ"}
                    {order.orderStatus === "Cancelled" && "ยกเลิก"}
                  </Badge>
                </div>
                <div><strong>ยอดรวมสินค้า:</strong> <span className="font-semibold">{formatPrice(order.cartTotal)}</span></div>
                <div><strong>ค่าจัดส่ง:</strong> <span className="font-semibold">{formatPrice(order.shippingCost || 0)}</span></div>
                <div><strong>ยอดรวมทั้งหมด:</strong> <span className="text-green-600 font-bold text-lg">{formatPrice(order.cartTotal + (order.shippingCost || 0))}</span></div>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          {order.products?.map((product, index) => {
            const productData = product.product || product;
            return (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                <div className="flex gap-5">
                  {/* Product Images */}
                  <div className="flex-shrink-0 w-25">
                    <div className="w-28 h-28 relative">
                      {productData?.images?.length > 0 ? (
                        <div className="grid grid-cols-2 gap-1 w-full h-full">
                          {productData.images.slice(0, 4).map((image, imgIndex) => (
                            <div key={imgIndex} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                              <img
                                src={image.secure_url || image.url || "/placeholder.png"}
                                alt={`${productData.title} - ${imgIndex + 1}`}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/placeholder.png";
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 space-y-4">
                    {/* Product Name & Description */}
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {productData?.title}
                      </h4>
                      {productData?.description && (
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {productData.description}
                        </p>
                      )}
                    </div>

                    {/* Product Details in organized grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Category */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                          <Tag className="h-3 w-3" />
                          หมวดหมู่
                        </div>
                        <Badge variant="secondary" className="text-sm">
                          {productData?.category?.name || 'ไม่ระบุ'}
                        </Badge>
                      </div>

                      {/* Education Level */}
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          ระดับการศึกษา
                        </div>
                        <Badge variant="outline" className="text-sm">
                          {productData?.educationLevel?.name || 'ไม่ระบุ'}
                        </Badge>
                      </div>

                      {/* Quantity */}
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          จำนวน
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {product.count} ชิ้น
                        </div>
                      </div>

                      {/* Unit Price */}
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          ราคาต่อชิ้น
                        </div>
                        <div className="text-lg font-semibold text-blue-600">
                          {formatPrice(product.price)}
                        </div>
                      </div>
                    </div>

                    {/* Size Information - Only show if exists */}
                    {(product.size || (productData?.sizes && productData.sizes.length > 0)) && (
                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        {product.size && (
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mr-2">
                              ไซส์ที่เลือก:
                            </span>
                            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                              {product.size}
                            </Badge>
                          </div>
                        )}
                        
                        {productData?.sizes && productData.sizes.length > 0 && (
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                              ไซส์ที่มีทั้งหมด:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {productData.sizes.map((size, sizeIndex) => (
                                <Badge 
                                  key={sizeIndex}
                                  variant={size === product.size ? "default" : "outline"}
                                  className={`text-xs ${
                                    size === product.size 
                                      ? "bg-purple-600 text-white border-purple-600" 
                                      : "text-gray-600 hover:bg-gray-50"
                                  }`}
                                >
                                  {size}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Item Total - Right side */}
                  <div className="flex-shrink-0 text-right space-y-2">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      ยอดรวมรายการนี้
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatPrice(product.price * product.count)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Order Total Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  ยอดรวมทั้งคำสั่งซื้อ
                </h3>
                <div className="text-sm text-gray-600">
                  รวม {order.products?.length} รายการ • {getTotalItems(order.products)} ชิ้น
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">
                  สินค้า: {formatPrice(order.cartTotal)} | ค่าส่ง: {formatPrice(order.shippingCost || 0)}
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {formatPrice(order.cartTotal + (order.shippingCost || 0))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderProductDialog;