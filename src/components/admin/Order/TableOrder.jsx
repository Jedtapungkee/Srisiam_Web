import React, { useState, useEffect } from "react";
import { getOrdersAdmin, changeOrderStatus } from "../../../api/Admin";
import useSrisiamStore from "../../../store/Srisiam-store";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

import OrderProductDialog from "./OrderProductDialog";
import { 
  Package, 
  Search, 
  Filter, 
  Calendar,
  User,
  DollarSign,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  ShoppingBag
} from "lucide-react";

const TableOrder = () => {
  const token = useSrisiamStore((state) => state.token);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  useEffect(() => {
    hdlGetOrders(token);
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const hdlGetOrders = (token) => {
    setLoading(true);
    getOrdersAdmin(token)
      .then((res) => {
        setOrders(res.data);
        setFilteredOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to fetch orders");
        setLoading(false);
      });
  };

  const hdlChangeOrderStatus = (token, orderId, orderStatus) => {
    changeOrderStatus(token, orderId, orderStatus)
      .then((res) => {
        toast.success("อัพเดทสถานะออเดอร์สำเร็จ");
        hdlGetOrders(token);
      })
      .catch((err) => {
        console.log(err);
        toast.error("เกิดข้อผิดพลาดในการอัพเดทสถานะ");
      });
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id?.toString().includes(searchTerm) ||
        order.orderedBy?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderedBy?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderedBy?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Not Process":
        return "bg-red-100 text-red-700 border-red-200";
      case "Processing":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "Cancelled":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Not Process":
        return <Clock className="h-3 w-3" />;
      case "Processing":
        return <Loader className="h-3 w-3" />;
      case "Completed":
        return <CheckCircle className="h-3 w-3" />;
      case "Cancelled":
        return <XCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(price);
  };



  const getTotalItems = (products) => {
    return products?.reduce((total, product) => total + product.count, 0) || 0;
  };

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };






  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">จัดการคำสั่งซื้อ</h1>
          <p className="text-gray-600">จัดการและติดตามคำสั่งซื้อทั้งหมด</p>
        </div>
        <div className="flex items-center gap-2">
          <Package className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-blue-600">{orders.length}</span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหาด้วย ID, อีเมล, หรือชื่อลูกค้า..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="กรองตามสถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="Not Process">รอดำเนินการ</SelectItem>
                  <SelectItem value="Processing">กำลังดำเนินการ</SelectItem>
                  <SelectItem value="Completed">สำเร็จ</SelectItem>
                  <SelectItem value="Cancelled">ยกเลิก</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            รายการคำสั่งซื้อ ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">กำลังโหลดข้อมูล...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">ไม่พบคำสั่งซื้อ</p>
              <p className="text-gray-400">ลองเปลี่ยนเงื่อนไขการค้นหาหรือกรอง</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        ID คำสั่งซื้อ
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        ลูกค้า
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        วันที่สั่งซื้อ
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        ยอดรวม
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold">สถานะ</TableHead>
                    <TableHead className="font-semibold">จัดการ</TableHead>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        สรุปสินค้า (คลิกแถวเพื่อดูรายละเอียด)
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                      <TableRow 
                        key={order.id} 
                        className="hover:bg-blue-50 transition-colors cursor-pointer"
                        onClick={() => handleRowClick(order)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900">#{order.id}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="space-y-1">
                              <div className="font-medium text-gray-900">
                                {order.orderedBy?.firstName && order.orderedBy?.lastName 
                                  ? `${order.orderedBy.firstName} ${order.orderedBy.lastName}`
                                  : order.orderedBy?.firstName || 'ไม่ระบุชื่อ'
                                }
                              </div>
                              <div className="text-sm text-gray-600">
                                {order.orderedBy?.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="text-gray-900">
                            {formatDate(order.createdAt)}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="font-semibold text-green-600 text-lg">
                            {formatPrice(order.cartTotal)}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge className={`${getStatusColor(order.orderStatus)} flex items-center gap-1`}>
                            {getStatusIcon(order.orderStatus)}
                            {order.orderStatus === "Not Process" && "รอดำเนินการ"}
                            {order.orderStatus === "Processing" && "กำลังดำเนินการ"}
                            {order.orderStatus === "Completed" && "สำเร็จ"}
                            {order.orderStatus === "Cancelled" && "ยกเลิก"}
                          </Badge>
                        </TableCell>
                        
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Select
                            value={order.orderStatus}
                            onValueChange={(value) => hdlChangeOrderStatus(token, order.id, value)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Not Process">รอดำเนินการ</SelectItem>
                              <SelectItem value="Processing">กำลังดำเนินการ</SelectItem>
                              <SelectItem value="Completed">สำเร็จ</SelectItem>
                              <SelectItem value="Cancelled">ยกเลิก</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        
                        <TableCell className="min-w-[200px]">
                          <div className="space-y-2">
                            {/* Product Summary */}
                            <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                              <div className="p-1.5 bg-blue-100 rounded-full">
                                <ShoppingBag className="h-3 w-3 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {order.products?.length || 0} รายการ
                                </div>
                                <div className="text-xs text-gray-600">
                                  {getTotalItems(order.products)} ชิ้น
                                </div>
                              </div>
                            </div>

                            {/* Quick Product Preview */}
                            {order.products?.length > 0 && (
                              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                                <img
                                  src={order.products[0].product?.images?.[0]?.secure_url || 
                                       order.products[0].product?.images?.[0]?.url || 
                                       "/placeholder.png"}
                                  alt="Preview"
                                  className="h-6 w-6 object-cover rounded"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/placeholder.png";
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-medium text-gray-900 truncate">
                                    {order.products[0].product?.title}
                                  </div>
                                  {order.products.length > 1 && (
                                    <div className="text-xs text-gray-500">
                                      +{order.products.length - 1} อื่นๆ
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {/* Click hint */}
                            <div className="text-xs text-blue-600 text-center py-1">
                              คลิกเพื่อดูรายละเอียด
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Product Dialog */}
      {selectedOrder && (
        <OrderProductDialog 
          order={selectedOrder} 
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </div>
  );
};

export default TableOrder;