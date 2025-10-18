import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'positive',
  description,
  trend,
  iconColor = 'blue' // เพิ่ม prop สำหรับกำหนดสีไอคอน
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600 bg-green-50';
      case 'negative':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↘';
    return '→';
  };

  // ฟังก์ชันกำหนดสีไอคอนตามประเภท
  const getIconColor = () => {
    switch (iconColor) {
      case 'blue':
        return 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/25';
      case 'green':
        return 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/25';
      case 'purple':
        return 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/25';
      case 'orange':
        return 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-orange-500/25';
      case 'pink':
        return 'bg-gradient-to-br from-pink-500 to-pink-600 shadow-pink-500/25';
      case 'indigo':
        return 'bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-indigo-500/25';
      case 'cyan':
        return 'bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-cyan-500/25';
      case 'red':
        return 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/25';
      default:
        return 'bg-gradient-to-br from-slate-500 to-slate-600 shadow-slate-500/25';
    }
  };

  // ฟังก์ชันกำหนดสีขอบซ้ายของการ์ด
  const getBorderColor = () => {
    switch (iconColor) {
      case 'blue':
        return 'border-l-blue-500';
      case 'green':
        return 'border-l-emerald-500';
      case 'purple':
        return 'border-l-purple-500';
      case 'orange':
        return 'border-l-orange-500';
      case 'pink':
        return 'border-l-pink-500';
      case 'indigo':
        return 'border-l-indigo-500';
      case 'cyan':
        return 'border-l-cyan-500';
      case 'red':
        return 'border-l-red-500';
      default:
        return 'border-l-slate-500';
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 border-l-4 ${getBorderColor()} backdrop-blur-sm bg-white/90`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 ${getIconColor()}`}>
            <Icon className="h-5 w-5 text-white drop-shadow-sm" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mb-2">{description}</p>
        )}
        {change && (
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className={`${getChangeColor()} px-2 py-1 text-xs`}>
              <span className="mr-1">{getTrendIcon()}</span>
              {change}
            </Badge>
            {trend && (
              <span className="text-xs text-muted-foreground">
                จากเดือนที่แล้ว
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;