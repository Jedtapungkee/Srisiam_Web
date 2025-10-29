import { listUserOrders } from '../../api/User';
import useSrisiamStore from '../../store/Srisiam-store';
import React, { useEffect, useState } from 'react';
import { Loader2, ShoppingBag, AlertCircle, RefreshCw } from 'lucide-react';
import OrderCard from './OrderCard';
import OrderFilters from './OrderFilters';
import EmptyOrders from './EmptyOrders';
import { toast } from 'sonner';
import { Button } from '../ui/button';

const OrderUser = () => {
  const token = useSrisiamStore((state) => state.token);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    orderStatus: "all"
  });

  // Fetch orders เมื่อ component mount
  useEffect(() => {
    fetchUserOrders();
  }, []);

  // Auto-refresh เมื่อกลับมาที่หน้านี้ (Page Visibility API)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !loading) {
        // เมื่อกลับมาที่หน้านี้ ให้ refresh ข้อมูลแบบเงียบๆ (ไม่แสดง toast)
        fetchUserOrders(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [token, loading]);

  useEffect(() => {
    applyFilters();
  }, [orders, filters]);

  const fetchUserOrders = async (showToast = false) => {
    try {
      // ถ้าไม่ใช่การโหลดครั้งแรก ใช้ refreshing state
      if (!loading) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const res = await listUserOrders(token);
      setOrders(res.data.orders || []);
      
      // รีเซ็ต filter เป็น "ทั้งหมด" เมื่อ refresh เพื่อให้เห็น order ที่อัปเดตสถานะใหม่
      if (filters.orderStatus !== "all") {
        setFilters({ orderStatus: "all" });
      }

      
      if (showToast) {
        toast.success("อัปเดตข้อมูลสำเร็จ", {
          description: "รายการคำสั่งซื้อถูกอัปเดตแล้ว"
        });
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    // Filter by order status
    if (filters.orderStatus !== "all") {
      filtered = filtered.filter(order => order.orderStatus === filters.orderStatus);
    }

    // Sort by newest first (using ID instead of createdAt for better accuracy)
    // ID เพิ่มขึ้นตามลำดับ ดังนั้น ID ที่สูงกว่า = order ที่สร้างใหม่กว่า
    filtered.sort((a, b) => b.id - a.id);

    setFilteredOrders(filtered);
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground">กำลังโหลดข้อมูลคำสั่งซื้อ...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <ShoppingBag className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">ประวัติการสั่งซื้อ</h1>
            <p className="text-muted-foreground">
              ติดตามและจัดการคำสั่งซื้อของคุณได้ที่นี่
            </p>
          </div>
        </div>
        
        {/* Refresh Button */}
        <Button
          onClick={() => fetchUserOrders(true)}
          disabled={refreshing}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'กำลังอัปเดต...' : 'รีเฟรช'}
        </Button>
      </div>

      {/* Show content based on orders */}
      {orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <>
          {/* Filters */}
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">กรองคำสั่งซื้อ</h2>
            <OrderFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Orders List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                คำสั่งซื้อ ({filteredOrders.length})
              </h2>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  ไม่พบคำสั่งซื้อที่ตรงกับเงื่อนไขการกรอง
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onOrderUpdate={fetchUserOrders}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderUser;