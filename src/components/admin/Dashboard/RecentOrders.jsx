import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Clock, User, ShoppingBag } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';

const RecentOrders = ({ orders, loading }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Not Process':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Completed':
        return 'เสร็จสิ้น';
      case 'Processing':
        return 'กำลังดำเนินการ';
      case 'Not Process':
        return 'รอดำเนินการ';
      case 'Cancelled':
        return 'ยกเลิก';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    try {
      // แปลง string เป็น Date object โดยถือว่าเป็น UTC แล้วแปลงเป็นเวลาท้องถิ่น
      const date = new Date(dateString);
      
      // ตรวจสอบว่าวันที่ valid หรือไม่
      if (isNaN(date.getTime())) {
        return { relative: 'ไม่ทราบ', absolute: 'ไม่ทราบ' };
      }
      
      return {
        relative: formatDistanceToNow(date, { addSuffix: true, locale: th }),
        absolute: format(date, 'dd MMM yyyy, HH:mm', { locale: th })
      };
    } catch (error) {
      console.error('Error formatting date:', error);
      return { relative: 'ไม่ทราบ', absolute: 'ไม่ทราบ' };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          คำสั่งซื้อล่าสุด
        </CardTitle>
        <CardDescription>
          10 รายการคำสั่งซื้อล่าสุด
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {orders?.map((order) => {
              const dateInfo = formatDate(order.createdAt);
              
              return (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors border">
                  <div className="flex items-center space-x-3">
                    {/* Order Icon */}
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <ShoppingBag className="h-4 w-4 text-white" />
                    </div>
                    
                    {/* Order Info */}
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-sm">
                          คำสั่งซื้อ #{String(order.id).slice(-8)}
                        </p>
                        <Badge variant="outline" className={getStatusColor(order.orderStatus)}>
                          {getStatusText(order.orderStatus)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                        <User className="w-3 h-3" />
                        <span>
                          {order.orderedBy?.firstName} {order.orderedBy?.lastName}
                        </span>
                        <span>•</span>
                        <span title={dateInfo.absolute}>
                          {dateInfo.relative}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Total */}
                  <div className="text-right">
                    <p className="font-bold text-sm">
                      ฿{((order.cartTotal || 0) + (order.shippingCost || 0))?.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
            
            {(!orders || orders.length === 0) && (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">ยังไม่มีคำสั่งซื้อ</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOrders;