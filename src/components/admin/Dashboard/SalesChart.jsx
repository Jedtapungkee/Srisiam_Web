import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { TrendingUp, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { th } from 'date-fns/locale';

const SalesChart = ({ data, loading, onPeriodChange, currentPeriod }) => {
  const periods = [
    { key: '7days', label: '7 วัน', icon: '📅' },
    { key: '30days', label: '30 วัน', icon: '📆' },
    { key: '12months', label: '12 เดือน', icon: '🗓️' }
  ];

  const formatXAxisLabel = (dateString) => {
    try {
      const date = parseISO(dateString);
      if (currentPeriod === '12months') {
        return format(date, 'MMM', { locale: th });
      }
      return format(date, 'd MMM', { locale: th });
    } catch (error) {
      return dateString;
    }
  };

  const formatTooltipLabel = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'dd MMMM yyyy', { locale: th });
    } catch (error) {
      return dateString;
    }
  };

  // compact number formatter (e.g. 1.2K, 1M)
  const formatNumberCompact = (num) => {
    try {
      return new Intl.NumberFormat('th-TH', { maximumFractionDigits: 1, notation: 'compact' }).format(num);
    } catch (e) {
      return num.toLocaleString();
    }
  };

  const formatCurrencyCompact = (num) => {
    try {
      // keep currency symbol but compact the number: ฿1.2K
      const compact = new Intl.NumberFormat('th-TH', { maximumFractionDigits: 1, notation: 'compact' }).format(num);
      return `฿${compact}`;
    } catch (e) {
      return `฿${num.toLocaleString()}`;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const salesEntry = payload.find((p) => p.dataKey === 'sales');
      const ordersEntry = payload.find((p) => p.dataKey === 'orders');
      return (
        <div className="bg-white p-3 border rounded shadow-sm text-sm">
          <div className="font-medium mb-1">{formatTooltipLabel(label)}</div>
          {salesEntry && (
            <div className="text-blue-600">ยอดขาย: ฿{Number(salesEntry.value).toLocaleString()}</div>
          )}
          {ordersEntry && (
            <div className="text-green-600">คำสั่งซื้อ: {ordersEntry.value} รายการ</div>
          )}
        </div>
      );
    }
    return null;
  };

  const totalSales = data?.reduce((sum, item) => sum + item.sales, 0) || 0;
  const totalOrders = data?.reduce((sum, item) => sum + item.orders, 0) || 0;

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              ยอดขายและคำสั่งซื้อ
            </CardTitle>
            <CardDescription>
              แสดงแนวโน้มยอดขายและจำนวนคำสั่งซื้อ
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {periods.map((period) => (
              <Button
                key={period.key}
                variant={currentPeriod === period.key ? "default" : "outline"}
                size="sm"
                onClick={() => onPeriodChange(period.key)}
                className="flex items-center gap-1"
              >
                <span>{period.icon}</span>
                {period.label}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Summary Stats */}
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              <Calendar className="w-3 h-3 mr-1" />
              ยอดขายรวม
            </Badge>
            <span className="font-bold text-lg">฿{totalSales.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-50 text-green-700">
              📦 คำสั่งซื้อ
            </Badge>
            <span className="font-bold text-lg">{totalOrders} รายการ</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-[400px] w-full">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 8, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                {/* only horizontal grid lines, lighter */}
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6EEF8" />

                <XAxis
                  dataKey="date"
                  tickFormatter={formatXAxisLabel}
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />

                {/* left Y: sales (currency) */}
                <YAxis
                  yAxisId="left"
                  tickFormatter={(value) => formatCurrencyCompact(value)}
                />

                {/* right Y: orders (count) */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(v) => (Number.isInteger(v) ? v : Math.round(v))}
                />

                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" wrapperStyle={{ fontSize: 12 }} />

                {/* bars for sales (primary visual) */}
                <Bar
                  yAxisId="left"
                  dataKey="sales"
                  name="ยอดขาย"
                  fill="url(#salesGradient)"
                  stroke="#3B82F6"
                  barSize={36}
                />

                {/* line for orders on the right axis */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  name="คำสั่งซื้อ"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;