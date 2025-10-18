import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-medium">{formatTooltipLabel(label)}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === 'sales' ? 'ยอดขาย' : 'คำสั่งซื้อ'}: {
                entry.dataKey === 'sales' 
                  ? `฿${entry.value.toLocaleString()}` 
                  : `${entry.value} รายการ`
              }
            </p>
          ))}
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
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxisLabel}
                  className="text-xs"
                />
                <YAxis className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#salesGradient)"
                />
                
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;