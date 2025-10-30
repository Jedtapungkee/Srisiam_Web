import useSrisiamStore from "../../store/Srisiam-store";
import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Minus, Plus, Trash2, Package, ListCheck } from "lucide-react";
import { formatSizeForDisplay } from "../../utils/product";
import { Checkbox } from "../ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createUserCart } from "../../api/User";
import CartSkeleton from "./CartSkeleton";
import EmptyCart from "./EmptyCart";

const ListCarts = () => {
  const navigate = useNavigate();
  const carts = useSrisiamStore((state) => state.carts);
  const user = useSrisiamStore((state) => state.user);
  const token = useSrisiamStore((state) => state.token);
  const removeCart = useSrisiamStore((state) => state.actionRemoveFromCart);
  const actionClearCart = useSrisiamStore((state) => state.actionClearCart);
  const actionUpdateCartItemCount = useSrisiamStore(
    (state) => state.actionUpdateCartItemCount
  );
  const getSelectedTotalPrice = useSrisiamStore(
    (state) => state.getSelectedTotalPrice
  );
  const getSelectedItemsCount = useSrisiamStore(
    (state) => state.getSelectedItemsCount
  );
  const getTotalPrice = useSrisiamStore((state) => state.getTotalPrice);

  // State สำหรับจัดการ checkbox และ loading
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // console.log(carts);



  // สร้าง unique key สำหรับแต่ละ item
  const getItemKey = (item) => `${item.id}-${item.sizeData.size}`;

  // ฟังก์ชันสำหรับ toggle checkbox ของ item แต่ละอัน
  const handleItemSelect = (item) => {
    const itemKey = getItemKey(item);
    const newSelectedItems = new Set(selectedItems);

    if (selectedItems.has(itemKey)) {
      newSelectedItems.delete(itemKey);
    } else {
      newSelectedItems.add(itemKey);
    }

    setSelectedItems(newSelectedItems);
  };

  // ฟังก์ชันสำหรับ toggle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
    } else {
      const allItemKeys = carts.map((item) => getItemKey(item));
      setSelectedItems(new Set(allItemKeys));
    }
  };

//   console.log({ carts });

  const handleSaveCart = async () => {
    // กรองเฉพาะสินค้าที่เลือกไว้
    const selectedCartItems = carts.filter(item => 
      selectedItems.has(getItemKey(item))
    );
    
    const cart = selectedCartItems;
    try {
      const res = await createUserCart(token, { cart });
      toast.success("บันทึกตะกร้าสินค้าเสร็จสิ้น");
      navigate("/checkout");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "บันทึกตะกร้าไม่สำเร็จ");
    }
  };
  // console.log({carts})

  // useEffect สำหรับ reset เมื่อ cart ว่าง
  useEffect(() => {
    if (carts.length === 0) {
      setSelectAll(false);
      setSelectedItems(new Set());
    }
  }, [carts.length]);

  // useEffect สำหรับตรวจสอบ selectAll
  useEffect(() => {
    if (carts.length > 0) {
      const allItemKeys = carts.map((item) => getItemKey(item));
      const isAllSelected = allItemKeys.every((key) => selectedItems.has(key));
      setSelectAll(isAllSelected);
    }
  }, [selectedItems, carts]);

  // useEffect แยกสำหรับ loading
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // คำนวณราคารวมของ items ที่เลือก
  const calculateSelectedTotal = () => {
    return getSelectedTotalPrice(selectedItems);
  };

  // นับจำนวน items ที่เลือก
  const getSelectedCount = () => {
    return getSelectedItemsCount(selectedItems);
  };

  // แสดง loading skeleton
  if (isLoading) {
    return <CartSkeleton />;
  }

  // แสดง empty state เมื่อไม่มีสินค้า
  if (carts.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="flex items-center mb-4 sm:mb-6 bg-[#c3c5ee] p-3 sm:p-4 rounded shadow-sm h-[80px] sm:h-[100px]">
        <Breadcrumb className="flex items-center space-x-2">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl">Srisiam</h2>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="font-bold" />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-medium">ตะกร้าสินค้า</h2>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2 mb-4">
        <div className="flex items-center gap-2">
          <ListCheck size={24} className="sm:w-6 sm:h-6" />
          <p className="font-bold text-lg sm:text-xl">
            รายการสินค้าในตะกร้า {carts.length} รายการ
          </p>
        </div>
        <div>
          <button 
            className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm sm:text-base" 
            onClick={() => {
              actionClearCart();
              setSelectedItems(new Set());
            }}
          >
            ลบตะกร้าสินค้า
          </button>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {carts.map((item) => (
          <div key={getItemKey(item)} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-start space-x-3">
              {/* Checkbox */}
              <Checkbox
                checked={selectedItems.has(getItemKey(item))}
                onCheckedChange={() => handleItemSelect(item)}
                className="mt-2"
              />
              
              {/* Product Image */}
              <div className="flex-shrink-0">
                {item.images.length > 0 ? (
                  <img
                    src={item.images[0].url}
                    alt={item.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm sm:text-base text-gray-900 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  ไซส์: {formatSizeForDisplay(item.sizeData.size)}
                </p>
                <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                  ฿{item.sizeData.price}
                </p>
                
                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <button
                      className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                      onClick={() =>
                        actionUpdateCartItemCount(
                          item.id,
                          item.sizeData,
                          item.count - 1
                        )
                      }
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-2 py-1 text-sm font-medium">{item.count}</span>
                    <button
                      className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                      onClick={() =>
                        actionUpdateCartItemCount(
                          item.id,
                          item.sizeData,
                          item.count + 1
                        )
                      }
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-red-500 font-bold text-sm sm:text-base">
                      ฿{item.sizeData.price * item.count}
                    </span>
                    <button onClick={() => removeCart(item.id, item.sizeData)}>
                      <Trash2 className="text-red-500 w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Table className="shadow-sm bg-gray-100 rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead className="w-24"></TableHead>
              <TableHead>รูปสินค้า</TableHead>
              <TableHead>ชื่อสินค้า</TableHead>
              <TableHead>ราคาต่อชิ้น</TableHead>
              <TableHead>จำนวน</TableHead>
              <TableHead>ราคารวม</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carts.map((item) => (
              <TableRow key={getItemKey(item)}>
                <TableCell className="text-center">
                  <Checkbox
                    checked={selectedItems.has(getItemKey(item))}
                    onCheckedChange={() => handleItemSelect(item)}
                    className="bg-gray-100 hover:bg-gray-200 transition-colors"
                  />
                </TableCell>
                <TableCell>
                  <div className="relative">
                    {item.images.length > 0 ? (
                      <img
                        src={item.images[0].url}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {item.title}
                  <div className="text-sm text-gray-500">
                    ไซส์: {formatSizeForDisplay(item.sizeData.size)}
                  </div>
                </TableCell>
                <TableCell>฿{item.sizeData.price}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <button
                      className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                      onClick={() =>
                        actionUpdateCartItemCount(
                          item.id,
                          item.sizeData,
                          item.count - 1
                        )
                      }
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-2 py-1">{item.count}</span>
                    <button
                      className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                      onClick={() =>
                        actionUpdateCartItemCount(
                          item.id,
                          item.sizeData,
                          item.count + 1
                        )
                      }
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="text-red-500">
                  ฿{item.sizeData.price * item.count}
                </TableCell>
                <TableCell>
                  <button onClick={() => removeCart(item.id, item.sizeData)}>
                    <Trash2 className="text-red-500" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary Footer */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-2 mt-6 lg:mt-8 p-4 lg:pl-10 lg:p-8 bg-white lg:bg-gray-100 rounded-md shadow-sm">
        <div className="flex items-center space-x-2">
          <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
          <p className="text-sm sm:text-base">เลือกทั้งหมด ({carts.length})</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
          <p className="text-sm sm:text-base">เลือก ({getSelectedCount()} ชิ้น)</p>
          <div className="text-xl sm:text-2xl font-bold text-red-500">
            ฿ {calculateSelectedTotal().toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm text-gray-500">
            จากทั้งหมด ฿ {getTotalPrice().toLocaleString()}
          </div>
          {user ? (
            <button
              className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-md mt-2 text-sm sm:text-base ${
                getSelectedCount() > 0
                  ? "bg-[#00204E] text-white hover:bg-[#033479]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={getSelectedCount() === 0}
              onClick={handleSaveCart}
            >
              ชำระเงิน
            </button>
          ) : (
            <Link to="/auth/login" className="w-full sm:w-auto">
              <button className="w-full px-4 sm:px-6 py-2 rounded-md mt-2 bg-blue-600 text-white hover:bg-blue-700 relative z-10 text-sm sm:text-base">
                เข้าสู่ระบบ
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListCarts;