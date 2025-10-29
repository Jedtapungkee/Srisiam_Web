import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  FolderOpen,
  GraduationCap,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import useSrisiamStore from '../../store/Srisiam-store';
import { getDashboardStats, getSalesChart } from '../../api/Dashboard';
import { toast } from 'sonner';

// Import Dashboard Components
import StatCard from '../../components/admin/Dashboard/StatCard';
import SalesChart from '../../components/admin/Dashboard/SalesChart';
import TopProducts from '../../components/admin/Dashboard/TopProducts';
import RecentOrders from '../../components/admin/Dashboard/RecentOrders';

const Dashboard = () => {
  const token = useSrisiamStore((state) => state.token);
  
  const [dashboardData, setDashboardData] = useState({
    overview: {},
    topProducts: [],
    recentOrders: []
  });
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salesLoading, setSalesLoading] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState('7days');

  // Fetch dashboard statistics
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats(token);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('ไม่สามารถดึงข้อมูลแดชบอร์ดได้');
    } finally {
      setLoading(false);
    }
  }; 

  // Fetch sales chart data
  const fetchSalesData = async (period) => {
    try {
      setSalesLoading(true);
      const response = await getSalesChart(token, period);
      setSalesData(response.data);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      toast.error('ไม่สามารถดึงข้อมูลยอดขายได้');
    } finally {
      setSalesLoading(false);
    }
  };

  // Handle period change for sales chart
  const handlePeriodChange = (period) => {
    setCurrentPeriod(period);
    fetchSalesData(period);
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
      fetchSalesData(currentPeriod);
    }
  }, [token]);

  const { overview } = dashboardData;
  // console.log('Dashboard Data:', dashboardData);

  // Calculate revenue growth
  const revenueGrowth = overview.lastMonthRevenue > 0 
    ? (((overview.monthlyRevenue - overview.lastMonthRevenue) / overview.lastMonthRevenue) * 100).toFixed(1)
    : 0;

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">แดชบอร์ด</h1>
        <p className="text-gray-600">ภาพรวมการดำเนินงานของร้านค้า</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="สินค้าทั้งหมด"
          value={overview.totalProducts?.toLocaleString() || '0'}
          icon={Package}
          iconColor="blue"
          description="รายการสินค้าในระบบ"
          trend="up"
        />
        
        <StatCard
          title="ผู้ใช้ทั้งหมด"
          value={overview.totalUsers?.toLocaleString() || '0'}
          icon={Users}
          iconColor="purple"
          description="ผู้ใช้ที่ลงทะเบียน"
          trend="up"
        />

                
        <StatCard
          title="หมวดหมู่"
          value={overview.totalCategories?.toLocaleString() || '0'}
          icon={FolderOpen}
          iconColor="cyan"
          description="หมวดหมู่สินค้า"
        />
        
        <StatCard
          title="คำสั่งซื้อทั้งหมด"
          value={overview.totalOrders?.toLocaleString() || '0'}
          icon={ShoppingCart}
          iconColor="indigo"
          description="คำสั่งซื้อทั้งหมด"
          trend="up"
        />

      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="กำลังดำเนินการ"
          value={overview.processingOrders?.toLocaleString() || '0'}
          icon={Clock}
          iconColor="orange"
          description="คำสั่งซื้อที่กำลังดำเนินการ"
        />
        
        <StatCard
          title="เสร็จสิ้น"
          value={overview.completedOrders?.toLocaleString() || '0'}
          icon={CheckCircle}
          iconColor="green"
          description="คำสั่งซื้อที่เสร็จสิ้น"
        />
        
        <StatCard
          title="ยกเลิก"
          value={overview.cancelledOrders?.toLocaleString() || '0'}
          icon={XCircle}
          iconColor="red"
          description="คำสั่งซื้อที่ยกเลิก"
        />
                
        <StatCard
          title="ยอดขายรวม"
          value={`฿${overview.totalRevenue?.toLocaleString() || '0'}`}
          icon={DollarSign}
          iconColor="green"
          description="ยอดขายทั้งหมด"
          change={`${revenueGrowth}%`}
          changeType={revenueGrowth >= 0 ? 'positive' : 'negative'}
          trend={revenueGrowth >= 0 ? 'up' : 'down'}
        />

      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <SalesChart
            data={salesData}
            loading={salesLoading}
            onPeriodChange={handlePeriodChange}
            currentPeriod={currentPeriod}
          />
        </div>
        
        {/* Top Products */}
        <div className="lg:col-span-1">
          <TopProducts
            products={dashboardData.topProducts}
            loading={loading}
          />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1">
        <RecentOrders
          orders={dashboardData.recentOrders}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Dashboard;